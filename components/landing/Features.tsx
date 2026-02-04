"use client";

import { Badge } from "@/components/ui/badge";
import { Palette, Share2, Smartphone, BarChart3, Globe, Zap } from "lucide-react";
import { Reveal } from "./reveal"; // 🟢 Import Animation Wrapper

const FEATURES = [
    {
        title: "Magic Branding",
        desc: "Upload your logo and watch Souqely instantly generate a brand theme that matches your identity perfectly.",
        icon: <Palette className="w-6 h-6" />,
        color: "bg-purple-50 text-purple-600",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Mobile-First Admin",
        desc: "Manage your entire shop from your phone while you're on the move. Orders, stock, and customers in one thumb-friendly app.",
        icon: <Smartphone className="w-6 h-6" />,
        color: "bg-blue-50 text-blue-600",
        img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Shareable Shop Link",
        desc: "A professional URL (yourbrand.souqely.com) designed to look stunning in Instagram bios and WhatsApp chats.",
        icon: <Share2 className="w-6 h-6" />,
        color: "bg-green-50 text-green-600",
        img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800"
    }
];

export default function Features() {
    return (
        <section className="w-full py-24 bg-white" id="features">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Section Header - Updated Fonts */}
                <Reveal>
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1a56db] mb-3 block">
                            The Engine
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#0f1117] mb-6 leading-tight">
                            Everything you need <br /> to <span className="text-[#1a56db]">actually</span> sell.
                        </h2>
                    </div>
                </Reveal>

                {/* Feature Stack - Added Reveal & Softened UI */}
                <div className="space-y-32">
                    {FEATURES.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:items-center gap-12 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                }`}
                        >
                            {/* Text Side */}
                            <div className="flex-1 space-y-6">
                                <Reveal delay={100}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color} shadow-sm mb-6`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-3xl font-serif font-semibold text-[#0f1117]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg text-[#4a4e5a] leading-relaxed max-w-lg">
                                        {feature.desc}
                                    </p>

                                    <div className="flex items-center gap-8 pt-6 border-t border-slate-100 mt-6">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-[#0f1117]">1-Click</span>
                                            <span className="text-xs font-medium text-[#8a8f9e] uppercase tracking-wider">Setup Time</span>
                                        </div>
                                        <div className="h-8 w-px bg-slate-200" />
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-[#0f1117]">100%</span>
                                            <span className="text-xs font-medium text-[#8a8f9e] uppercase tracking-wider">Mobile Responsive</span>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>

                            {/* Visual Side */}
                            <div className="flex-1 relative group">
                                <Reveal delay={200} className="w-full">
                                    <div className="absolute inset-0 bg-[#1a56db] rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                                    <div className="relative overflow-hidden rounded-[2rem] border border-[#e2e4e9] bg-white shadow-2xl shadow-slate-200/50 transition-transform duration-700 group-hover:scale-[1.01]">
                                        <img
                                            src={feature.img}
                                            alt={feature.title}
                                            className="w-full h-auto object-cover aspect-[4/3]"
                                        />
                                        {/* UI Dots */}
                                        <div className="absolute top-4 left-4 flex gap-1.5 bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow-sm">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Small Feature Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "LBP/USD Sync", icon: <BarChart3 className="w-6 h-6" />, desc: "Set one price, we handle the daily exchange rate automatically." },
                        { label: "Global Reach", icon: <Globe className="w-6 h-6" />, desc: "Sell to the Lebanese diaspora with international card support coming soon." },
                        { label: "Lightning Fast", icon: <Zap className="w-6 h-6" />, desc: "Proprietary image compression makes your store load instantly on slow 4G." }
                    ].map((f, i) => (
                        <Reveal key={i} delay={i * 100}>
                            <div className="space-y-4 p-8 bg-[#f7f8fa] border border-[#e2e4e9] rounded-3xl hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="text-[#1a56db] bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-slate-100">{f.icon}</div>
                                <h4 className="font-bold text-lg text-[#0f1117]">{f.label}</h4>
                                <p className="text-[#4a4e5a] text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>

            </div>
        </section>
    );
}