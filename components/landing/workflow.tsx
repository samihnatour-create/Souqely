"use client";

import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Store, PackagePlus, SendHorizontal, ArrowRight } from "lucide-react";

const STEPS = [
    {
        num: "01",
        title: "Setup your Brand",
        desc: "Enter your store name and upload your logo. Our engine automatically builds your brand's unique color theme.",
        icon: <Store className="w-5 h-5 text-white" />
    },
    {
        num: "02",
        title: "Add your Products",
        desc: "List your inventory with local LBP and USD pricing. We handle the daily exchange rate conversions for you.",
        icon: <PackagePlus className="w-5 h-5 text-white" />
    },
    {
        num: "03",
        title: "Start Selling",
        desc: "Share your professional link on Instagram and WhatsApp. Receive orders directly in your Souqely dashboard.",
        icon: <SendHorizontal className="w-5 h-5 text-white" />
    }
];

export default function Workflow() {
    return (
        <section className="w-full py-24 bg-white" id="workflow">
            <div className="max-w-4xl mx-auto px-6">

                {/* Section Header */}
                <Reveal>
                    <div className="text-center mb-20">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1a56db] mb-3 block">
                            How it works
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif font-semibold text-[#0f1117] mb-6">
                            From idea to live store.<br />
                            <span className="text-[#1a56db]">Under 3 minutes.</span>
                        </h2>
                    </div>
                </Reveal>

                {/* Timeline Steps (Vertical Layout from HTML) */}
                <div className="relative border-l-2 border-[#e2e4e9] ml-4 md:ml-12 space-y-16 pl-8 md:pl-16">
                    {STEPS.map((step, index) => (
                        <Reveal key={index} delay={index * 150} className="relative">
                            {/* Number Bubble */}
                            <div className="absolute -left-[54px] md:-left-[86px] top-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a56db] flex items-center justify-center border-4 border-white shadow-sm z-10 transition-transform hover:scale-110">
                                {step.icon}
                            </div>

                            {/* Text Content */}
                            <h3 className="text-xl font-bold text-[#0f1117] mb-2 font-serif">
                                {step.title}
                            </h3>
                            <p className="text-[#4a4e5a] leading-relaxed max-w-lg text-lg">
                                {step.desc}
                            </p>
                        </Reveal>
                    ))}
                </div>

                {/* Integration Badges */}
                <Reveal delay={400} className="mt-20 pt-10 border-t border-[#f7f8fa] flex flex-wrap justify-center gap-4 md:gap-8 items-center text-sm font-medium text-[#8a8f9e]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1a56db]">Works seamlessly with:</span>
                    <span className="px-4 py-2 bg-[#f7f8fa] border border-[#e2e4e9] rounded-lg text-[#0f1117]">OMT</span>
                    <span className="px-4 py-2 bg-[#f7f8fa] border border-[#e2e4e9] rounded-lg text-[#0f1117]">Whish</span>
                    <span className="px-4 py-2 bg-[#f7f8fa] border border-[#e2e4e9] rounded-lg text-[#0f1117]">Cash on Delivery</span>
                </Reveal>

            </div>
        </section>
    );
}