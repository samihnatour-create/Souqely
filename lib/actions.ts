"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  console.log("Attempting to sign up:", email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("SignUp Error:", error);
    return { error: error.message };
  }

  console.log("SignUp Success:", data);
  return { success: "Check your email to confirm your account." };
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

  if (error && error.code !== "PGRST116") { // PGRST116 is "The result contains 0 rows"
    console.error("Get Store Error:", error);
    return null;
  }

  if (data) {
    return data;
  }

  // If no store exists, create a default one
  const defaultStoreName = `Store-${user.id.slice(0, 8)}`;
  const defaultSlug = defaultStoreName.toLowerCase();

  const { data: newStore, error: createError } = await supabase
    .from("stores")
    .insert({
      owner_id: user.id,
      name: "My Store",
      slug: defaultSlug,
      primary_color: "#2563eb",
      currency: "USD",
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

// Debug logging
console.log("Loaded lib/actions.ts");

