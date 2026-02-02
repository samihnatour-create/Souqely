"use client";

import { useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check } from "lucide-react"; // Add Check icon
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProductInteraction({ product, variants, theme, lbpRate }: any) {
    const { addItem, openCart } = useCart();
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [isAdded, setIsAdded] = useState(false); // Track visual feedback

    const handleAddToCart = () => {
        if (variants?.length > 0 && !selectedVariant) {
            toast.error("Please select an option first!");
            return;
        }

        addItem({
            id: product.id,
            name: product.name,
            price: selectedVariant ? selectedVariant.price_usd : product.price_usd,
            image: product.main_image_url,
            variantId: selectedVariant?.id,
            variantName: selectedVariant?.name,
            quantity: 1,
        });

        // Visual Feedback on Button
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);

        openCart(); // Open Sidebar
    };

    const currentPrice = selectedVariant ? selectedVariant.price_usd : product.price_usd;
    const lbpPrice = (currentPrice * (lbpRate || 89500)).toLocaleString();

    return (
        <div className="space-y-10">
            {/* 🟢 ENHANCED PRICE DISPLAY */}
            <div>
                <div className="text-4xl font-black" style={{ color: theme.color }}>
                    ${currentPrice}
                </div>
                <p className="text-sm font-bold text-slate-400 mt-1">
                    ≈ {lbpPrice} LBP
                </p>
            </div>

            {/* 🟢 ENHANCED VARIANT SELECTOR */}
            {variants?.length > 0 && (
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Select Size
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                        {variants.map((v: any) => (
                            <button
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                className={cn(
                                    "h-12 rounded-xl border-2 font-bold transition-all text-xs flex items-center justify-center shadow-sm",
                                    selectedVariant?.id === v.id
                                        ? "border-slate-900 bg-slate-900 text-white"
                                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                                )}
                                style={selectedVariant?.id === v.id ? { backgroundColor: theme.color, borderColor: theme.color } : {}}
                            >
                                {v.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 🟢 FIXED BUTTON WITH FEEDBACK */}
            <div className="pt-8 border-t border-slate-100">
                <Button
                    onClick={handleAddToCart}
                    className="w-full h-16 text-lg font-black shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    style={{ backgroundColor: theme.color, borderRadius: theme.radius }}
                >
                    {isAdded ? (
                        <>
                            <Check className="w-6 h-6 mr-3" /> Added!
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-5 h-5 mr-3" /> Add to Cart
                        </>
                    )}
                </Button>
                {/* 🟢 FIXED CONTINUE SHOPPING LINK */}
                <Link
                    href="/"
                    className="group flex items-center justify-center gap-2 mt-6 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors cursor-pointer py-2"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}