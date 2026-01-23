"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Rocket, CreditCard, ChevronRight, PlayCircle, Loader2 } from "lucide-react";
import { joinWaitlist } from "@/lib/waitlist-actions";

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
        <section className="relative w-full min-h-screen bg-white overflow-hidden flex flex-col items-center justify-center pt-20">
            {/* 1. Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-blue-50 rounded-full blur-[120px] opacity-60" />
                <div className="absolute bottom-[20%] left-[5%] w-96 h-96 bg-slate-100 rounded-full blur-[120px] opacity-40" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">

                {/* 2. Badge */}
                <Badge className="mb-6 py-1.5 px-4 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 rounded-full font-bold flex gap-2 items-center animate-in fade-in slide-in-from-bottom-3 duration-700">
                    <Rocket className="w-3.5 h-3.5" />
                    Join 50+ merchants on the waitlist
                </Badge>

                {/* 3. Headline */}
                <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 uppercase italic">
                    Turn your ideas <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-slate-400">
                        into an online store
                    </span>
                </h1>

                {/* 4. Value Prop */}
                <p className="max-w-2xl text-lg md:text-xl text-slate-500 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                    Tired of "Not available in your country"? Souqely is built for the Lebanese struggle.
                    Professional e-commerce with native OMT, Whish, and LBP support.
                </p>

                {/* 5. Functional Form */}
                <div className="w-full max-w-lg flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                    <form action={handleHeroSubmit} className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white border border-slate-200 shadow-2xl shadow-blue-900/10 rounded-2xl sm:rounded-full">
                        <Input
                            name="email"
                            type="email"
                            placeholder="Enter your email address"
                            required
                            className="border-none bg-transparent h-12 px-6 focus-visible:ring-0 text-base flex-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-12 px-8 rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-700 font-bold text-base transition-all active:scale-95 min-w-[140px]"
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join Waitlist"}
                        </Button>
                    </form>

                    {/* Feedback Message */}
                    {message.text && (
                        <p className={`text-sm font-bold animate-in fade-in slide-in-from-top-2 ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
                            {message.type === "success" ? "✅ " : "❌ "}{message.text}
                        </p>
                    )}

                    <button className="group flex items-center justify-center gap-2 text-slate-400 hover:text-blue-600 transition-colors py-2 font-medium text-sm">
                        <PlayCircle className="w-4 h-4" />
                        Request a personalized demo
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* 6. High-impact Mockup */}
                <div className="mt-16 w-full max-w-5xl relative group animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 pointer-events-none h-full" />

                    <div className="relative z-10 rounded-2xl md:rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden bg-slate-50 aspect-video">
                        <div className="w-full h-full flex items-center justify-center bg-white">
                            <div className="text-center">
                                <p className="font-black text-slate-100 text-[6rem] md:text-[10rem] select-none tracking-tighter italic">SOUQELY</p>
                                <p className="text-slate-400 font-medium -mt-8 md:-mt-16 tracking-widest uppercase text-xs md:text-sm">Your Storefront Preview</p>
                            </div>
                        </div>

                        {/* Floating UI Element */}
                        <div className="absolute top-6 left-6 md:top-10 md:left-10 bg-white p-3 md:p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-tighter">New Order</p>
                                <p className="text-xs md:text-sm font-black text-slate-900">$150.00 via Whish</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. Trust Logos */}
                <div className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <span className="font-black text-xl tracking-tighter text-slate-900 italic">OMT INTEGRATED</span>
                    <span className="font-black text-xl tracking-tighter text-slate-900 italic">WHISH READY</span>
                    <span className="font-black text-xl tracking-tighter text-slate-900 italic">LBP/USD SYNC</span>
                </div>
            </div>
        </section>
    );
}