"use client";

import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import { Utensils, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ... (Copy helper functions getGoogleFontLink/getFontFamily from previous files) ...
const getGoogleFontLink = (fontName: string) => {
    const formatted = fontName ? fontName.replace(/\s+/g, '+') : 'Inter';
    return `https://fonts.googleapis.com/css2?family=${formatted}:wght@400;700;900&display=swap`;
};
const getFontFamily = (fontName: string) => {
    if (fontName === 'Playfair Display') return "'Playfair Display', serif";
    return "'Inter', sans-serif";
};

export default function ClassicList({ store, products, searchParams, filterUI = {} }: any) {
    const theme = {
        color: searchParams.primary_color || store.primary_color || "#16a34a",
        bg: searchParams.background_color || store.background_color || "#fdfdfd",
        text: searchParams.text_color || store.text_color || "#1c1917",
        font: searchParams.font_family || store.font_family || "Playfair Display",
        radius: searchParams.button_radius || store.button_radius || "8px",
    };

    return (
        <div className="min-h-screen pb-20" style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: getFontFamily(theme.font) }}>
            <link href={getGoogleFontLink(theme.font)} rel="stylesheet" />

            {/* HEADER */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b shadow-sm">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="font-bold text-xl">{store.name}</h1>
                    <CartHeaderButton slug={store.slug} color={theme.color} radius={theme.radius} />
                </div>
            </header>

            {/* HERO SECTION (Full Height or Compact) */}
            <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden mb-8 flex items-end">
                {/* Background Image */}
                {store.hero_image_url ? (
                    <Image src={store.hero_image_url} fill alt="Banner" className="object-cover" priority />
                ) : (
                    <div className="absolute inset-0" style={{ backgroundColor: theme.color }}></div>
                )}

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-3xl mx-auto p-6 text-white pb-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-2">{store.hero_title || "Our Menu"}</h2>
                    <p className="opacity-90 text-lg mb-4">{store.hero_subtitle || "Freshly prepared & delivered."}</p>

                    {/* Info Pills */}
                    <div className="flex gap-3 text-xs font-bold uppercase tracking-wide opacity-80">
                        <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md"><Clock className="w-3 h-3" /> 20-30 min</span>
                        <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md"><Utensils className="w-3 h-3" /> Delivery</span>
                    </div>
                </div>
            </div>

            {/* LIST LAYOUT */}
            <main className="max-w-3xl mx-auto px-4 space-y-6">
                {filterUI}
                {products.map((product: any) => {
                    const stock = product.product_variants?.length
                        ? product.product_variants.reduce((a: any, b: any) => a + (b.stock || 0), 0)
                        : (product.stock || 0);
                    const isOOS = stock <= 0;

                    return (
                        <div key={product.id}
                            className={`group relative flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md ${isOOS ? 'opacity-60 grayscale' : ''}`}
                            style={{ borderRadius: theme.radius }}>

                            {/* Text Info */}
                            <Link href={`/product/${product.id}`} className="flex-1 min-w-0 flex flex-col justify-center">
                                <h3 className="font-bold text-lg mb-1 text-slate-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                                    {product.description || "Fresh ingredients, made to order."}
                                </p>
                                <span className="font-bold text-slate-900">${product.price_usd}</span>
                            </Link>

                            {/* Image & Button Container */}
                            <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0">
                                <div className="absolute inset-0 overflow-hidden bg-slate-100 border border-slate-100" style={{ borderRadius: theme.radius }}>
                                    {product.main_image_url ? (
                                        <Image src={product.main_image_url} fill alt={product.name} className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full"><Utensils className="text-slate-300" /></div>
                                    )}
                                </div>
                                {/* 🟢 BUTTON: Bottom-Right overlapping image. */}
                                <div className="absolute -bottom-2 -right-2 z-20">
                                    <QuickAddButton
                                        product={product}
                                        variants={product.product_variants}
                                        color={theme.color}
                                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 shadow-md"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
}