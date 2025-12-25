import { createClient } from "@/lib/supabase-server";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import StoreClientPage from "@/components/StoreClientPage";

export default async function StorePage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  // 1. Fetch Store
  // Note: We use .select("*") to fetch everything including lbp_rate
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!store) {
    notFound();
  }

  // 2. Fetch Products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .eq("active", true)
    .order("created_at", { ascending: false });

  // 3. Render Client Component for interactivity (Currency Toggle)
  return <StoreClientPage store={store} products={products || []} />;
}
