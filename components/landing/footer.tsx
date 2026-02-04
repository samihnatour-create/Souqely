"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight } from "lucide-react";
import { joinWaitlist } from "@/lib/waitlist-actions";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
        type: null,
        message: "",
    });

    async function handleWaitlistSubmit(formData: FormData) {
        setIsPending(true);
        setStatus({ type: null, message: "" });
        try {
            const result = await joinWaitlist(formData);
            if (result.error) setStatus({ type: "error", message: result.error });
            else {
                setStatus({ type: "success", message: result.message || "You're on the list!" });
                setEmail("");
            }
        } catch {
            setStatus({ type: "error", message: "Something went wrong." });
        } finally {
            setIsPending(false);
        }
    }

    return (
        <footer className="bg-[#0f1117] text-white/50 pt-20 pb-12 px-6 border-t border-white/5 relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a56db]/5 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto">

                {/* 🟢 FIX: Added id="waitlist-form" here so Navbar button scrolls to this spot */}
                <div id="waitlist-form" className="mb-20 pb-20 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 scroll-mt-24">
                    <div className="max-w-xl text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-3">
                            Don't miss the launch.
                        </h3>
                        <p className="text-white/60">
                            We are onboarding merchants in batches. Secure your spot now.
                        </p>
                    </div>

                    {/* Mini Form */}
                    <form action={handleWaitlistSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
                        <Input
                            name="email"
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-[#1a56db] focus:ring-0"
                        />
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="h-12 bg-[#1a56db] hover:bg-[#1240a8] text-white font-bold rounded-xl px-6 whitespace-nowrap"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join List"}
                        </Button>
                    </form>
                    {status.message && (
                        <p className={`text-sm mt-2 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {status.message}
                        </p>
                    )}
                </div>

                {/* MIDDLE SECTION: Links */}
                <div className="flex flex-col md:flex-row justify-between gap-12">

                    {/* Brand */}
                    <div className="space-y-4 max-w-xs">
                        <span className="text-white font-bold text-xl tracking-tight">SOUQELY</span>
                        <p className="text-sm leading-relaxed text-white/40">
                            The first e-commerce platform built for the Lebanese market. From Beirut — to everywhere.
                        </p>
                    </div>

                    {/* Link Columns */}
                    <div className="flex flex-wrap gap-16 text-sm">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Platform</h4>
                            <Link href="#how" className="hover:text-white transition-colors">How It Works</Link>
                            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                            <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Legal</h4>
                            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Connect</h4>
                            <Link href="#" className="hover:text-white transition-colors flex items-center gap-2">
                                Instagram <ArrowRight className="w-3 h-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">WhatsApp</Link>
                            <Link href="mailto:hello@souqely.com" className="hover:text-white transition-colors">Support</Link>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
                    <p>© {new Date().getFullYear()} Souqely. All rights reserved.</p>
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Systems Operational</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}