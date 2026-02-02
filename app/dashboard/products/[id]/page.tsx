import { createClient } from "@/lib/supabase-server";
import ProductForm from "@/components/ProductForm";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const supabase = createClient();

    // 1. Fetch Product
    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!product) notFound();

    // 2. Fetch Store
    const { data: store } = await supabase
        .from("stores")
        .select("*")
        .eq("id", product.store_id)
        .single();

    // 3. NEW: Fetch Variants
    const { data: variants } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", product.id);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            <ProductForm
                store={store}
                initialData={product}
                initialVariants={variants || []} // <--- Pass them here
            />
        </div>
    );
}