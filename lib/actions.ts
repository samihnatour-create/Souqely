"use server";

import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sendTelegramNotification } from "@/lib/telegram";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function sendVerificationEmail(email: string, code: string) {
    if (!RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Verification code:", code);
        return;
    }

    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "Souqely <team@souqely.com>", // CHANGE THIS TO YOUR DOMAIN
                to: [email],
                subject: "Verify your Souqely Account",
                html: `
  <div style="font-family: sans-serif; padding: 20px; color: #333;">
    <h2>Welcome to Souqely</h2>
    <p>To finish setting up your account, please use the following verification code:</p>
    <div style="background: #f4f4f4; padding: 10px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 5px;">
      ${code}
    </div>
    <p style="font-size: 12px; color: #666; margin-top: 20px;">
      If you did not request this, please ignore this email.
    </p>
  </div>
`
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Resend API Error:", error);
        }
    } catch (err) {
        console.error("Failed to send email:", err);
    }
}

export async function signUp(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    // 1. Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    // Handle "User already registered"
    if (error?.message?.includes("User already registered")) {
        // Check if they are verified in your profiles table
        const supabaseAdmin = createAdminClient();
        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("id, is_verified")
            .eq("email", email) // Ensure you have email in your profiles table or use a join
            .single();

        if (profile && !profile.is_verified) {
            // 1. Generate new code
            const newCode = Math.floor(100000 + Math.random() * 900000).toString();

            // 2. Update the code in the DB
            await supabaseAdmin
                .from("profiles")
                .update({ verification_code: newCode })
                .eq("id", profile.id);

            // 3. Resend the email
            await sendVerificationEmail(email, newCode);

            // 4. Redirect them back to the verify page
            redirect("/auth/verify");
        }

        return { error: "This email is already verified. Please login." };
    }

    if (error) return { error: error.message };

    // 2. Use "data.user" to create the profile
    if (data && data.user) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // We use the Admin client because the new user is still "locked out" by RLS
        const supabaseAdmin = createAdminClient();

        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .upsert({
                id: data.user.id, // Must be data.user, NOT formData.user
                verification_code: code,
                is_verified: false,
            });

        if (profileError) {
            console.error("Profile Error:", profileError);
            return { error: "Failed to create profile record." };
        }

        // 3. Send the email via Resend
        await sendVerificationEmail(email, code);
        redirect("/auth/verify");
    }

    return { success: "Account created! Check your email for the code." };
}

export async function verifyCode(prevState: any, formData: FormData) {
    const code = formData.get("code") as string;
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("verification_code")
        .eq("id", user.id)
        .single();

    if (!profile || profile.verification_code !== code) {
        return { error: "Invalid verification code" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ is_verified: true, verification_code: null })
        .eq("id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/", "layout");

    redirect("/dashboard");
}

export async function resendCode() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const { error } = await supabase
        .from("profiles")
        .update({ verification_code: code })
        .eq("id", user.id);

    if (error) return { error: error.message };

    if (user.email) {
        await sendVerificationEmail(user.email, code);
    }

    return { success: "Verification code resent!" };
}

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/dashboard");
}

export async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
}

