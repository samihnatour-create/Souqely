"use client";

import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const getGoogleFontLink = (fontName: string) => {
    // Default to 'Bodoni Moda' if no font selected, it screams luxury
    const formatted = fontName ? fontName.replace(/\s+/g, '+') : 'Bodoni+Moda';
    return `https://fonts.googleapis.com/css2?family=${formatted}:ital,wght@0,400;0,700;1,400&display=swap`;
};

export default function MinimalistBold({ store, products, searchParams = {} }: any) {
    const theme = {
        color: searchParams.primary_color || store.primary_color || "#000000",
        bg: searchParams.background_color || store.background_color || "#ffffff",
        text: searchParams.text_color || store.text_color || "#1c1917",
        font: searchParams.font_family || store.font_family || "Bodoni Moda",
        radius: "0px", // Luxury usually likes sharp corners
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: theme.font }}>
            <link href={getGoogleFontLink(theme.font)} rel="stylesheet" />

            {/* HEADER - Minimal */}
            <header className="fixed top-0 w-full z-50 transition-all duration-300 mix-blend-difference text-white">
                <div className="max-w-[1800px] mx-auto px-6 h-24 flex items-center justify-between">
                    <span className="text-2xl font-bold tracking-widest uppercase">{store.name}</span>
                    <CartHeaderButton slug={store.slug} color="transparent" radius="0px" />
                </div>
            </header>

            {/* HERO - Cinematic */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                {store.hero_image_url ? (
                    <Image src={store.hero_image_url} fill alt="Hero" className="object-cover" priority />
                ) : (
                    <div className="absolute inset-0 bg-neutral-200"></div>
                )}
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                <div className="relative z-10 text-center text-white max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-6">{store.hero_subtitle || "EST. 2026"}</p>
                    <h1 className="text-6xl md:text-9xl font-medium tracking-tighter mb-8 leading-[0.8]">
                        {store.hero_title || "TIMELESS"}
                    </h1>
                    <Button variant="outline" className="h-14 px-12 text-black bg-white border-none hover:bg-neutral-200 rounded-none uppercase tracking-widest text-xs font-bold">
                        Discover Collection
                    </Button>
                </div>
            </section>

            {/* PRODUCT GRID - Spacious & Clean */}
            <section className="py-32 px-4 md:px-12 max-w-[1800px] mx-auto">
                <div className="flex justify-between items-end mb-16 border-b border-black pb-4">
                    <h2 className="text-4xl font-medium">Selected Works</h2>
                    <span className="text-sm opacity-50">{products.length} ITEMS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                    {products.map((product: any) => {
                        const stock = product.product_variants?.length
                            ? product.product_variants.reduce((a: any, b: any) => a + (b.stock || 0), 0)
                            : (product.stock || 0);
                        const isOOS = stock <= 0;

                        return (
                            <div key={product.id} className={`group relative ${isOOS ? 'opacity-50' : ''}`}>
                                <div className="relative aspect-[3/4] bg-neutral-100 mb-6 overflow-hidden">
                                    <Link href={`/product/${product.id}`}>
                                        {product.main_image_url ? (
                                            <Image src={product.main_image_url} fill alt={product.name} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-200"></div>
                                        )}
                                    </Link>

                                    {/* 🟢 BUTTON: Centered. Hidden on Desktop until Hover. */}
                                    <div className="absolute bottom-4 right-4 z-20">
                                        <div className="pointer-events-auto">
                                            <QuickAddButton
                                                product={product}
                                                variants={product.product_variants}
                                                color="black"
                                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 scale-100 hover:scale-110"
                                            />
                                        </div>
                                    </div>

                                    {isOOS && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                                            <span className="text-xs tracking-[0.2em] font-bold border border-black px-4 py-2">SOLD OUT</span>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <Link href={`/product/${product.id}`}>
                                        <h3 className="text-xl font-medium mb-1">{product.name}</h3>
                                        <p className="text-sm opacity-60">${product.price_usd}</p>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    );
}