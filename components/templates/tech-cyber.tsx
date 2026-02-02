"use client";

import { CartHeaderButton, QuickAddButton } from "@/components/store/store-interactions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldCheck, Zap, Cpu, Wifi } from "lucide-react"; // Tech icons
import Link from "next/link";
import Image from "next/image";

interface TemplateProps {
    store: any;
    products: any[];
    searchParams?: { [key: string]: string | undefined };
}

export default function TechCyber({ store, products, searchParams = {} }: TemplateProps) {

    // 1. THEME ENGINE (Dark Mode Defaults)
    const theme = {
        color: searchParams.primary_color || store.primary_color || "#3b82f6", // Default Blue
        bg: "#020617", // Force Dark Background
        text: "#f8fafc", // Force Light Text
        font: "Roboto Mono", // Tech Font
        radius: "0px", // Sharp edges for Cyber look

        // Content
        title: searchParams.hero_title || store.hero_title || "NEXT GEN SYSTEMS",
        subtitle: searchParams.hero_subtitle || store.hero_subtitle || "High performance hardware for professionals.",
        badge: searchParams.hero_badge_text || store.hero_badge_text || "SYSTEM ONLINE",
    };

    return (
        <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-mono selection:bg-blue-500/30">
            {/* Load Google Font */}
            <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet" />

            {/* HEADER */}
            <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href={`/`} className="flex items-center gap-3">
                        {store.logo_url && (
                            <div className="relative w-8 h-8 rounded-none overflow-hidden border border-slate-700">
                                <Image src={store.logo_url} fill alt={store.name} className="object-cover" />
                            </div>
                        )}
                        <span className="font-bold text-lg tracking-tighter uppercase text-white">
                            {store.header_name || store.name}
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <CartHeaderButton slug={store.slug} color={theme.color} radius="0px" />
                    </div>
                </div>
            </header>

            {/* CYBER HERO */}
            <section className="relative w-full py-24 border-b border-slate-800 overflow-hidden">
                {/* Grid Background Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
                    <div className="inline-block mb-6 border border-blue-500/50 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 tracking-[0.2em]">
                        {theme.badge}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white uppercase glitch-effect">
                        {theme.title}
                    </h1>
                    <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto border-l-2 border-blue-500 pl-4">
                        {theme.subtitle}
                    </p>
                    <Button
                        size="lg"
                        className="h-14 px-8 text-base font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-none border border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                    >
                        INITIALIZE SHOPPING_
                    </Button>
                </div>
            </section>

            {/* TRUST SIGNALS (Tech Version) */}
            <section className="border-b border-slate-800 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Zap, title: "Supercharged", desc: "Next-day delivery" },
                        { icon: ShieldCheck, title: "Secure Protocol", desc: "Encrypted payments" },
                        { icon: Cpu, title: "Premium Hardware", desc: "Verified authenticity" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 border border-slate-800 p-4 bg-slate-950/50">
                            <item.icon className="w-6 h-6 text-blue-500" />
                            <div>
                                <h3 className="font-bold text-sm uppercase text-white">{item.title}</h3>
                                <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PRODUCTS GRID */}
            <section className="py-16">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                    <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-blue-500 animate-pulse" />
                        AVAILABLE_UNIT(S)
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((product: any) => (
                            <div key={product.id} className="group border border-slate-800 bg-slate-900 hover:border-blue-500 transition-all duration-300 relative">
                                <Link href={`/product/${product.id}`} className="block">
                                    <div className="aspect-square bg-white relative p-4 overflow-hidden">
                                        {/* Tech items look better on white even in dark mode */}
                                        {product.main_image_url ? (
                                            <Image src={product.main_image_url} alt={product.name} fill className="object-contain p-2 hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300"><Cpu /></div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-sm text-slate-300 mb-1 line-clamp-1">{product.name}</h3>
                                        <p className="text-blue-400 font-bold font-mono">${product.price_usd}</p>
                                    </div>
                                </Link>
                                {/* Quick Add (Reused Logic) */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <QuickAddButton product={product} variants={product.product_variants || []} color={theme.color} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}