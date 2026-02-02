"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const getGoogleFontLink = (fontName: string) => {
    if (!fontName) return null;
    const formatted = fontName.replace(/\s+/g, '+');
    return `https://fonts.googleapis.com/css2?family=${formatted}:wght@400;700&display=swap`;
};

export function PoweredByFooter({ store }: { store: any }) {

    // Always respect user settings
    const theme = {
        bg: store.background_color || "#ffffff",
        text: store.text_color || "#0f172a",
        primary: store.primary_color || "#2563eb",
        font: store.font_family || "Inter"
    };

    return (
        <footer className="w-full py-8 border-t transition-colors duration-300 opacity-90"
            style={{
                backgroundColor: theme.bg,
                color: theme.text,
                fontFamily: theme.font,
                borderColor: `${theme.text}10` // Subtle border matching text color
            }}>

            {theme.font && <link href={getGoogleFontLink(theme.font)!} rel="stylesheet" />}

            <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div className="opacity-80 text-sm font-medium">
                    &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
                </div>

                <Link href="https://souqely.com" target="_blank" className="group flex items-center gap-2 transition-all hover:opacity-100 opacity-60">
                    <span className="text-xs font-bold uppercase tracking-widest">Powered by</span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full group-hover:bg-black/5 transition-colors"
                        style={{ border: `1px solid ${theme.text}20` }}>
                        <ShoppingBag className="w-4 h-4" style={{ color: theme.primary }} />
                        <span className="font-black tracking-tight text-sm">SOUQELY</span>
                    </div>
                </Link>
            </div>
        </footer>
    );
}