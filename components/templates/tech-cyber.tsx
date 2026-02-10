"use client";

import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import { Zap, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Helper
const getGoogleFontLink = (fontName: string) => `https://fonts.googleapis.com/css2?family=${fontName ? fontName.replace(/\s+/g, '+') : 'Share+Tech+Mono'}:wght@400;700&display=swap`;

export default function TechCyber({ store, products, filterUI, searchParams = {} }: any) {
    const theme = {
        color: searchParams.primary_color || store.primary_color || "#00ff9d",
        bg: searchParams.background_color || store.background_color || "#050505",
        text: searchParams.text_color || store.text_color || "#e0e0e0",
        font: searchParams.font_family || store.font_family || "Share Tech Mono",
        radius: searchParams.button_radius || store.button_radius || "0px",
    };

    return (
        <div className="min-h-screen selection:bg-white selection:text-black"
            style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: theme.font }}>

            <link href={getGoogleFontLink(theme.font)} rel="stylesheet" />

            {/* 🟢 1. ANNOUNCEMENT BAR (Normal Flow)
                 This sits at the top. When you scroll, it moves up naturally. */}
            {store.announcement_text && (
                <div
                    className="w-full h-[25px] flex items-center justify-center px-4 text-center text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white z-[60]"
                    style={{ backgroundColor: theme.color }}
                >
                    {store.announcement_text}
                </div>
            )}

            {/* 🟢 2. HEADER: HUD Style (Sticky)
                 We use 'sticky top-0'. It will naturally sit below the bar, 
                 then lock to the top once the bar is scrolled away. */}
            <header className="sticky top-0 z-50 border-b backdrop-blur-md"
                style={{
                    borderColor: `${theme.text}20`,
                    backgroundColor: `${theme.bg}CC`
                }}
            >
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl uppercase tracking-widest font-bold">{store.name}</span>
                        {/* ONLINE badge removed as requested */}
                    </div>
                    <CartHeaderButton slug={store.slug} color={theme.color} radius={theme.radius} />
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center border-b overflow-hidden"
                style={{ borderColor: `${theme.text}20` }}>

                {store.hero_image_url ? (
                    <Image
                        src={store.hero_image_url}
                        fill
                        alt="Hero"
                        className="object-cover z-0"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-900">
                        <Activity className="w-32 h-32 opacity-10" style={{ color: theme.color }} />
                    </div>
                )}

                {/* Cyber Overlays */}
                <div className="absolute inset-0 z-10"
                    style={{
                        backgroundImage: `linear-gradient(${theme.color} 1px, transparent 1px), linear-gradient(90deg, ${theme.color} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        opacity: 0.2
                    }}>
                </div>
                <div className="absolute inset-0 z-10 bg-black/60"></div>

                <div className="relative z-20 text-center px-6 max-w-4xl">
                    <p className="text-xs md:text-sm uppercase tracking-[0.3em] mb-4 font-bold animate-pulse" style={{ color: theme.color }}>
                        {store.hero_badge_text || "SYSTEM_READY"}
                    </p>
                    <h1 className="text-5xl md:text-7xl uppercase leading-[0.9] mb-6 font-bold text-white drop-shadow-lg">
                        {store.hero_title || "FUTURE READY"}
                    </h1>
                    <p className="max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-8 text-gray-300 font-mono border-l-2 pl-4"
                        style={{ borderColor: theme.color }}>
                        {store.hero_subtitle || "High-performance hardware initialized."}
                    </p>
                    <Button className="h-12 px-8 font-bold uppercase tracking-widest text-black transition-transform hover:scale-105"
                        style={{ backgroundColor: theme.color, borderRadius: theme.radius }}>
                        INITIALIZE SHOPPING
                    </Button>
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="py-20 px-6 max-w-[1600px] mx-auto">
                {filterUI}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product: any) => {
                        const variantStock = product.product_variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
                        const totalStock = variantStock || product.stock || 0;
                        const isOOS = totalStock <= 0;

                        return (
                            <div key={product.id}
                                className="group relative border transition-all hover:border-opacity-100"
                                style={{
                                    borderColor: `${theme.text}20`,
                                    backgroundColor: `${theme.text}05`,
                                    borderRadius: theme.radius
                                }}>

                                <div className="aspect-square relative overflow-hidden border-b"
                                    style={{ borderColor: `${theme.text}10` }}>

                                    <Link href={`/store/${store.slug}/product/${product.id}`} className="absolute inset-0 z-10">
                                        {product.main_image_url ? (
                                            <Image
                                                src={product.main_image_url}
                                                fill
                                                alt={product.name}
                                                className={`object-contain p-6 transition-transform duration-500 group-hover:scale-110 ${isOOS ? 'grayscale opacity-50' : ''}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                                <Zap className="w-12 h-12" />
                                            </div>
                                        )}
                                    </Link>

                                    {!isOOS && (
                                        <div className="absolute top-2 right-2 z-20">
                                            <QuickAddButton
                                                product={product}
                                                variants={product.product_variants}
                                                color={theme.color}
                                                className="rounded-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                    )}
                                </div>

                                <Link href={`/store/${store.slug}/product/${product.id}`} className="block p-4">
                                    <h3 className="text-sm uppercase tracking-wider font-bold truncate mb-2">{product.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold font-mono" style={{ color: theme.color }}>
                                            ${product.price_usd}
                                        </span>
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