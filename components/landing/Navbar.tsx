"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToWaitlist = () => {
        // Close mobile menu if open
        setIsOpen(false);
        document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-[100] transition-all duration-300 font-sans",
                isScrolled
                    ? "bg-white/90 backdrop-blur-md border-b border-[#e2e4e9] py-3 shadow-sm"
                    : "bg-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* 1. LOGO */}
                <Link href="/" className="flex items-center gap-2 z-50">
                    <span className="font-bold text-xl tracking-tight text-[#0f1117]">
                        SOUQELY
                    </span>
                </Link>

                {/* 2. DESKTOP LINKS (Hidden on Mobile) */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="#features"
                        className="text-sm font-medium text-[#4a4e5a] hover:text-[#1a56db] transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href="#workflow"
                        className="text-sm font-medium text-[#4a4e5a] hover:text-[#1a56db] transition-colors"
                    >
                        How it works
                    </Link>
                    <Link
                        href="/auth/login"
                        className="text-sm font-medium text-[#4a4e5a] hover:text-[#1a56db] transition-colors"
                    >
                        Sign In
                    </Link>
                    <Button
                        onClick={scrollToWaitlist}
                        className="h-10 px-6 bg-[#1a56db] hover:bg-[#1240a8] text-white font-bold text-sm rounded-xl shadow-[0_2px_12px_rgba(26,86,219,0.2)] transition-all hover:-translate-y-0.5"
                    >
                        Join Waitlist
                    </Button>
                </div>

                {/* 3. MOBILE HAMBURGER MENU (Visible only on Mobile) */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-[#0f1117]">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] flex flex-col pt-12">
                            <div className="flex flex-col gap-6">
                                <Button
                                    onClick={scrollToWaitlist}
                                    className="w-full h-12 text-base bg-[#1a56db] hover:bg-[#1240a8] text-white font-bold rounded-xl shadow-md"
                                >
                                    Join Waitlist
                                </Button>

                                <div className="flex flex-col gap-4 px-2">
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-medium text-[#0f1117]"
                                    >
                                        Login
                                    </Link>
                                    <div className="h-px bg-slate-100 my-1"></div>
                                    <Link
                                        href="#features"
                                        onClick={() => setIsOpen(false)}
                                        className="text-base text-[#4a4e5a]"
                                    >
                                        Features
                                    </Link>
                                    <Link
                                        href="#workflow"
                                        onClick={() => setIsOpen(false)}
                                        className="text-base text-[#4a4e5a]"
                                    >
                                        How it works
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </nav>
    );
}