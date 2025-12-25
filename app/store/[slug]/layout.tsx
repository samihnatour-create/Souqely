import StoreHeader from "@/components/StoreHeader";
import { createClient } from "@/lib/supabase-server";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: store } = await supabase
    .from("stores")
    .select("name")
    .eq("slug", params.slug)
    .single();
    
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader storeName={store?.name || "Store"} slug={params.slug} />
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