export async function updateStoreSettings(formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    // 1. Extract all fields
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const lbp_rate = parseFloat(formData.get("lbp_rate") as string);

    // Payment Settings
    const is_whish_enabled = formData.get("is_whish_enabled") === "on";
    const whish_number = formData.get("whish_number") as string;
    const is_omt_enabled = formData.get("is_omt_enabled") === "on";
    const omt_name = formData.get("omt_name") as string;

    // 🟢 NEW: Telegram Chat ID
    const telegram_chat_id = formData.get("telegram_chat_id") as string;

    // 2. Update Database
    const { error } = await supabase
        .from("stores")
        .update({
            name,
            phone,
            lbp_rate,
            is_whish_enabled,
            whish_number,
            is_omt_enabled,
            omt_name,
            telegram_chat_id, // 🟢 Save the ID
        })
        .eq("owner_id", user.id);

    if (error) {
        console.error("Update Store Error:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/settings");
    return { success: "Store settings updated successfully" };
}
export async function getStoreSettings() {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return null;

    // Use .limit(1) instead of .single() to avoid crashes if multiple stores exist
    const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", user.id)
        .limit(1);

    if (error) {
        console.error("Supabase Query Error:", error.message);
        return null;
    }

    // data is an array because of .limit(1)
    if (!data || data.length === 0) {
        console.log("No store found for user:", user.id);
        return null;
    }

    console.log("Store found:", data[0].name);
    return data[0];
}
export async function createStore(prevState: any, formData: FormData) {
    console.log("--- CREATE STORE ACTION TRIGGERED ---");
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in" };

    // 1. Extract Text Data
    const name = formData.get("name") as string;
    const business_stage = formData.get("business_stage") as string;
    const product_category = formData.get("product_category") as string;
    const catalog_size = formData.get("catalog_size") as string;
    const social_handle = formData.get("social_handle") as string;
    const primary_color = formData.get("primary_color") as string || "#2563eb";

    // 2. Create Slug
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    // 3. HANDLE FILE UPLOAD (New Logic)
    const logoFile = formData.get("logo") as File; // We will name the input "logo"
    let logo_url = null;

    if (logoFile && logoFile.size > 0) {
        // Create a unique filename: store-slug + timestamp
        const filename = `${slug}-${Date.now()}-${logoFile.name}`;

        const { data, error: uploadError } = await supabase
            .storage
            .from("store-logos") // Must match the bucket name you created
            .upload(filename, logoFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Upload failed:", uploadError);
            // We continue without logo if upload fails, or you can return an error
        } else {
            // Get the Public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from("store-logos")
                .getPublicUrl(filename);

            logo_url = publicUrl;
        }
    }

    // 4. Insert into Database
    const { error } = await supabase
        .from("stores")
        .insert({
            owner_id: user.id,
            name: name,
            slug: slug,
            business_stage: business_stage,
            product_category: product_category,
            catalog_size: catalog_size,
            social_handle: social_handle,
            logo_url: logo_url, // Saved the generated URL
            primary_color: primary_color,
            currency_preference: "USD",
            lbp_rate: 89500,
            is_whish_enabled: false
        });

    if (error) {
        if (error.code === "23505") return { error: "This store name is already taken." };
        return { error: error.message };
    }

    revalidatePath("/dashboard", "page");
    revalidatePath("/", "layout");
    redirect("/dashboard");
}
export async function createProduct(prevState: any, formData: FormData) {
    const supabase = createClient();

    // 1. Check Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in to add products" };

    // 2. Find the Store belonging to this user
    // We need the store_id to link the product correctly
    const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

    if (storeError || !store) {
        return { error: "Store not found. Please create a store first." };
    }

    // 3. Extract Data from Form
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    // If you have an image upload, you'd handle the URL here. 
    // For now, we'll assume a placeholder or a text URL input.
    const image_url = formData.get("image_url") as string || null;

    // 4. Validation
    if (!name || !price) {
        return { error: "Name and Price are required" };
    }

    // 5. Insert into Database
    const { error } = await supabase
        .from("products")
        .insert({
            store_id: store.id, // Links product to your store
            name: name,
            description: description,
            price: price,
            category: category, // The new column you added
            image_url: image_url
        });

    if (error) {
        console.error("Create Product Error:", error);
        return { error: "Failed to create product" };
    }

    // 6. Refresh the Products Page
    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
}
export async function updateProduct(prevState: any, formData: FormData) {
    const supabase = createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in" };

    // 2. Extract Data
    // We expect the "id" to be passed as a hidden input in your form
    const productId = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const stock = parseInt(formData.get("stock") as string);
    const image_url = formData.get("image_url") as string || null;

    if (!productId) return { error: "Product ID is missing" };

    // 3. Update Database
    const { error } = await supabase
        .from("products")
        .update({
            name,
            description,
            price,
            category,
            stock,
            image_url,
            // Add image_url here if/when you handle file uploads
        })
        .eq("id", productId)
        // The RLS policy you just ran ensures they can only update THEIR own products
        .select();

    if (error) {
        console.error("Update Product Error:", error);
        return { error: "Failed to update product" };
    }

    // 4. Redirect back to list
    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
}
export async function getStoreProducts(storeId: string, categoryFilter?: string) {
    const supabase = createClient();

    let query = supabase
        .from("products")
        .select("*, product_variants(*)")
        .eq("store_id", storeId)
        .eq("active", true)
        .order("created_at", { ascending: false });

    // If a filter is provided, add it to the query
    if (categoryFilter && categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
    }

    const { data, error } = await query;
    if (error) console.error("Error fetching products:", error);
    return data || [];
}
export async function getUniqueCategories(storeId: string) {
    const supabase = createClient();

    // Fetch only the 'category' column for this store
    const { data, error } = await supabase
        .from("products")
        .select("category")
        .eq("store_id", storeId)
        .not("category", "is", null); // Exclude nulls

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    // specific logic to remove duplicates (Set) and empty strings
    const uniqueCategories = Array.from(new Set(data.map(item => item.category)))
        .filter(cat => cat !== "") // Remove empty strings if any
        .sort();

    return uniqueCategories;
}
// In lib/actions.ts

export async function getDashboardStats(storeId: string) {
    const supabase = createClient();

    // 1. Get Product Count
    const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("store_id", storeId)
        .eq("active", true);

    // 2. Get All Orders (for totals)
    const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", storeId)
        .neq("status", "cancelled")
        .order("created_at", { ascending: false }); // Latest first

    if (error) {
        console.error("Error fetching orders:", error);
        return {
            productCount: productCount || 0,
            orderCount: 0,
            revenue: 0,
            pendingCount: 0,
            recentOrders: []
        };
    }

    // 3. Calculate Stats
    const orderCount = orders.length;
    const revenue = orders?.reduce((sum, order) => sum + (order.total_usd || 0), 0);

    // Count how many are "pending" (Actionable metric!)
    const pendingCount = orders.filter(o => o.status === 'pending').length;

    // Get the last 5 orders for the table
    const recentOrders = orders.slice(0, 5);

    return {
        productCount: productCount || 0,
        orderCount: orderCount,
        revenue: revenue,
        pendingCount,
        recentOrders
    };
}

export async function getStoreOrders(storeId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false }); // Newest first

    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    }

    return data;
}
// Add to lib/actions.ts

