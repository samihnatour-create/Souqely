"use client";

import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search, Star, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ... (Helper functions getGoogleFontLink, getFontFamily stay the same) ...
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

interface ModernGridProps {
    store: any;
    products: any[];
    searchParams?: { [key: string]: string | undefined };
    filterUI?: React.ReactNode;
}

export default function ModernGrid({ store, products, filterUI, searchParams = {} }: ModernGridProps) {
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
                {/* ... (Announcement, Header, Hero, Trust Badges stay exactly the same) ... */}
                {/* I am omitting them here to save space, copy them from your previous file */}

                {/* --- 1. ANNOUNCEMENT BAR --- */}
                {theme.announce && (
                    <div className="w-full py-2 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-center relative z-50"
                        style={{ backgroundColor: theme.color, color: "#ffffff" }}>
                        {theme.announce}
                    </div>
                )}

                {/* --- 2. HEADER --- */}
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
                            <CartHeaderButton slug={store.slug} color={theme.color} radius={theme.radius} />
                        </div>
                    </div>
                </header>

                {/* --- 3. HERO SECTION (Full Background) --- */}
                <section className="relative w-full pt-32 pb-48 md:pt-48 md:pb-64 overflow-hidden flex items-center justify-center">

                    {/* 🟢 A. BACKGROUND LAYER */}
                    {store.hero_image_url ? (
                        <>
                            {/* The Image */}
                            <Image
                                src={store.hero_image_url}
                                fill
                                alt="Hero Background"
                                className="object-cover z-0"
                                priority
                            />
                            {/* The Dark Overlay (Adjust opacity here: bg-black/40 = 40% dark) */}
                            <div className="absolute inset-0 bg-black/40 z-0"></div>
                        </>
                    ) : (
                        // Fallback: The Glowing Orb
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-10 blur-[100px] pointer-events-none rounded-full"
                            style={{ backgroundColor: theme.color }}
                        />
                    )}

                    {/* 🟢 B. CONTENT LAYER (Sits on top) */}
                    <div className={`relative z-10 max-w-[1400px] mx-auto px-6 flex flex-col w-full h-full ${alignClass}`}>

                        {store.hero_badge_text && (
                            <Badge variant="outline" className="mb-6 px-4 py-1.5 shadow-sm font-bold tracking-wide uppercase text-[10px] border-white/30 text-white backdrop-blur-md">
                                {store.hero_badge_text}
                            </Badge>
                        )}

                        {/* Force Title/Subtitle to White if there is an image, otherwise use theme text */}
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 max-w-5xl uppercase whitespace-pre-line drop-shadow-lg"
                            style={{ color: store.hero_image_url ? '#ffffff' : theme.text }}>
                            {theme.title}
                        </h1>

                        <p className="text-lg md:text-2xl mb-10 max-w-2xl leading-relaxed drop-shadow-md font-medium"
                            style={{ color: store.hero_image_url ? '#e2e8f0' : theme.text, opacity: store.hero_image_url ? 1 : 0.7 }}>
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

                {/* --- 5. PRODUCTS GRID (THE FIX IS HERE) --- */}
                <section className="py-12 md:py-24">
                    {filterUI}
                    <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                                {products.map((product: any) => {
                                    // Stock Logic for Grayscale
                                    const stock = product.product_variants?.length
                                        ? product.product_variants.reduce((a: any, b: any) => a + (b.stock || 0), 0)
                                        : (product.stock || 0);
                                    const isOOS = stock <= 0;

                                    return (
                                        // 🟢 FIX 1: Wrapper Div (Not a Link)
                                        <div
                                            key={product.id}
                                            className={`group relative flex flex-col transition-all duration-300 ${isOOS ? 'opacity-75 grayscale' : ''} ${theme.card === 'shadow' ? 'bg-white shadow-md hover:shadow-xl' : theme.card === 'border' ? 'border border-black/10' : ''}`}
                                            style={{ borderRadius: theme.radius, color: theme.card === 'shadow' ? '#0f172a' : theme.text }}
                                        >
                                            {/* 🟢 FIX 2: Image Area contains the Link, BUT Button is Sibling */}
                                            <div className="aspect-[4/5] bg-black/5 overflow-hidden relative"
                                                style={{ borderTopLeftRadius: theme.radius, borderTopRightRadius: theme.radius }}>

                                                {/* The clickable area (Link) */}
                                                <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
                                                    {product.main_image_url ? (
                                                        <Image src={product.main_image_url} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center opacity-20"><ShoppingBag className="w-12 h-12" /></div>
                                                    )}
                                                </Link>

                                                {/* 🟢 BUTTON: Bottom-Right. Hidden on Desktop until Hover. */}
                                                <div className="absolute bottom-3 right-3 z-20">
                                                    <QuickAddButton
                                                        product={product}
                                                        variants={product.product_variants}
                                                        color={theme.color}
                                                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                                                    />
                                                </div>
                                            </div>

                                            {/* Product Info (Clickable) */}
                                            <Link href={`/product/${product.id}`} className="p-3 md:p-5 flex flex-col flex-1">
                                                <h3 className="font-bold text-sm md:text-base mb-1 leading-tight group-hover:opacity-70 transition-opacity line-clamp-2">{product.name}</h3>
                                                <div className="mt-auto flex items-center gap-2 pt-2">
                                                    <span className="font-medium text-sm md:text-base opacity-80">${product.price_usd}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-black/10 rounded-3xl opacity-50"><p className="font-medium">No products found.</p></div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}