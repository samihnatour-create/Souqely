"use client";

import { useCart } from "@/lib/context/cart-context";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";
import { CartSheet } from "./cart-sheet";
import Link from "next/link";

// 1. HEADER BUTTON (No changes needed, keeping it for context)
export function CartHeaderButton({ slug, color, radius }: { slug: string, color: string, radius: string }) {
    const { cartCount } = useCart();

    const TriggerButton = (
        <button
            className="flex items-center gap-2 text-white py-2.5 px-4 md:px-6 font-bold shadow-lg transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: color, borderRadius: radius }}
        >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-xs hidden md:inline">Cart ({cartCount})</span>
            <span className="text-xs md:hidden">({cartCount})</span>
        </button>
    );

    return <CartSheet trigger={TriggerButton} slug={slug} color={color} radius={radius} />;
}

// 2. QUICK ADD BUTTON (Updated for Mobile)
export function QuickAddButton({ product, color }: { product: any, color: string }) {
    const { addItem } = useCart();
    const [loading, setLoading] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        setTimeout(() => {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price_usd, // Ensure this matches your DB column name (price or price_usd)
                image: product.main_image_url || product.image_url,
                quantity: 1
            });
            setLoading(false);
        }, 500);
    };

    return (
        <button
            onClick={handleAdd}
            // MOBILE FIX:
            // 1. opacity-100 (Visible by default) -> md:opacity-0 (Hidden on desktop)
            // 2. translate-y-0 (In place by default) -> md:translate-y-14 (Hidden below on desktop)
            className="absolute bottom-3 right-3 md:bottom-4 md:right-4 h-8 w-8 md:h-10 md:w-10 bg-white rounded-full shadow-lg flex items-center justify-center 
                 opacity-100 translate-y-0 
                 md:opacity-0 md:translate-y-14 md:group-hover:translate-y-0 md:group-hover:opacity-100 
                 transition-all duration-300 hover:bg-slate-900 hover:text-white z-20"
            style={{ color: color }}
            disabled={loading}
            aria-label="Add to cart"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
        </button>
    );
}