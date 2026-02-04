"use client";

import { MessageSquare, Smartphone, Zap, ShieldCheck, ArrowDown } from "lucide-react";
import { Reveal } from "./reveal"; // 🟢 Animation Wrapper

const COMPARISONS = [
    {
        title: "Order Management",
        old: "Lost in Instagram DMs and scattered WhatsApp voice notes.",
        new: "A centralized dashboard that tracks every order from click to delivery.",
        icon: <MessageSquare className="w-5 h-5" />,
    },
    {
        title: "Local Payments",
        old: "Manually confirming OMT/Whish transfers through screenshots.",
        new: "Native checkout integration for OMT, Whish, and Cash on Delivery.",
        icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
        title: "Inventory Control",
        old: "Accidentally selling out-of-stock items because of manual counting.",
        new: "Real-time inventory sync across your storefront and admin panel.",
        icon: <Zap className="w-5 h-5" />,
    },
    {
        title: "Storefront UX",
        old: "Sending customers a PDF catalog or a linktree of screenshots.",
        new: "A fast, professional, Shopify-style shop that builds instant trust.",
        icon: <Smartphone className="w-5 h-5" />,
    }
];

export default function ProblemSolution() {
    const scrollToWaitlist = () => {
        document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="w-full py-24 bg-[#f7f8fa] px-6">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <Reveal>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1a56db] mb-3 block">
                            Sound familiar?
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-semibold text-[#0f1117] mb-6">
                            This is how most Lebanese sellers operate.
                        </h2>
                        <p className="text-lg text-[#4a4e5a] leading-relaxed">
                            Souqely exists to fix every single one of these headaches.
                        </p>
                    </div>
                </Reveal>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {COMPARISONS.map((item, index) => (
                        <Reveal key={index} delay={index * 100}>
                            <div className="h-full bg-white border border-[#e2e4e9] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">

                                {/* Header */}
                                <div className="p-6 border-b border-[#e2e4e9] flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#f7f8fa] flex items-center justify-center text-[#0f1117] group-hover:bg-[#1a56db] group-hover:text-white transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-lg text-[#0f1117]">{item.title}</h3>
                                </div>

                                {/* The "Before" Section */}
                                <div className="p-6 bg-[#f7f8fa]/50 border-b border-[#e2e4e9]">
                                    <span className="inline-block px-2.5 py-1 rounded bg-[#fdf0ee] text-[#c0392b] text-[10px] font-bold uppercase tracking-widest mb-3">
                                        Before
                                    </span>
                                    <p className="text-[#4a4e5a] text-sm leading-relaxed">
                                        {item.old}
                                    </p>
                                </div>

                                {/* The "After" Section */}
                                <div className="p-6 bg-white relative overflow-hidden">
                                    {/* Decorative Glow */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 blur-2xl rounded-full" />

                                    <span className="inline-block px-2.5 py-1 rounded bg-[#e8effe] text-[#1a56db] text-[10px] font-bold uppercase tracking-widest mb-3">
                                        With Souqely
                                    </span>
                                    <p className="text-[#0f1117] font-medium text-sm leading-relaxed relative z-10">
                                        {item.new}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Bottom CTA */}
                <Reveal delay={400}>
                    <div className="mt-16 text-center">
                        <button
                            onClick={scrollToWaitlist}
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#4a4e5a] hover:text-[#1a56db] transition-colors uppercase tracking-widest"
                        >
                            Stop struggling, start selling
                            <ArrowDown className="w-4 h-4 animate-bounce" />
                        </button>
                    </div>
                </Reveal>

            </div>
        </section>
    );
}