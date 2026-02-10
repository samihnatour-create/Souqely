import { getProductById, getPublicStoreBySlug, getPublicProducts } from "@/lib/actions"; // 🟢 Fixed import
import { createClient } from "@/lib/supabase-server";
import { ChevronLeft, Truck, ShieldCheck, Star, ArrowRight } from "lucide-react";
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

  const [store, product, { data: variants }, allProducts] = await Promise.all([
    getPublicStoreBySlug(params.slug),
    getProductById(params.id),
    supabase.from("product_variants").select("*").eq("product_id", params.id),
    getPublicProducts(params.slug) // 🟢 Fixed function name
  ]);

  if (!store || !product) return notFound();

  const theme = {
    color: store.primary_color || "#000000",
    radius: store.button_radius || "12px",
  };

  // UPSELL LOGIC (Ensures they appear with correct data)
  const otherProducts = allProducts?.filter((p: any) => p.id !== product.id) || [];
  let sameCat = otherProducts.filter((p: any) => p.category?.toLowerCase() === product.category?.toLowerCase());
  let diffCat = otherProducts.filter((p: any) => p.category?.toLowerCase() !== product.category?.toLowerCase());

  const upsellProducts = [
    sameCat[0] || otherProducts[0],
    diffCat[0] || otherProducts[1]
  ].filter(Boolean).filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* 🟢 ANNOUNCEMENT BAR (Fixed Height) */}
      {store.announcement_text && (
        <div
          className="w-full h-[40px] flex items-center justify-center px-4 text-center text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white sticky top-0 z-50"
          style={{ backgroundColor: theme.color }}
        >
          {store.announcement_text}
        </div>
      )}

      {/* 🟢 NAVIGATION (Offset by Announcement Bar Height) */}
      <nav
        className="h-16 flex items-center justify-between px-4 md:px-12 sticky bg-white/80 backdrop-blur-md z-40 border-b border-slate-100"
        style={{ top: store.announcement_text ? '40px' : '0px' }}
      >
        <Link href={`/`} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        <CartHeaderButton slug={params.slug} color={theme.color} radius={theme.radius} />
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* LEFT: Image */}
          <div className="w-full lg:sticky lg:top-32">
            <div className="aspect-square bg-slate-50 relative rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
              {product.main_image_url ? (
                <Image src={product.main_image_url} alt={product.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200 font-bold">No Image</div>
              )}
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="w-full flex flex-col">
            <header className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                {product.category || "General"}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-2">
                {product.name}
              </h1>
            </header>

            <div className="prose prose-slate max-w-none mb-10">
              <p className="text-slate-500 text-lg leading-relaxed">
                {product.description || "Crafted with premium materials for ultimate comfort and style."}
              </p>
            </div>

            <ProductInteraction
              product={product}
              variants={variants || []}
              theme={theme}
            />

            {/* Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 border-t pt-10 border-slate-100">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Fast Global Shipping</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Secure Payments</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full my-20" />

        {/* UPSELLS SECTION */}
        {upsellProducts.length > 0 && (
          <section className="pb-20">
            <div className="flex items-end justify-between mb-10">
              <h3 className="text-3xl font-black text-slate-900">Recommended</h3>
              <Link href={`/`} className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                Shop All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upsellProducts.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group bg-white p-5 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 hover:shadow-xl transition-all"
                >
                  <div className="w-24 h-24 relative rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50">
                    <Image src={p.main_image_url || ""} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-black text-slate-900 truncate">{p.name}</h4>
                    <div className="text-lg font-bold" style={{ color: theme.color }}>${p.price_usd}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>


      <CartSheet slug={params.slug} color={theme.color} radius={theme.radius} trigger={null} />
    </div>
  );
}