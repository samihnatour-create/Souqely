"use server";

import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
                html: `<p>Your verification code is: <strong>${code}</strong></p>`,
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
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

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

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const lbp_rate = parseFloat(formData.get("lbp_rate") as string);
    const is_whish_enabled = formData.get("is_whish_enabled") === "on";
    const whish_number = formData.get("whish_number") as string;
    const is_omt_enabled = formData.get("is_omt_enabled") === "on";
    const omt_name = formData.get("omt_name") as string;

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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", user.id)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Get Store Error:", error);
        return null;
    }

    if (data) {
        return data;
    }

    const defaultStoreName = `Store-${user.id.slice(0, 8)}`;
    const defaultSlug = defaultStoreName.toLowerCase();

    const { data: newStore, error: createError } = await supabase
        .from("stores")
        .insert({
            owner_id: user.id,
            name: "My Store",
            slug: defaultSlug,
            primary_color: "#2563eb",
            currency_preference: "USD",
            lbp_rate: 89500,
        })
        .select()
        .single();

    if (createError) {
        console.error("Create Default Store Error:", createError);
        return null;
    }

    return newStore;
}
