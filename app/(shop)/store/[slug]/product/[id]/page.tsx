import { getProductById, getPublicStoreBySlug } from "@/lib/actions";
import { QuickAddButton } from "@/components/store/store-interactions"; // Reuse your smart button
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Truck, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  // 1. Parallel Fetching for Speed
  const storeData = getPublicStoreBySlug(params.slug);
  const productData = getProductById(params.id);
  const [store, product] = await Promise.all([storeData, productData]);

  if (!store || !product) return notFound();

  // 2. Extract Theme (DB Only - Subpages don't need live preview params usually)
  const theme = {
    color: store.primary_color || "#2563eb",
    radius: store.button_radius || "12px",
    font: store.font_family || "Inter",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <div className="h-16 border-b flex items-center px-6">
        <Link href={`/store/${params.slug}`} className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100">
          <ChevronLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-50 relative rounded-2xl overflow-hidden shadow-sm">
            {product.main_image_url ? (
              <Image src={product.main_image_url} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
            )}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">{product.name}</h1>
            <div className="text-3xl font-medium" style={{ color: theme.color }}>
              ${product.price_usd}
            </div>
          </div>

          <div className="prose prose-slate text-slate-500">
            <p>{product.description || "No description available for this product."}</p>
          </div>

          {/* Add to Cart Section */}
          <div className="pt-6 border-t border-slate-100">
            {/* We reuse the logic but style it as a big button */}
            <div className="flex gap-4">
              <QuickAddButton product={product} color={theme.color} />
              {/* Note: QuickAddButton is styled as a circle. For the product page, 
                      we ideally want a big rectangle button. 
                      For speed, let's use the standard button below and make a new interaction if needed. 
                  */}
              <Button
                className="flex-1 h-14 text-lg font-bold shadow-xl hover:scale-[1.02] transition-transform"
                style={{ backgroundColor: theme.color, borderRadius: theme.radius }}
              // You might want to wire this to addItem in a client component for full UX
              >
                Add to Cart (Wired via Component)
              </Button>
            </div>
            <p className="text-xs text-center mt-4 text-slate-400">Secure Checkout • Free Returns</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
              <Truck className="w-5 h-5 opacity-50" />
              <span className="text-xs font-bold uppercase opacity-60">Fast Delivery</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 opacity-50" />
              <span className="text-xs font-bold uppercase opacity-60">Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}