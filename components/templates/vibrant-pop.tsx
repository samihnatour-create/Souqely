"use client";

import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const getGoogleFontLink = (fontName: string) => `https://fonts.googleapis.com/css2?family=${fontName ? fontName.replace(/\s+/g, '+') : 'Fredoka'}:wght@400;700&display=swap`;

export default function VibrantPop({ store, products, filterUI, searchParams = {} }: any) {
    const theme = {
        color: searchParams.primary_color || store.primary_color || "#ec4899",
        bg: searchParams.background_color || store.background_color || "#fff1f2",
        text: searchParams.text_color || store.text_color || "#0f172a",
        font: searchParams.font_family || store.font_family || "Fredoka",
        radius: "24px",
    };

    return (
        <div className="min-h-screen selection:bg-yellow-300 selection:text-black"
            style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: theme.font }}>

            <link href={getGoogleFontLink(theme.font)} rel="stylesheet" />

            {/* 🟢 1. ANNOUNCEMENT BAR (Normal Flow - Scrolls Away) */}
            {store.announcement_text && (
                <div
                    className="w-full h-[25px] flex items-center justify-center px-4 text-center text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white z-10"
                    style={{ backgroundColor: theme.color }}
                >
                    {store.announcement_text}
                </div>
            )}

            {/* 🟢 2. FLOATING HEADER (Sticky)
                 This sits naturally below the bar. When you scroll past 25px, 
                 it sticks to the top of the screen. */}
            <header className="sticky top-0 z-50 px-4 py-4 pointer-events-none">
                <div className="max-w-4xl mx-auto h-16 bg-white/95 backdrop-blur-md border-2 border-black rounded-full flex items-center justify-between px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-auto">
                    <span className="font-black text-xl tracking-tight">{store.name}</span>
                    <CartHeaderButton slug={store.slug} color={theme.color} radius="99px" />
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="pb-12 px-4">
                <div className="max-w-5xl mx-auto relative rounded-[40px] overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[500px] flex items-center justify-center text-center bg-white">
                    {store.hero_image_url ? (
                        <Image src={store.hero_image_url} fill alt="Hero" className="object-cover z-0" priority />
                    ) : (
                        <div className="absolute inset-0 bg-yellow-300 z-0"></div>
                    )}

                    <div className="absolute inset-0 bg-black/10 z-0"></div>

                    <div className="relative z-10 bg-white/95 p-8 md:p-12 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[30px] max-w-lg mx-4 rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
                        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase leading-none" style={{ color: theme.color }}>
                            {store.hero_title || "SUPER FUN!"}
                        </h1>
                        <p className="font-bold text-lg opacity-80 mb-6">{store.hero_subtitle || "Grab your goodies now."}</p>
                        <Button className="h-12 px-8 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black"
                            style={{ backgroundColor: theme.color }}>
                            SHOP NOW
                        </Button>
                    </div>
                </div>
            </section>

            {filterUI}

            {/* PRODUCT GRID */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product: any) => {
                        const variantStock = product.product_variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
                        const totalStock = variantStock || product.stock || 0;
                        const isOOS = totalStock <= 0;

                        return (
                            <div key={product.id}
                                className={`group bg-white rounded-[2rem] border-2 border-black p-4 relative transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isOOS ? 'opacity-60 grayscale' : ''}`}>

                                <div className="aspect-square relative rounded-2xl overflow-hidden border-2 border-black/5 mb-4 bg-slate-50">
                                    <Link href={`/store/${store.slug}/product/${product.id}`} className="block w-full h-full">
                                        {product.main_image_url ? (
                                            <Image src={product.main_image_url} fill alt={product.name} className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 33vw" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full"><Star className="text-yellow-400 w-12 h-12" /></div>
                                        )}
                                    </Link>

                                    {!isOOS && (
                                        <div className="absolute top-2 right-2 z-20">
                                            <QuickAddButton
                                                product={product}
                                                variants={product.product_variants}
                                                className="h-10 w-10 p-0 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-yellow-300 text-black flex items-center justify-center transition-all"
                                                color={theme.color}
                                            />
                                        </div>
                                    )}
                                </div>

                                <Link href={`/store/${store.slug}/product/${product.id}`} className="block px-2">
                                    <h3 className="font-black text-lg leading-tight mb-2 truncate uppercase italic">{product.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="font-black text-base px-4 py-1 rounded-full bg-yellow-200 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                            ${product.price_usd}
                                        </span>
                                        {isOOS && <span className="font-black text-red-500 text-[10px] uppercase border-2 border-red-500 px-2 py-0.5 rounded-full -rotate-6">Sold Out</span>}
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    );
}