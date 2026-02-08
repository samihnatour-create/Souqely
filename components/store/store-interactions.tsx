"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/context/cart-context";
import { ShoppingBag, Loader2, Plus, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

// UI Components
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// ----------------------------------------------------------------------
// 1. CART HEADER BUTTON
// ----------------------------------------------------------------------
export function CartHeaderButton({ slug, color, radius }: { slug: string, color: string, radius: string }) {
    const { cartCount, openCart } = useCart();

    return (
        <button
            onClick={openCart}
            className="flex items-center gap-2 text-white py-2.5 px-4 md:px-6 font-bold shadow-lg transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: color, borderRadius: radius }}
        >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-xs hidden md:inline">Cart ({cartCount})</span>
            <span className="text-xs md:hidden">({cartCount})</span>
        </button>
    );
}

// ----------------------------------------------------------------------
// 2. QUICK ADD BUTTON (Fixed Logic)
// ----------------------------------------------------------------------
export function QuickAddButton({
    product,
    color,
    variants,
    className
}: {
    product: any;
    color: string;
    variants?: any[];
    className?: string;
}) {
    const { addItem, openCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isDesktop = useMediaQuery("(min-width: 768px)");

    // 🔍 DEBUG LOGIC: Check EVERY possible location for variants
    const possibleVariants = [
        variants,                      // 1. Passed as prop
        product?.product_variants,     // 2. Supabase default key
        product?.variants,             // 3. Common alias
        product?.items                 // 4. Sometimes used in other setups
    ];

    // Find the first one that is a non-empty array
    const foundVariants = possibleVariants.find(v => Array.isArray(v) && v.length > 0) || [];

    // 🟢 FINAL DECISION: Is this a simple product?
    const isSimpleProduct = foundVariants.length === 0;

    // Stock Logic
    const totalStock = isSimpleProduct
        ? (product.stock || 0)
        : foundVariants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);

    const isOutOfStock = totalStock <= 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOutOfStock) return;

        // 🚨 CRITICAL CHECK: Logic Split
        if (!isSimpleProduct) {
            console.log("Variations detected. Opening Modal...");
            setIsModalOpen(true);
            return; // 🛑 THIS RETURN STOPS THE CART FROM OPENING. DO NOT REMOVE.
        }

        // --- Only runs if Simple Product ---
        console.log("No variants detected. Adding to cart directly...");
        setLoading(true);
        setTimeout(() => {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price_usd,
                image: product.main_image_url || product.image_url,
                quantity: 1,
            });
            toast.success("Added to cart");
            setLoading(false);
            openCart();
        }, 300);
    };

    if (isOutOfStock) {
        return (
            <button
                disabled
                className={cn(
                    "h-8 px-3 bg-slate-100 text-slate-400 rounded-full border border-slate-200 text-[10px] font-bold uppercase cursor-not-allowed",
                    className?.includes("static") ? "" : "absolute bottom-3 right-3"
                )}
            >
                Sold Out
            </button>
        );
    }

    return (
        <>
            <button
                onClick={handleAdd}
                className={cn(
                    "h-10 w-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-slate-100 relative",
                    className
                )}
                style={{ color: color }}
                disabled={loading}
            >

                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    isSimpleProduct ? <Plus className="w-5 h-5" /> : <ShoppingBag className="w-4 h-4" />
                )}
            </button>

            {isModalOpen && (
                isDesktop ? (
                    <DesktopProductDialog
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        product={product}
                        variants={foundVariants} // Use the discovered variants
                        color={color}
                    />
                ) : (
                    <MobileVariantDrawer
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        product={product}
                        variants={foundVariants} // Use the discovered variants
                        color={color}
                    />
                )
            )}
        </>
    );
}

