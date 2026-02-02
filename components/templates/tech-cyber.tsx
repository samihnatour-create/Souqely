"use client";

import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import { Zap, Terminal, Activity, Wifi } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Helper
const getGoogleFontLink = (fontName: string) => `https://fonts.googleapis.com/css2?family=${fontName ? fontName.replace(/\s+/g, '+') : 'Share+Tech+Mono'}:wght@400;700&display=swap`;

export default function TechCyber({ store, products, searchParams = {} }: any) {
    const theme = {
        color: searchParams.primary_color || store.primary_color || "#00ff9d",
        bg: searchParams.background_color || store.background_color || "#050505",
        text: searchParams.text_color || store.text_color || "#e0e0e0",
        font: searchParams.font_family || store.font_family || "Share Tech Mono",
        radius: searchParams.button_radius || store.button_radius || "0px",
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden selection:bg-white selection:text-black"
            style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: theme.font }}>

            <link href={getGoogleFontLink(theme.font)} rel="stylesheet" />

            {/* HEADER: HUD Style */}
            <header className="sticky top-0 z-40 border-b backdrop-blur-sm"
                style={{ borderColor: `${theme.text}20`, backgroundColor: `${theme.bg}CC` }}>
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5" style={{ color: theme.color }} />
                        <span className="text-xl uppercase tracking-widest font-bold">{store.name}</span>
                        <span className="text-[10px] px-1 ml-2 animate-pulse border hidden md:inline-block"
                            style={{ borderColor: theme.color, color: theme.color }}>ONLINE</span>
                    </div>
                    <CartHeaderButton slug={store.slug} color={theme.color} radius={theme.radius} />
                </div>
            </header>

            {/* HERO: Full Width Background */}
            <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center border-b overflow-hidden"
                style={{ borderColor: `${theme.text}20` }}>

                {/* 1. Background Image */}
                {store.hero_image_url ? (
                    <Image
                        src={store.hero_image_url}
                        fill
                        alt="Hero"
                        className="object-cover z-0"
                    />
                ) : (
                    // Fallback Pattern
                    <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-900">
                        <Activity className="w-32 h-32 opacity-10" style={{ color: theme.color }} />
                    </div>
                )}

                {/* 2. Cyber Overlay (Grid + Darken) */}
                <div className="absolute inset-0 z-10"
                    style={{
                        backgroundImage: `linear-gradient(${theme.color} 1px, transparent 1px), linear-gradient(90deg, ${theme.color} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        backgroundColor: 'rgba(0,0,0,0.7)', // Darken image for text readability
                        opacity: 0.2
                    }}>
                </div>
                {/* Extra dark gradient for text pop */}
                <div className="absolute inset-0 z-10 bg-black/60"></div>

                {/* 3. Content */}
                <div className="relative z-20 text-center px-6 max-w-4xl">
                    <p className="text-xs md:text-sm uppercase tracking-[0.3em] mb-4 font-bold animate-pulse" style={{ color: theme.color }}>
                        {store.hero_badge_text || "SYSTEM_READY"}
                    </p>
                    <h1 className="text-5xl md:text-7xl uppercase leading-[0.9] mb-6 font-bold text-white drop-shadow-lg">
                        {store.hero_title || "FUTURE READY"}
                    </h1>
                    <p className="max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-8 text-gray-300 font-mono border-l-2 pl-4"
                        style={{ borderColor: theme.color }}>
                        {store.hero_subtitle || "High-performance hardware initialized for the next generation."}
                    </p>
                    <Button className="h-12 px-8 font-bold uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(0,255,157,0.3)] text-black transition-transform hover:scale-105"
                        style={{ backgroundColor: theme.color, borderRadius: theme.radius }}>
                        INITIALIZE SHOPPING
                    </Button>
                </div>
            </section>

            {/* PRODUCTS: Data Grid */}
            <section className="py-20 px-6 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 opacity-20" style={{ backgroundColor: theme.text }}></div>
                    <h2 className="text-xl uppercase tracking-widest flex items-center gap-2">
                        <Wifi className="w-4 h-4" style={{ color: theme.color }} />
                        Available Units ({products.length})
                    </h2>
                    <div className="h-px flex-1 opacity-20" style={{ backgroundColor: theme.text }}></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product: any) => {
                        const isOOS = (product.stock || 0) <= 0;
                        return (
                            <div key={product.id}
                                className="group relative border transition-all hover:border-opacity-100 hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                style={{
                                    borderColor: `${theme.text}20`,
                                    backgroundColor: `${theme.text}05`, // Very slight bg tint
                                    borderRadius: theme.radius
                                }}>

                                {/* Image Area */}
                                <div className="aspect-square relative overflow-hidden border-b"
                                    style={{ borderColor: `${theme.text}10` }}>

                                    {/* LINK (Z-10) */}
                                    <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
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

                                    {/* 🟢 BUTTON: Top-Right. Hidden on Desktop until Hover. */}
                                    <div className="absolute top-2 right-2 z-20">
                                        <QuickAddButton
                                            product={product}
                                            variants={product.product_variants}
                                            color={theme.color}
                                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>

                                    {/* OOS Warning */}
                                    {isOOS && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                            <span className="bg-red-500/90 text-black text-xs font-bold px-2 py-1 uppercase tracking-widest">
                                                OFFLINE
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info Area */}
                                <Link href={`/product/${product.id}`} className="block p-4">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <h3 className="text-sm uppercase tracking-wider font-bold line-clamp-2 leading-tight">
                                            {product.name}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold font-mono" style={{ color: theme.color }}>
                                            ${product.price_usd}
                                        </span>
                                        <span className="text-[10px] uppercase opacity-40 font-mono">
                                            ID_{product.id.slice(0, 4)}
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