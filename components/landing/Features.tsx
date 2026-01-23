"use client";

import { Badge } from "@/components/ui/badge";
import { Palette, Share2, Smartphone, BarChart3, Globe, Zap } from "lucide-react";

const FEATURES = [
    {
        title: "Magic Branding",
        desc: "Upload your logo and watch Souqely instantly generate a brand theme that matches your identity perfectly.",
        icon: <Palette className="w-6 h-6" />,
        color: "bg-purple-50 text-purple-600",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" // Replace with branding screenshot
    },
    {
        title: "Mobile-First Admin",
        desc: "Manage your entire shop from your phone while you're on the move. Orders, stock, and customers in one thumb-friendly app.",
        icon: <Smartphone className="w-6 h-6" />,
        color: "bg-blue-50 text-blue-600",
        img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800" // Replace with Mobile Admin screenshot
    },
    {
        title: "Shareable Shop Link",
        desc: "A professional URL (yourbrand.souqely.com) designed to look stunning in Instagram bios and WhatsApp chats.",
        icon: <Share2 className="w-6 h-6" />,
        color: "bg-green-50 text-green-600",
        img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800" // Replace with Storefront link preview
    }
];

export default function Features() {
    return (
        <section className="w-full py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <Badge className="mb-4 bg-slate-900 text-white hover:bg-slate-900 px-4 py-1 rounded-full uppercase text-[10px] tracking-[0.2em] font-black">
                        The Engine
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 uppercase italic">
                        Everything you need <br /> to <span className="text-blue-600 underline decoration-4 underline-offset-8">actually</span> sell.
                    </h2>
                </div>

                {/* Feature Stack (Alternating Layout) */}
                <div className="space-y-32">
                    {FEATURES.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex flex-col lg:items-center gap-12 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                }`}
                        >
                            {/* Text Side */}
                            <div className="flex-1 space-y-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color} shadow-sm`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">
                                    {feature.title}
                                </h3>
                                <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
                                    {feature.desc}
                                </p>
                                <div className="flex items-center gap-6 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-slate-900">1-Click</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Setup Time</span>
                                    </div>
                                    <div className="h-10 w-px bg-slate-200" />
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-slate-900">100%</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mobile Responsive</span>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Side (Mockup Style) */}
                            <div className="flex-1 relative group">
                                <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                                    <img
                                        src={feature.img}
                                        alt={feature.title}
                                        className="w-full h-auto object-cover aspect-[16/10]"
                                    />
                                    {/* Subtle UI Overlay to make it look like a software screenshot */}
                                    <div className="absolute top-4 left-4 flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Small Feature Grid (Secondary Features) */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { label: "LBP/USD Sync", icon: <BarChart3 />, desc: "Set one price, we handle the daily exchange rate automatically." },
                        { label: "Global Reach", icon: <Globe />, desc: "Sell to the Lebanese diaspora with international card support coming soon." },
                        { label: "Lightning Fast", icon: <Zap />, desc: "Proprietary image compression makes your store load instantly on slow 4G." }
                    ].map((f, i) => (
                        <div key={i} className="space-y-4 p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-colors">
                            <div className="text-blue-600">{f.icon}</div>
                            <h4 className="font-black text-lg uppercase tracking-tight">{f.label}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}