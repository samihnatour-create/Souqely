"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToWaitlist = () => {
        document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav
            className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled
                ? "bg-white/80 backdrop-blur-lg border-b border-slate-100 py-4 shadow-sm"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-black text-2xl tracking-tighter italic text-slate-900 uppercase">
                        SOUQELY
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link href="#features" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                        Features
                    </Link>
                    <Link href="#workflow" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                        Process
                    </Link>
                    <Link href="/auth/login" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                        Sign In
                    </Link>
                </div>

                {/* CTA */}
                <Button
                    onClick={scrollToWaitlist}
                    className="rounded-full px-6 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
                >
                    Join Waitlist
                </Button>
            </div>
        </nav>
    );
}