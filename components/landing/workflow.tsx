"use client";

import { Badge } from "@/components/ui/badge";
import { Store, PackagePlus, SendHorizontal, ArrowRight } from "lucide-react";

const STEPS = [
    {
        number: "01",
        title: "Setup your Brand",
        desc: "Enter your store name and upload your logo. Our engine automatically builds your brand's unique color theme.",
        icon: <Store className="w-6 h-6" />,
    },
    {
        number: "02",
        title: "Add your Products",
        desc: "List your inventory with local LBP and USD pricing. We handle the daily exchange rate conversions for you.",
        icon: <PackagePlus className="w-6 h-6" />,
    },
    {
        number: "03",
        title: "Start Selling",
        desc: "Share your professional link on Instagram and WhatsApp. Receive orders directly in your Souqely dashboard.",
        icon: <SendHorizontal className="w-6 h-6" />,
    }
];

export default function Workflow() {
    return (
        <section className="w-full py-24 bg-white border-y border-slate-100">
            <div className="container mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
                    <div className="max-w-xl">
                        <Badge variant="outline" className="mb-4 px-4 py-1 text-slate-500 border-slate-200 uppercase tracking-[0.2em] font-bold text-[10px]">
                            The Process
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none uppercase italic">
                            From Idea to Storefront <br /> in <span className="text-blue-600">under 3 minutes.</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium max-w-xs border-l-2 border-blue-600 pl-4">
                        No technical skills required. If you can use WhatsApp, you can use Souqely.
                    </p>
                </div>

                {/* The 3-Step Flow Diagram */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">

                    {/* Connector Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-slate-100 z-0" />

                    {STEPS.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-start group">
                            {/* Step Icon & Number */}
                            <div className="flex items-center justify-between w-full mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500">
                                    {step.icon}
                                </div>
                                <span className="text-5xl font-black text-slate-50 opacity-10 group-hover:opacity-100 group-hover:text-blue-50 transition-all duration-500 select-none">
                                    {step.number}
                                </span>
                            </div>

                            {/* Text Content */}
                            <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase mb-4">
                                {step.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed mb-6 pr-4">
                                {step.desc}
                            </p>

                            {/* Mobile "Next" Arrow (Last item hidden) */}
                            {index < 2 && (
                                <ArrowRight className="hidden md:block absolute -right-6 top-14 w-5 h-5 text-slate-200" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Trust Proof Bar */}
                <div className="mt-20 pt-10 border-t border-slate-50 flex flex-wrap gap-8 justify-center md:justify-start opacity-60">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Works with:</span>
                    <div className="flex gap-6 items-center grayscale">
                        <span className="font-black text-slate-900">OMT</span>
                        <span className="font-black text-slate-900">Whish</span>
                        <span className="font-black text-slate-900">Cash</span>
                    </div>
                </div>
            </div>
        </section>
    );
}