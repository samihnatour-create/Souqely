"use client";

import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Helper (reused)
const getGoogleFontLink = (fontName: string) => `https://fonts.googleapis.com/css2?family=${fontName ? fontName.replace(/\s+/g, '+') : 'Fredoka'}:wght@400;700&display=swap`;

export default function VibrantPop({ store, products, filterUI, searchParams = {} }: any) {
    const theme = {
        color: searchParams.primary_color || store.primary_color || "#ec4899", // Pink default
        bg: searchParams.background_color || store.background_color || "#fff1f2",
        text: searchParams.text_color || store.text_color || "#0f172a",
        font: searchParams.font_family || store.font_family || "Fredoka", // Rounded font
        radius: "24px", // Very rounded
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: theme.font }}>
            <link href={getGoogleFontLink(theme.font)} rel="stylesheet" />

            {/* HEADER - Floating Pill */}
            <header className="sticky top-4 z-50 px-4">
                <div className="max-w-4xl mx-auto h-16 bg-white/90 backdrop-blur-md border-2 border-black rounded-full flex items-center justify-between px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="font-black text-xl tracking-tight">{store.name}</span>
                    <CartHeaderButton slug={store.slug} color={theme.color} radius="99px" />
                </div>
            </header>

            {/* HERO - Fun Box */}
            <section className="pt-24 pb-12 px-4">
                <div className="max-w-5xl mx-auto relative rounded-[40px] overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[500px] flex items-center justify-center text-center">

                    {store.hero_image_url ? (
                        <Image src={store.hero_image_url} fill alt="Hero" className="object-cover z-0" />
                    ) : (
                        <div className="absolute inset-0 bg-yellow-300 z-0"></div>
                    )}

                    <div className="absolute inset-0 bg-black/10 z-0"></div>

                    <div className="relative z-10 bg-white/95 p-8 md:p-12 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[30px] max-w-lg mx-4 rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                        <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase leading-none" style={{ color: theme.color }}>
                            {store.hero_title || "SUPER FUN!"}
                        </h1>
                        <p className="font-bold text-lg opacity-80 mb-6">{store.hero_subtitle || "Grab your goodies now."}</p>
                        <Button className="h-12 px-8 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black"
                            style={{ backgroundColor: theme.color }}>
                            SHOP NOW
                        </Button>
                    </div>
                </div>
            </section>
            {filterUI}

            {/* PRODUCT GRID */}
            <section className="py-12 max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product: any) => {
                        const stock = product.product_variants?.length
                            ? product.product_variants.reduce((a: any, b: any) => a + (b.stock || 0), 0)
                            : (product.stock || 0);
                        const isOOS = stock <= 0;

                        return (
                            <div key={product.id}
                                className={`group bg-white rounded-3xl border-2 border-black p-3 relative transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isOOS ? 'opacity-60 grayscale' : ''}`}>

                                <div className="aspect-square relative rounded-2xl overflow-hidden border-2 border-black/10 mb-3 bg-slate-50">
                                    <Link href={`/product/${product.id}`}>
                                        {product.main_image_url ? (
                                            <Image src={product.main_image_url} fill alt={product.name} className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full"><Star className="text-yellow-400 w-12 h-12" /></div>
                                        )}
                                    </Link>

                                    {/* Fun Button Position */}
                                    <div className="absolute top-2 right-2 z-20">
                                        <QuickAddButton
                                            product={product}
                                            variants={product.product_variants}
                                            color={theme.color}
                                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        />
                                    </div>
                                </div>

                                <Link href={`/product/${product.id}`} className="block px-2 pb-2">
                                    <h3 className="font-black text-lg leading-tight mb-1">{product.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xl px-2 py-0.5 rounded-md bg-yellow-200 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            ${product.price_usd}
                                        </span>
                                        {isOOS && <span className="font-black text-red-500 text-xs">GONE!</span>}
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