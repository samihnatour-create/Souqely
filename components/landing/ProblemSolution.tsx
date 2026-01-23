"use client";

import { Badge } from "@/components/ui/badge";
import { XCircle, CheckCircle2, MessageSquare, Smartphone, Zap, ShieldCheck } from "lucide-react";

const COMPARISONS = [
    {
        title: "Order Management",
        old: "Lost in Instagram DMs and scattered WhatsApp voice notes.",
        new: "A centralized dashboard that tracks every order from click to delivery.",
        icon: <MessageSquare className="w-6 h-6" />,
    },
    {
        title: "Local Payments",
        old: "Manually confirming OMT/Whish transfers through screenshots.",
        new: "Native checkout integration for OMT, Whish, and Cash on Delivery.",
        icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
        title: "Inventory Control",
        old: "Accidentally selling out-of-stock items because of manual counting.",
        new: "Real-time inventory sync across your storefront and admin panel.",
        icon: <Zap className="w-6 h-6" />,
    },
    {
        title: "Storefront UX",
        old: "Sending customers a PDF catalog or a linktree of screenshots.",
        new: "A fast, professional, Shopify-style shop that builds instant trust.",
        icon: <Smartphone className="w-6 h-6" />,
    }
];

export default function ProblemSolution() {
    const scrollToWaitlist = () => {
        const element = document.getElementById("waitlist-form");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <section className="w-full py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="max-w-3xl mb-16">
                    <Badge variant="outline" className="mb-4 px-4 py-1 text-blue-600 border-blue-200 uppercase tracking-widest font-bold">
                        The Souqely Advantage
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-6 leading-none">
                        BUILT FOR THE <br />
                        <span className="text-blue-600">LEBANESE STRUGGLE.</span>
                    </h2>
                    <p className="text-xl text-slate-500 leading-relaxed">
                        Stop fighting with tools designed for America. Use the first e-commerce platform
                        engineered specifically for how business works in Lebanon.
                    </p>
                </div>

                {/* Modular Grid (Inspired by Webflow) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-100 border border-slate-100 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/5">

                    {COMPARISONS.map((item, index) => (
                        <div key={index} className="bg-white p-8 md:p-12 flex flex-col group">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">
                                    {item.title}
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* The Problem */}
                                <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 border border-slate-100 grayscale hover:grayscale-0 transition-all">
                                    <XCircle className="w-5 h-5 text-red-400 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Before Souqely</p>
                                        <p className="text-slate-600 font-medium">{item.old}</p>
                                    </div>
                                </div>

                                {/* The Solution */}
                                <div className="flex gap-4 items-start p-4 rounded-2xl bg-blue-50 border border-blue-100">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">With Souqely</p>
                                        <p className="text-slate-900 font-bold">{item.new}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                {/* Call to Action Bar */}
                <div className="mt-12 p-8 bg-slate-900 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h4 className="text-white font-bold text-xl">Ready to ditch the manual headache?</h4>
                        <p className="text-slate-400">Join the waitlist to be among the first stores to launch.</p>
                    </div>
                    <button
                        onClick={scrollToWaitlist}
                        className="px-8 h-12 bg-white text-slate-900 font-black uppercase tracking-widest text-sm rounded-full hover:bg-blue-600 hover:text-white transition-all active:scale-95">
                        Secure Your Spot
                    </button>
                </div>
            </div>
        </section>
    );
}