import { getPublicStoreBySlug, getPublicProducts } from "@/lib/actions";
import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search, Star, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering so searchParams work instantly
export const dynamic = "force-dynamic";

// ---------------------------------------------------------
// 1. HELPER FUNCTIONS FOR FONTS
// ---------------------------------------------------------
const getGoogleFontLink = (fontName: string) => {
  const formatted = fontName.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${formatted}:wght@400;700;900&display=swap`;
};

const getFontFamily = (fontName: string) => {
  if (fontName === 'Playfair Display') return "'Playfair Display', serif";
  if (fontName === 'Roboto Mono') return "'Roboto Mono', monospace";
  if (fontName === 'Lobster') return "'Lobster', cursive";
  return "'Inter', sans-serif"; // Default
};

export default async function StoreFrontPage({
  params,
  searchParams
}: {
  params: { slug: string },
  searchParams: { [key: string]: string | undefined }
}) {

  // 2. Fetch Store Data
  const store = await getPublicStoreBySlug(params.slug);

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Store Not Found</h1>
        <p className="text-slate-500">The store you are looking for does not exist.</p>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  // 3. Fetch Products
  const products = await getPublicProducts(store.id);

  // ---------------------------------------------------------
  // 4. THE MAGICAL THEME ENGINE
  // ---------------------------------------------------------
  const theme = {
    // Colors
    color: searchParams.primary_color || store.primary_color || "#2563eb",
    bg: searchParams.background_color || store.background_color || "#ffffff",
    text: searchParams.text_color || store.text_color || "#0f172a",

    // Typography & Shape
    font: searchParams.font_family || store.font_family || "Inter",
    radius: searchParams.button_radius || store.button_radius || "12px",

    // Layout & Style
    align: searchParams.hero_align || store.hero_align || "center", // left, center, right
    card: searchParams.card_style || store.card_style || "shadow", // shadow, border, minimal

    // Content
    title: searchParams.hero_title || store.hero_title || "Step into the Future",
    subtitle: searchParams.hero_subtitle || store.hero_subtitle || "Premium products curated for you.",
    announce: searchParams.announcement_text || store.announcement_text, // Optional
  };

  // Helper for Hero Alignment Classes
  const alignClass = theme.align === 'center' ? 'items-center text-center' : theme.align === 'right' ? 'items-end text-right' : 'items-start text-left';

  return (
    <>
      {/* Dynamic Font Injection */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={getGoogleFontLink(theme.font)} rel="stylesheet" />

      <main
        className="w-full min-h-screen transition-colors duration-300"
        // Inject Global CSS Variables
        style={{
          backgroundColor: theme.bg,
          color: theme.text,
          fontFamily: getFontFamily(theme.font),
          "--brand-color": theme.color,
          "--radius": theme.radius,
          "--bg-color": theme.bg,
          "--text-color": theme.text
        } as React.CSSProperties}
      >
        {/* --- 1. ANNOUNCEMENT BAR --- */}
        {theme.announce && (
          <div
            className="w-full py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-center relative z-50"
            style={{ backgroundColor: theme.color, color: "#ffffff" }}
          >
            {theme.announce}
          </div>
        )}

        {/* --- 2. HEADER --- */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-black/5" style={{ backgroundColor: `${theme.bg}CC` }}>
          <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">

            {/* Logo */}
            <Link href={`/store/${store.slug}`} className="flex items-center gap-3 group">
              <div
                className="h-10 w-10 flex items-center justify-center text-white font-black text-lg shadow-lg transition-transform group-hover:scale-110"
                style={{ backgroundColor: theme.color, borderRadius: theme.radius }}
              >
                {store.name.slice(0, 1).toUpperCase()}
              </div>
              <span className="font-bold text-xl tracking-tight uppercase" style={{ color: theme.text }}>
                {store.name}
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 opacity-60 hover:opacity-100 transition-opacity">
                <Search className="w-5 h-5" />
              </button>

              <CartHeaderButton
                slug={store.slug}
                color={theme.color}
                radius={theme.radius}
              />
            </div>
          </div>
        </header>

        {/* --- 3. HERO SECTION (Dynamic Align) --- */}
        <section className="relative w-full pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
          {/* Background Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-10 blur-[100px] pointer-events-none rounded-full"
            style={{ backgroundColor: theme.color }}
          />

          <div className={`relative max-w-[1400px] mx-auto px-6 flex flex-col ${alignClass}`}>
            <Badge
              variant="outline"
              className="mb-8 px-4 py-1.5 shadow-sm font-bold tracking-wide uppercase text-[10px]"
              style={{
                borderRadius: theme.radius,
                borderColor: theme.text,
                color: theme.text,
                backgroundColor: 'transparent'
              }}
            >
              New Collection 2026
            </Badge>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-5xl uppercase whitespace-pre-line drop-shadow-sm">
              {theme.title}
            </h1>

            <p className="text-lg md:text-2xl opacity-70 mb-12 max-w-2xl leading-relaxed">
              {theme.subtitle}
            </p>

            <div className={`flex flex-col md:flex-row gap-4 w-full md:w-auto ${theme.align === 'center' ? 'justify-center' : theme.align === 'right' ? 'justify-end' : 'justify-start'}`}>
              <Button
                size="lg"
                className="h-14 px-10 text-base font-bold text-white shadow-xl hover:scale-105 transition-all border-none"
                style={{ backgroundColor: theme.color, borderRadius: theme.radius }}
              >
                Shop Now
              </Button>
            </div>
          </div>
        </section>

        {/* --- 4. TRUST BADGES --- */}
        <section className="border-y border-black/5" style={{ backgroundColor: theme.bg }}>
          <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "2-3 days across Lebanon" },
              { icon: ShieldCheck, title: "Secure Payment", desc: "Cash on Delivery or Card" },
              { icon: Star, title: "Top Quality", desc: "Curated premium items" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center justify-center gap-4">
                <div className="p-3 rounded-full bg-black/5">
                  <feature.icon className="w-6 h-6" style={{ color: theme.color }} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-sm uppercase tracking-wide">{feature.title}</h3>
                  <p className="text-xs opacity-60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 md:py-24">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6">
            <h2 className="text-xl md:text-3xl font-black tracking-tight uppercase mb-8 md:mb-12 border-b border-black/10 pb-4 md:pb-6">
              Featured Products
            </h2>

            {products && products.length > 0 ? (
              // MOBILE FIX: grid-cols-2 (2 items per row) instead of 1
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                {products.map((product: any) => (
                  <Link
                    href={`/store/${params.slug}/product/${product.id}`}
                    key={product.id}
                    className={`group transition-all duration-300 flex flex-col 
                      ${theme.card === 'shadow' ? 'bg-white shadow-md hover:shadow-xl' : theme.card === 'border' ? 'border border-black/10' : ''}`}
                    style={{ borderRadius: theme.radius, color: theme.card === 'shadow' ? '#0f172a' : theme.text }}
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/5] bg-black/5 overflow-hidden relative"
                      style={{
                        borderTopLeftRadius: theme.radius,
                        borderTopRightRadius: theme.radius,
                        // Conditional radius for bottom corners based on card style
                        borderBottomLeftRadius: theme.card === 'shadow' ? 0 : theme.radius,
                        borderBottomRightRadius: theme.card === 'shadow' ? 0 : theme.radius
                      }}>

                      {product.main_image_url ? (
                        <Image
                          src={product.main_image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}

                      {/* SMART BUTTON (Now visible on mobile) */}
                      <QuickAddButton product={product} color={theme.color} />
                    </div>

                    {/* Product Info */}
                    <div className="p-3 md:p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-sm md:text-base mb-1 leading-tight group-hover:opacity-70 transition-opacity line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <span className="font-medium text-sm md:text-base opacity-80">${product.price_usd}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-black/10 rounded-3xl opacity-50">
                <p className="font-medium">No products found.</p>
              </div>
            )}
          </div>
        </section>

        {/* --- 6. FOOTER --- */}
        <footer className="py-12 border-t border-black/10 mt-auto opacity-80">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-medium">© 2026 {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-50">Powered by</span>
              <span className="font-black tracking-tighter">SOUQELY</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}