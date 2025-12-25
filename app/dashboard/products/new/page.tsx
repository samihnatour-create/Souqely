import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: store, error } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (error || !store) {
    redirect("/dashboard");
  }

  return <ProductForm store={store} />;
}
