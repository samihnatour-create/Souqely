import { createClient } from "@/lib/supabase-server";
import DesignPageClient from "./design-client";

export default async function DesignPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return <div>Please log in.</div>;

    // Fetch the store
    const { data: store, error: dbError } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

    // DEBUGGING - This will now show the REAL status
    console.log("--- DEBUGGER ---");
    console.log("Logged In User:", user.id);
    console.log("Database Error:", dbError ? JSON.stringify(dbError, null, 2) : "None");
    console.log("Store Data:", store ? "Found" : "Null");

    return <DesignPageClient store={store} />;
}