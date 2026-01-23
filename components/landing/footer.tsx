"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, Loader2 } from "lucide-react";
import { joinWaitlist } from "@/lib/waitlist-actions"; // Ensure this path is correct

export default function Footer() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
        type: null,
        message: "",
    });
    const [isPending, setIsPending] = useState(false);

    async function handleWaitlistSubmit(formData: FormData) {
        setIsPending(true);
        setStatus({ type: null, message: "" });

        try {
            const result = await joinWaitlist(formData);

            if (result.error) {
                setStatus({ type: "error", message: result.error });
            } else if (result.success || result.message) {
                setStatus({ type: "success", message: result.message || "Success!" });
                setEmail(""); // Clear input on success
            }
        } catch (err) {
            setStatus({ type: "error", message: "Something went wrong. Please try again." });
        } finally {
            setIsPending(false);
        }
    }

    return (
        <footer className="w-full bg-slate-900 pt-24 pb-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full -mr-48 -mt-48" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* WAITLIST SECTION */}
                <div id="waitlist-form" className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl mb-24">
                    <Badge className="mb-6 bg-blue-50 text-blue-600 border-none hover:bg-blue-50 px-4 py-1.5 rounded-full font-bold">
                        Limited Early Access
                    </Badge>

                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.9] uppercase italic">
                        Be the first to <br /> launch on <span className="text-blue-600">Souqely.</span>
                    </h2>

                    <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
                        We are onboarding merchants in batches to ensure the best support. Secure your spot on the waitlist today.
                    </p>

                    <form action={handleWaitlistSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <Input
                                name="email"
                                type="email"
                                placeholder="Your business email"
                                required
                                className="h-14 rounded-2xl border-slate-200 px-6 text-base focus-visible:ring-blue-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center min-w-[160px]"
                            >
                                {isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Join the List"
                                )}
                            </Button>
                        </div>

                        {/* Status Message */}
                        {status.type && (
                            <div className={`text-sm font-bold animate-in fade-in slide-in-from-top-2 ${status.type === "success" ? "text-green-600" : "text-red-500"
                                }`}>
                                {status.type === "success" ? "✅ " : "❌ "}
                                {status.message}
                            </div>
                        )}
                    </form>

                    <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400 font-bold text-xs uppercase tracking-widest mt-8">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> No Credit Card Required
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" /> 50+ Stores Waiting
                        </div>
                    </div>
                </div>

                {/* BOTTOM NAVIGATION & BRANDING */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 border-b border-slate-800 pb-20">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">SOUQELY</span>
                        <p className="mt-4 text-slate-400 max-w-xs leading-relaxed">
                            The first e-commerce engine built specifically for the Lebanese market. From Beirut to the world.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
                        <ul className="space-y-4 text-slate-400 text-sm font-medium">
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">How it Works</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Pricing</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Request Demo</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Contact</h4>
                        <ul className="space-y-4 text-slate-400 text-sm font-medium">
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Instagram</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">WhatsApp</li>
                            <li className="hover:text-blue-400 cursor-pointer transition-colors">Support</li>
                        </ul>
                    </div>
                </div>

                {/* THE FINAL BRANDING SIGN-OFF */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
                        &copy; {new Date().getFullYear()} Souqely. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 group cursor-default">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 group-hover:text-slate-400 transition-colors">
                            POWERED BY
                        </span>
                        <span className="text-sm font-black text-slate-400 group-hover:text-white transition-colors tracking-tighter italic">
                            SOUQELY
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}