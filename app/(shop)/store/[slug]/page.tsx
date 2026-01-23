import { getPublicStoreBySlug, getPublicProducts } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, Heart, ChevronRight, Star, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StoreFrontPage({ params }: { params: { slug: string } }) {
  const store = await getPublicStoreBySlug(params.slug);
  if (!store) return <div>Store Not Found</div>;

  const products = await getPublicProducts(store.id);
  const brandColor = store.primary_color || "#2563eb";

  return (
    <main className="w-full min-h-screen bg-white selection:bg-blue-100">

      {/* 1. MINIMAL ANNOUNCEMENT */}
      <div className="w-full py-2 bg-slate-900 text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-center">
        Free Delivery in Beirut • 24-Hour Express Shipping
      </div>

      {/* 2. PREMIUM HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

          {/* Logo area - Sleek and simple */}
          <Link href={`/store/${store.slug}`} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20" style={{ backgroundColor: brandColor }}>
              {store.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 uppercase">{store.name}</span>
          </Link>

          {/* Centered Search - Minimalist style */}
          <div className="hidden lg:flex flex-1 max-w-md mx-10 relative group">
            <Input
              placeholder="Search your next pair..."
              className="w-full bg-slate-50 border-none rounded-full pl-12 h-11 focus-visible:ring-1 focus-visible:ring-slate-200 transition-all text-sm"
            />
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-slate-900" />
          </div>

          {/* Utility Icons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-600 hover:text-slate-900">
              <Heart className="h-5 w-5" />
            </Button>
            <button className="flex items-center gap-2 bg-slate-900 text-white py-2 px-5 rounded-full hover:bg-slate-800 transition-all shadow-md shadow-slate-200">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-bold">Cart (0)</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION - Focus on "Vibe" rather than repeated name */}
      <section className="relative w-full pt-16 pb-24 md:pt-24 md:pb-32 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10 flex flex-col items-center text-center">
          <Badge className="bg-white text-slate-500 border-slate-100 mb-8 hover:bg-white px-4 py-1 rounded-full shadow-sm font-medium">
            New Summer Arrivals
          </Badge>

          {/* Value Prop instead of repeating store name */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85] mb-8 max-w-4xl">
            STEP INTO THE <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${brandColor}, #64748b)` }}>
              FUTURE OF STYLE.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-xl leading-relaxed">
            Premium footwear curated for the modern explorer. Quality materials, unmatched comfort.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="rounded-full px-12 h-14 text-base font-bold text-white shadow-2xl hover:scale-105 transition-all border-none" style={{ backgroundColor: brandColor }}>
              Explore Collection
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-12 h-14 text-base border-slate-200 hover:bg-slate-50 font-semibold">
              Our Story
            </Button>
          </div>
        </div>
      </section>

      {/* 4. TRUST BADGES - Very Shopify-style */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 border-y border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex items-center gap-3 text-slate-600">
          <Truck className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Fast Shipping</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Secure Payments</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Star className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Top Quality</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Easy Returns</span>
        </div>
      </div>

      {/* 5. PRODUCT CATALOG */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Featured Drops</h2>
            <p className="text-slate-400 font-medium">Hand-picked styles just for you.</p>
          </div>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <button className="text-slate-900 border-b-2 border-slate-900 pb-1">All</button>
            <button className="hover:text-slate-900 transition-colors">Lifestyle</button>
            <button className="hover:text-slate-900 transition-colors">Running</button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              {/* Modern Card Layout */}
              <div className="aspect-[3/4] rounded-3xl bg-slate-50 overflow-hidden relative mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-200">
                {product.main_image_url ? (
                  <img src={product.main_image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200 font-black italic">SOUQELY</div>
                )}

                {/* Quick View Button (Shopify Style) */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                  <Button className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all rounded-full bg-white text-slate-900 font-bold px-8 hover:bg-slate-100 border-none shadow-xl">
                    Quick Buy
                  </Button>
                </div>
              </div>

              <div className="space-y-2 px-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{product.name}</h3>
                </div>
                <p className="text-slate-400 text-sm font-medium">{product.category || 'Lifestyle'}</p>
                <p className="text-xl font-black text-slate-900 pt-1">${product.price_usd?.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MINIMAL FOOTER */}
      <footer className="border-t border-slate-100 py-12 mt-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-400 font-medium tracking-tight">
            &copy; {new Date().getFullYear()} <span className="text-slate-900 font-bold">{store.name}</span>.
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="#" className="hover:text-slate-900">Privacy</Link>
            <Link href="#" className="hover:text-slate-900">Terms</Link>
            <Link href="#" className="hover:text-slate-900">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}