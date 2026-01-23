"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function joinWaitlist(formData: FormData) {
    const supabase = createClient();
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
        return { error: "Please enter a valid email address." };
    }

    const { error } = await supabase
        .from("waitlist")
        .insert([{ email }]);

    if (error) {
        // Check for duplicate email error (Postgres code 23505)
        if (error.code === "23505") {
            return { message: "You're already on the list! We'll be in touch soon." };
        }
        return { error: "Something went wrong. Please try again." };
    }

    revalidatePath("/");
    return { success: true, message: "Welcome to the future of Lebanese e-commerce! We'll email you soon." };
}