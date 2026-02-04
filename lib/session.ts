import { createClient } from "@/lib/supabase-server";

export async function getUserSession() {
    const supabase = createClient();
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) return null;

        return session.user;
    } catch (error) {
        console.error("Error fetching session:", error);
        return null;
    }
}