// ----------------------------------------------------------------------
// 3. DESKTOP VIEW (Dialog) - Z-INDEX FIXED
// ----------------------------------------------------------------------
export function DesktopProductDialog({ isOpen, onClose, product, variants, color }: any) {
    const { addItem, openCart } = useCart();

    const safeVariants = Array.isArray(variants) ? variants : [];

    const handleVariantSelect = (variant: any) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price_usd,
            image: product.main_image_url,
            quantity: 1,
            variantId: variant.id,
            variantName: variant.name || [variant.size, variant.color].filter(Boolean).join(" / "),
            maxStock: variant.stock
        });
        toast.success("Added to cart");
        onClose();
        openCart();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* 🟢 z-[9999] ensures it sits on top of everything */}
            <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl bg-white gap-0 rounded-2xl outline-none z-[9999]">
                <div className="grid grid-cols-2 h-[500px]">
                    {/* LEFT: Image */}
                    <div className="relative bg-slate-50 h-full border-r border-slate-100">
                        {product.main_image_url ? (
                            <Image src={product.main_image_url} fill alt={product.name} className="object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-300">No Image</div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-slate-900">
                                Quick View
                            </span>
                        </div>
                    </div>

                    {/* RIGHT: Options */}
                    <div className="p-8 flex flex-col h-full overflow-y-auto">
                        <DialogHeader className="mb-6 text-left">
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">{product.name}</DialogTitle>
                            <p className="text-xl font-bold text-slate-500 mt-1">${product.price_usd}</p>
                            <DialogDescription className="sr-only">Select a variant</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mb-8">
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                                {product.description || "Select a variant below."}
                            </p>
                        </div>

                        <div className="mt-auto space-y-3">
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Option</p>
                            <div className="grid grid-cols-1 gap-2">
                                {safeVariants.length === 0 ? (
                                    <div className="text-sm text-slate-400 italic">No options available.</div>
                                ) : (
                                    safeVariants.map((variant: any) => {
                                        const isOOS = (variant.stock || 0) <= 0;
                                        return (
                                            <button
                                                key={variant.id}
                                                onClick={() => !isOOS && handleVariantSelect(variant)}
                                                disabled={isOOS}
                                                className={cn(
                                                    "flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all group",
                                                    isOOS ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed" : "bg-white border-slate-100 hover:border-black hover:shadow-md"
                                                )}
                                                style={!isOOS && color ? { borderColor: undefined } : {}}
                                            >
                                                <span className={cn("font-bold text-sm", isOOS ? "text-slate-400" : "text-slate-900")}>
                                                    {variant.name || [variant.size, variant.color].filter(Boolean).join(" / ")}
                                                </span>
                                                {isOOS ? (
                                                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Sold Out</span>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-black transition-colors">
                                                        <span>Add</span> <ArrowRight className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ----------------------------------------------------------------------
// 4. MOBILE VIEW (Drawer) - Z-INDEX FIXED
// ----------------------------------------------------------------------
export function MobileVariantDrawer({ isOpen, onClose, product, variants, color }: any) {
    const { addItem, openCart } = useCart();
    const safeVariants = Array.isArray(variants) ? variants : [];

    const handleVariantSelect = (variant: any) => {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price_usd,
            image: product.main_image_url,
            quantity: 1,
            variantId: variant.id,
            variantName: variant.name || [variant.size, variant.color].filter(Boolean).join(" / "),
            maxStock: variant.stock
        });
        toast.success("Added to cart");
        onClose();
        openCart();
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            {/* 🟢 z-[9999] ensures it sits on top of everything */}
            <SheetContent side="bottom" className="rounded-t-[25px] p-6 max-h-[85vh] overflow-y-auto z-[9999] outline-none border-t-0">
                <SheetHeader className="mb-6 text-left flex flex-row gap-5 space-y-0 items-start">
                    <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                        {product.main_image_url && <Image src={product.main_image_url} fill alt={product.name} className="object-cover" />}
                    </div>
                    <div className="pt-1">
                        <SheetTitle className="text-xl font-black leading-tight tracking-tight text-slate-900">{product.name}</SheetTitle>
                        <p className="text-lg font-bold text-slate-500 mt-1">${product.price_usd}</p>
                        <SheetDescription className="sr-only">Select a variant</SheetDescription>
                    </div>
                </SheetHeader>
                <div className="space-y-4 pb-8">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Option</p>
                    <div className="grid grid-cols-1 gap-3">
                        {safeVariants.map((variant: any) => {
                            const isOOS = (variant.stock || 0) <= 0;
                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => !isOOS && handleVariantSelect(variant)}
                                    disabled={isOOS}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all duration-200 group",
                                        isOOS ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed" : "bg-white border-slate-100 hover:border-black hover:shadow-md active:scale-[0.98]"
                                    )}
                                    style={!isOOS && color ? { borderColor: undefined } : {}}
                                >
                                    <div>
                                        <span className={cn("font-bold block text-base group-hover:text-black transition-colors", isOOS ? "text-slate-400" : "text-slate-700")}>
                                            {variant.name || [variant.size, variant.color].filter(Boolean).join(" / ")}
                                        </span>
                                        {isOOS ? (
                                            <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">Sold Out</span>
                                        ) : (
                                            <span className={cn("text-[10px] font-bold uppercase tracking-wide", variant.stock < 5 ? "text-orange-500" : "text-green-600")}>
                                                {variant.stock < 5 ? `Only ${variant.stock} left` : "In Stock"}
                                            </span>
                                        )}
                                    </div>
                                    {!isOOS && (
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-black transition-colors" style={color ? { backgroundColor: color } : {}}>
                                            <Plus className="w-5 h-5 text-white mix-blend-difference" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// ----------------------------------------------------------------------
// 5. HELPER HOOK (Hydration Safe)
// ----------------------------------------------------------------------
function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return mounted && matches;
}