// Add to lib/actions.ts

export async function getOrderDetails(orderId: string) {
    const supabase = createClient();

    // Fetch Order + Linked Items
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (*)
    `)
        .eq('id', orderId)
        .single();

    if (error) return null;
    return data;
}
// Fetch store details by SLUG (Public)
export async function getPublicStoreBySlug(slug: string) {
    const supabase = createClient();

    // 1. Get the Store ID first using the slug
    const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("slug", slug)
        .single();

    return store;
}
export async function getPublicProducts(storeId: string) {
    const supabase = createClient();

    const { data } = await supabase
        .from("products")
        // 🟢 FIX: Add product_variants(*) here
        .select("*, product_variants(*)")
        .eq("store_id", storeId)
        .eq("active", true);

    return data || [];
}
// 0. Define Helper Types
type TrustBadge = {
    icon: string;
    title: string;
    desc: string;
};

// 1. Define the Input Type
type StoreDesignData = {
    primary_color: string;
    hero_title: string;
    hero_subtitle: string;
    announcement_text: string;
    button_radius: string;
    font_family: string;
    background_color: string;
    text_color: string;
    hero_align: string;
    card_style: string;
    hero_badge_text: string;
    trust_badges: TrustBadge[];
    template?: string;
    header_name?: string;
    logo_url?: string;
    updated_at?: string;
    hero_image_url?: string;
};

// 2. Define the Output Type
type ActionResponse = {
    success: boolean;
    error?: string;
};

export async function updateStoreDesign(storeId: string, data: StoreDesignData): Promise<ActionResponse> {
    const supabase = createClient();

    console.log("Updating Store:", storeId);

    // 1. Perform the Update
    const { error } = await supabase
        .from("stores")
        .update({
            primary_color: data.primary_color,
            hero_title: data.hero_title,
            hero_subtitle: data.hero_subtitle,
            announcement_text: data.announcement_text,
            button_radius: data.button_radius,
            font_family: data.font_family,
            background_color: data.background_color,
            text_color: data.text_color,
            hero_align: data.hero_align,
            card_style: data.card_style,
            hero_badge_text: data.hero_badge_text,
            trust_badges: data.trust_badges,
            template: data.template || "modern",
            header_name: data.header_name,
            updated_at: new Date().toISOString(),
            logo_url: data.logo_url,
            hero_image_url: data.hero_image_url,
        })
        .eq("id", storeId);

    if (error) {
        console.error("Supabase Error:", error);
        return { success: false, error: error.message };
    }

    // 2. 🟢 CRITICAL FIX: Fetch the Slug for Revalidation
    // We cannot assume the URL uses the ID. We must find the public slug.
    const { data: store } = await supabase
        .from("stores")
        .select("slug")
        .eq("id", storeId)
        .single();

    // 3. Revalidate Everything
    revalidatePath("/dashboard/design"); // Update the editor

    if (store && store.slug) {
        // Clear the actual public storefront cache
        revalidatePath(`/store/${store.slug}`);
        // Clear the layout just in case headers/fonts are global
        revalidatePath(`/store/${store.slug}`, 'layout');
    }

    return { success: true };
}
export async function getProductById(productId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching product by ID:", error.message);
        return null;
    }

    return data;
}
export async function createOrder(orderData: any) {
    // 1. Log that we reached the server
    console.log("SERVER: Starting createOrder for slug:", orderData.store_slug);

    const supabase = createAdminClient();

    try {
        // 2. Fetch Store Details (Added name & telegram_chat_id)
        const { data: store, error: storeError } = await supabase
            .from("stores")
            .select("id, lbp_rate, name, telegram_chat_id") // 🟢 UPDATED
            .eq("slug", orderData.store_slug)
            .single();

        if (storeError || !store) {
            console.error("SERVER ERROR: Store fetch failed:", storeError);
            return { success: false, error: "Could not find store details." };
        }

        // 3. Insert Order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert([
                {
                    store_id: store.id,
                    customer_name: orderData.customer_name,
                    customer_phone: orderData.customer_phone,
                    customer_address: orderData.customer_address,
                    payment_method: orderData.payment_method,
                    total_usd: orderData.total,
                    lbp_rate_at_order: store.lbp_rate || 89500,
                    status: 'pending'
                }
            ])
            .select('id')
            .single();

        if (orderError) {
            console.error("SERVER ERROR: Order insert failed:", orderError);
            return { success: false, error: "Order failed: " + orderError.message };
        }

        // 🟢 4. SEND TELEGRAM NOTIFICATION (Fire & Forget)
        // We do this immediately after order creation. We do NOT 'await' it
        // because we don't want to make the customer wait for the notification to send.
        if (store.telegram_chat_id) {
            const message = `
🚨 <b>New Order Received!</b>

🏪 <b>Store:</b> ${store.name}
💰 <b>Amount:</b> $${orderData.total}
👤 <b>Customer:</b> ${orderData.customer_name}
📞 <b>Phone:</b> ${orderData.customer_phone}
📍 <b>Address:</b> ${orderData.customer_address}

<a href="https://souqely.com/dashboard/orders">👉 View Order</a>
`;
            sendTelegramNotification(store.telegram_chat_id, message).catch(err =>
                console.error("Telegram Send Failed:", err)
            );
        }

        // 5. Insert Items & Deduct Stock
        if (orderData.items && orderData.items.length > 0) {

            // A. Batch Insert into 'order_items'
            const itemsToInsert = orderData.items.map((item: any) => ({
                order_id: order.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));

            const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);

            if (itemsError) {
                console.error("SERVER ERROR: Items insert failed:", itemsError);
            } else {
                // B. Deduct Stock (Loop)
                for (const item of orderData.items) {
                    const { error: stockError } = await supabase.rpc('decrement_stock', {
                        row_id: item.id,
                        quantity_to_subtract: item.quantity,
                        variant_id: item.variant_id || null
                    });

                    if (stockError) {
                        console.error(`SERVER WARNING: Failed to update stock for product ${item.name}:`, stockError);
                    }
                }
            }
        }

        return { success: true, data: [order] };

    } catch (err: any) {
        console.error("SERVER CRITICAL CRASH:", err);
        return { success: false, error: "Server Exception: " + err.message };
    }
}

export async function uploadOrderProof(formData: FormData) {
    const supabase = createClient();
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;

    // 1. Upload to Supabase Storage (Bucket name: 'order-proofs')
    const fileName = `${orderId}-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("order-proofs")
        .upload(fileName, file);

    if (uploadError) return { success: false, error: uploadError.message };

    // 2. Get the public URL
    const { data: urlData } = supabase.storage.from("order-proofs").getPublicUrl(fileName);

    // 3. Update the order row with the URL and keep status 'pending'
    const { error: updateError } = await supabase
        .from("orders")
        .update({ payment_proof_url: urlData.publicUrl })
        .eq("id", orderId);

    if (updateError) return { success: false, error: updateError.message };

    return { success: true };
}
export async function acceptOrder(orderId: string) {
    // Use admin client to bypass RLS if needed, otherwise standard client
    const supabase = createClient();

    const { error } = await supabase
        .from('orders')
        .update({ status: 'shipped' }) // or 'processing'
        .eq('id', orderId);

    if (error) return { success: false, error: error.message };
    return { success: true };
}