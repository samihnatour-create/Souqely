"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, Smartphone, ChevronRight } from "lucide-react";
import { joinWaitlist } from "@/lib/waitlist-actions"; // Keep your existing server action
import { Reveal } from "./reveal"; // Import the animation wrapper we made
import Image from "next/image";

export default function Hero() {
    const [email, setEmail] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string }>({
        type: null,
        text: "",
    });

    async function handleHeroSubmit(formData: FormData) {
        setIsPending(true);
        setMessage({ type: null, text: "" });

        try {
            const result = await joinWaitlist(formData);
            if (result.error) {
                setMessage({ type: "error", text: result.error });
            } else {
                setMessage({ type: "success", text: result.message || "You're on the list!" });
                setEmail("");
            }
        } catch (err) {
            setMessage({ type: "error", text: "Something went wrong. Try again!" });
        } finally {
            setIsPending(false);
        }
    }

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden flex flex-col items-center justify-center text-center bg-white">

            {/* 1. Background Gradients (From HTML) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[800px] h-[500px] bg-[#1a56db]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[400px] bg-[#3b7cff]/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

                {/* 2. Badge (From HTML) */}
                <Reveal>
                    <div className="inline-flex items-center gap-2 bg-[#e8effe] border border-[#1a56db]/15 rounded-full px-4 py-1.5 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a56db] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1a56db]"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1a56db]">Early access — limited spots</span>
                    </div>
                </Reveal>

                {/* 3. Headline (From HTML - Serif Font) */}
                <Reveal delay={100}>
                    <h1 className="font-serif text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] text-[#0f1117] mb-6">
                        Sell online.<br />
                        <span className="text-[#1a56db]">The way Lebanon works.</span>
                    </h1>
                </Reveal>

                {/* 4. Subheadline (From HTML) */}
                <Reveal delay={200}>
                    <p className="text-lg md:text-xl text-[#4a4e5a] max-w-xl mx-auto leading-relaxed mb-10">
                        OMT. Whish. WhatsApp. LBP. Everything local merchants actually use. Finally in one place.
                    </p>
                </Reveal>

                {/* 5. Functional Form (Styled to match HTML buttons) */}
                <Reveal delay={300} className="w-full max-w-lg">
                    <form action={handleHeroSubmit} className="flex flex-col sm:flex-row gap-2 p-2 bg-white border border-[#e2e4e9] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
                        <Input
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            required
                            className="border-none bg-transparent h-12 px-4 focus-visible:ring-0 text-base flex-1 text-[#0f1117] placeholder:text-slate-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-12 px-8 bg-[#1a56db] hover:bg-[#1240a8] text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg min-w-[160px]"
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <span className="flex items-center gap-2">
                                    Join Waitlist <ChevronRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Feedback Message */}
                    {message.text && (
                        <p className={`mt-4 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
                            {message.type === "success" ? "✅ " : "❌ "}{message.text}
                        </p>
                    )}
                </Reveal>

                {/* 6. Social Proof (From HTML) */}
                <Reveal delay={400}>
                    <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium text-[#8a8f9e]">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1a56db]" /> Free to start</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1a56db]" /> No credit card</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1a56db]" /> 3 min setup</div>
                    </div>
                </Reveal>

            </div>

            {/* 7. Dashboard Preview (From HTML - Glossy Look) */}
            <div className="w-full mt-20 px-0 md:px-0">
                <Reveal delay={500}>
                    <div className="relative max-w-6xl mx-auto rounded-[1.5rem] md:rounded-[2.5rem] border-[6px] md:border-[10px] border-[#0f1117] bg-[#0f1117] shadow-2xl shadow-blue-900/20 overflow-hidden aspect-[16/10] md:aspect-[21/9] group">

                        {/* 🟢 REAL SCREENSHOT */}
                        <div className="absolute inset-0 bg-slate-900">
                            <Image
                                src="/dashboard-preview.png"
                                alt="Souqely Dashboard Interface"
                                fill
                                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                                sizes="(max-width: 768px) 100vw, 1200px"
                                priority
                                quality={90}
                            />
                        </div>

                        {/* Glossy Overlay Reflection (Kept for style) */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-10" />

                        {/* Optional: Dark Overlay on Mobile to make text readable if you have text over it */}
                        <div className="absolute inset-0 bg-black/10 md:bg-transparent pointer-events-none" />

                    </div>
                </Reveal>
            </div>
        </section>
    );
}