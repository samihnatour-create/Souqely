"use client";

import { useCart } from "@/lib/context/cart-context";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";
// 🔴 REMOVED: import { CartSheet } from "./cart-sheet"; 
import VariantDrawer from "./variant-drawer";
import { toast } from "sonner";

// 1. HEADER BUTTON (Decoupled & Fixed)
export function CartHeaderButton({ slug, color, radius }: { slug: string, color: string, radius: string }) {
    // 🟢 Fix: Get openCart from context
    const { cartCount, openCart } = useCart();

    return (
        <button
            onClick={openCart} // 🟢 Fix: Directly trigger the global context
            className="flex items-center gap-2 text-white py-2.5 px-4 md:px-6 font-bold shadow-lg transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: color, borderRadius: radius }}
        >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-xs hidden md:inline">Cart ({cartCount})</span>
            <span className="text-xs md:hidden">({cartCount})</span>
        </button>
    );
}

// 2. QUICK ADD BUTTON (With Variant Logic)
export function QuickAddButton({ product, color, variants }: { product: any, color: string, variants: any[] }) {
    const { addItem, openCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // A. IF VARIANTS EXIST -> OPEN DRAWER
        if (variants && variants.length > 0) {
            setIsDrawerOpen(true);
            return;
        }

        // B. NO VARIANTS -> DIRECT ADD
        setLoading(true);
        setTimeout(() => {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price_usd,
                image: product.main_image_url || product.image_url,
                quantity: 1
            });
            toast.success("Added to cart");
            setLoading(false);
            openCart();
        }, 500);
    };

    return (
        <>
            <button
                onClick={handleAdd}
                // Mobile: Visible | Desktop: Hidden until hover
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

            {/* DRAWER COMPONENT */}
            <VariantDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                product={product}
                variants={variants || []}
                storeColor={color}
            />
        </>
    );
}