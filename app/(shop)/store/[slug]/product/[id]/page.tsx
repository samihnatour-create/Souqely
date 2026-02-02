import { getProductById, getPublicStoreBySlug } from "@/lib/actions";
import { createClient } from "@/lib/supabase-server"; // Ensure you fetch variants
import { ChevronLeft, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductInteraction from "@/components/store/product-interaction";
import { CartSheet } from "@/components/store/cart-sheet";
import { CartHeaderButton } from "@/components/store/store-interactions";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const supabase = createClient();

  // 1. Fetch Data
  const [store, product, { data: variants }] = await Promise.all([
    getPublicStoreBySlug(params.slug),
    getProductById(params.id),
    supabase.from("product_variants").select("*").eq("product_id", params.id)
  ]);

  if (!store || !product) return notFound();

  const theme = {
    color: store.primary_color || "#000000",
    radius: store.button_radius || "12px",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Back Link */}
      <div className="h-16 border-b flex items-center justify-between px-6 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        {/* Left: Back Link */}
        <Link href="/" className="flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100">
          <ChevronLeft className="w-4 h-4" /> Back to Store
        </Link>

        {/* Right: Cart Button */}
        <CartHeaderButton
          slug={params.slug}
          color={theme.color}
          radius={theme.radius}
        />
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT: Image */}
        <div className="aspect-square bg-slate-50 relative rounded-[2.5rem] overflow-hidden shadow-inner">
          {product.main_image_url ? (
            <Image src={product.main_image_url} alt={product.name} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
          )}
        </div>

        {/* RIGHT: Details & Interaction */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
              {product.name}
            </h1>
            <div className="text-3xl font-bold" style={{ color: theme.color }}>
              ${product.price_usd}
            </div>
          </div>

          <div className="prose prose-slate text-slate-500 max-w-none">
            <p className="leading-relaxed">{product.description || "No description available."}</p>
          </div>

          {/* 🟢 CLIENT COMPONENT GOES HERE */}
          <ProductInteraction
            product={product}
            variants={variants || []}
            theme={theme}
          />

          {/* Perks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
              <Truck className="w-5 h-5 opacity-40" />
              <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Fast Delivery</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 opacity-40" />
              <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Guaranteed</span>
            </div>
            {/* Add this at the bottom so it's present */}
            <CartSheet
              slug={params.slug}
              color={theme.color}
              radius={theme.radius}
              trigger={null} // No trigger needed, controlled by Context
            />
          </div>
        </div>
      </div>
    </div>
  );
}