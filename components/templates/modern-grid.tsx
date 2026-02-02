"use client";

import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search, Star, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// 1. HELPER FUNCTIONS (Kept Local)
const getGoogleFontLink = (fontName: string) => {
    const formatted = fontName ? fontName.replace(/\s+/g, '+') : 'Inter';
    return `https://fonts.googleapis.com/css2?family=${formatted}:wght@400;700;900&display=swap`;
};

const getFontFamily = (fontName: string) => {
    if (fontName === 'Playfair Display') return "'Playfair Display', serif";
    if (fontName === 'Roboto Mono') return "'Roboto Mono', monospace";
    if (fontName === 'Lobster') return "'Lobster', cursive";
    return "'Inter', sans-serif";
};

// 2. DEFINE PROPS
interface ModernGridProps {
    store: any;
    products: any[];
    searchParams?: { [key: string]: string | undefined };
}

export default function ModernGrid({ store, products, searchParams = {} }: ModernGridProps) {

    // 3. THEME ENGINE (Preserved logic)
    // Checks searchParams first (for Live Preview), then Store DB, then defaults
    const theme = {
        color: searchParams.primary_color || store.primary_color || "#2563eb",
        bg: searchParams.background_color || store.background_color || "#ffffff",
        text: searchParams.text_color || store.text_color || "#0f172a",
        font: searchParams.font_family || store.font_family || "Inter",
        radius: searchParams.button_radius || store.button_radius || "12px",
        align: searchParams.hero_align || store.hero_align || "center",
        card: searchParams.card_style || store.card_style || "shadow",
        title: searchParams.hero_title || store.hero_title || "Step into the Future",
        subtitle: searchParams.hero_subtitle || store.hero_subtitle || "Premium products curated for you.",
        announce: searchParams.announcement_text || store.announcement_text,
    };

    const alignClass = theme.align === 'center' ? 'items-center text-center' : theme.align === 'right' ? 'items-end text-right' : 'items-start text-left';

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={getGoogleFontLink(theme.font)} rel="stylesheet" />

            <div
                className="w-full min-h-screen transition-colors duration-300"
                style={{
                    backgroundColor: theme.bg,
                    color: theme.text,
                    fontFamily: getFontFamily(theme.font),
                }}
            >
                {/* 1. ANNOUNCEMENT BAR */}
                {theme.announce && (
                    <div className="w-full py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-center relative z-50"
                        style={{ backgroundColor: theme.color, color: "#ffffff" }}>
                        {theme.announce}
                    </div>
                )}

                {/* 2. HEADER */}
                <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-black/5" style={{ backgroundColor: `${theme.bg}CC` }}>
                    <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                        <Link href={`/`} className="flex items-center gap-3 group">
                            {store.logo_url ? (
                                <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                                    <Image src={store.logo_url} fill alt={store.name} className="object-cover" priority />
                                </div>
                            ) : null}
                            <span className="font-bold text-xl tracking-tight uppercase" style={{ color: theme.text }}>
                                {store.header_name || store.name}
                            </span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <button className="p-2 opacity-60 hover:opacity-100 transition-opacity">
                                <Search className="w-5 h-5" />
                            </button>
                            <CartHeaderButton slug={store.slug} color={theme.color} radius={theme.radius} />
                        </div>
                    </div>
                </header>

                {/* 3. HERO SECTION */}
                <section className="relative w-full pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-10 blur-[100px] pointer-events-none rounded-full"
                        style={{ backgroundColor: theme.color }} />
                    <div className={`relative max-w-[1400px] mx-auto px-6 flex flex-col ${alignClass}`}>
                        {store.hero_badge_text && (
                            <Badge variant="outline" className="mb-8 px-4 py-1.5 shadow-sm font-bold tracking-wide uppercase text-[10px]"
                                style={{ borderRadius: theme.radius, borderColor: theme.text, color: theme.text, backgroundColor: 'transparent' }}>
                                {store.hero_badge_text}
                            </Badge>
                        )}
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-5xl uppercase whitespace-pre-line drop-shadow-sm">
                            {theme.title}
                        </h1>
                        <p className="text-lg md:text-2xl opacity-70 mb-12 max-w-2xl leading-relaxed">
                            {theme.subtitle}
                        </p>
                        <div className={`flex flex-col md:flex-row gap-4 w-full md:w-auto ${theme.align === 'center' ? 'justify-center' : theme.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                            <Button size="lg" className="h-14 px-10 text-base font-bold text-white shadow-xl hover:scale-105 transition-all border-none"
                                style={{ backgroundColor: theme.color, borderRadius: theme.radius }}>
                                Shop Now
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 4. TRUST BADGES (Dynamic from DB) */}
                <section className="border-y border-black/5" style={{ backgroundColor: theme.bg }}>
                    <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Use DB badges if available, else default */}
                        {(store.trust_badges && store.trust_badges.length > 0 ? store.trust_badges : [
                            { icon: "Truck", title: "Fast Delivery", desc: "2-3 days across Lebanon" },
                            { icon: "ShieldCheck", title: "Secure Payment", desc: "Cash on Delivery or Card" },
                            { icon: "Star", title: "Top Quality", desc: "Curated premium items" }
                        ]).map((feature: any, i: number) => {
                            // Simple icon mapping since we can't save components in DB
                            const Icon = feature.icon === 'Truck' ? Truck : feature.icon === 'ShieldCheck' ? ShieldCheck : Star;
                            return (
                                <div key={i} className="flex items-center justify-center gap-4">
                                    <div className="p-3 rounded-full bg-black/5">
                                        <Icon className="w-6 h-6" style={{ color: theme.color }} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-sm uppercase tracking-wide">{feature.title}</h3>
                                        <p className="text-xs opacity-60">{feature.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 5. PRODUCTS GRID */}
                <section className="py-12 md:py-24">
                    <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                        <h2 className="text-xl md:text-3xl font-black tracking-tight uppercase mb-8 md:mb-12 border-b border-black/10 pb-4 md:pb-6">Featured Products</h2>
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                                {products.map((product: any) => (
                                    <Link href={`/product/${product.id}`} key={product.id}
                                        className={`group transition-all duration-300 flex flex-col ${theme.card === 'shadow' ? 'bg-white shadow-md hover:shadow-xl' : theme.card === 'border' ? 'border border-black/10' : ''}`}
                                        style={{ borderRadius: theme.radius, color: theme.card === 'shadow' ? '#0f172a' : theme.text }}>
                                        <div className="aspect-[4/5] bg-black/5 overflow-hidden relative"
                                            style={{
                                                borderTopLeftRadius: theme.radius, borderTopRightRadius: theme.radius,
                                                borderBottomLeftRadius: theme.card === 'shadow' ? 0 : theme.radius, borderBottomRightRadius: theme.card === 'shadow' ? 0 : theme.radius
                                            }}>
                                            {product.main_image_url ? (
                                                <Image src={product.main_image_url} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20"><ShoppingBag className="w-12 h-12" /></div>
                                            )}
                                            <QuickAddButton product={product} variants={product.product_variants || []} color={theme.color} />
                                        </div>
                                        <div className="p-3 md:p-5 flex flex-col flex-1">
                                            <h3 className="font-bold text-sm md:text-base mb-1 leading-tight group-hover:opacity-70 transition-opacity line-clamp-2">{product.name}</h3>
                                            <div className="mt-auto flex items-center gap-2 pt-2">
                                                <span className="font-medium text-sm md:text-base opacity-80">${product.price_usd}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-black/10 rounded-3xl opacity-50"><p className="font-medium">No products found.</p></div>
                        )}
                    </div>
                </section>

                {/* 6. FOOTER */}
                <footer className="py-12 border-t border-black/10 mt-auto opacity-80">
                    <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-sm font-medium">© 2026 {store.name}. All rights reserved.</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-50">Powered by</span>
                            <span className="font-black tracking-tighter">SOUQELY</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}