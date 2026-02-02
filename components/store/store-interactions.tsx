"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/context/cart-context";
import { ShoppingBag, Loader2, Plus, X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

// UI Components
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
// 2. QUICK ADD BUTTON (With Responsive Modal Logic)
// ----------------------------------------------------------------------
export function QuickAddButton({
    product,
    color,
    variants,
    className
}: {
    product: any;
    color: string;
    variants: any[];
    className?: string; // <--- Added this type definition
}) {
    const { addItem, openCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 🟢 STOCK LOGIC
    const isSimpleProduct = !variants || variants.length === 0;
    const totalStock = isSimpleProduct
        ? (product.stock || 0)
        : variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);

    const isOutOfStock = totalStock <= 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 1. If Variants Exist -> Open Responsive Modal
        if (variants && variants.length > 0) {
            setIsModalOpen(true);
            return;
        }

        // 2. If Simple Product -> Direct Add
        setLoading(true);
        setTimeout(() => {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price_usd,
                image: product.main_image_url || product.image_url,
                quantity: 1,
                maxStock: product.stock
            });
            toast.success("Added to cart");
            setLoading(false);
            openCart();
        }, 500);
    };

    // 🔴 STATE: OUT OF STOCK
    if (isOutOfStock) {
        return (
            <button
                disabled
                className="absolute bottom-3 right-3 h-8 px-3 md:h-10 md:px-4 bg-slate-100 text-slate-400 rounded-full border border-slate-200 shadow-sm text-[10px] font-bold uppercase tracking-wide cursor-not-allowed z-20"
            >
                Sold Out
            </button>
        );
    }

    // 🟢 STATE: AVAILABLE
    return (
        <>
            <button
                onClick={handleAdd}
                // FIXED: Simplified visibility. 
                // Mobile: Always visible. 
                // Desktop: Always visible (to avoid confusion) but scales up on hover.
                className={cn(
                    "h-10 w-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-slate-100",
                    className)}
                style={{ color: color }}
                disabled={loading}
                aria-label="Add to cart"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
            </button>

            {/* RESPONSIVE MODAL */}
            <ResponsiveProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
                variants={variants || []}
                color={color}
            />
        </>
    );
}

// ----------------------------------------------------------------------
// 3. RESPONSIVE PRODUCT MODAL (The Logic Engine)
// ----------------------------------------------------------------------
function ResponsiveProductModal(props: any) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return <DesktopProductDialog {...props} />;
    }
    return <MobileVariantDrawer {...props} />;
}

// ----------------------------------------------------------------------
// 4. DESKTOP VIEW (Mini Product Page)
// ----------------------------------------------------------------------
function DesktopProductDialog({ isOpen, onClose, product, variants, color }: any) {
    const { addItem, openCart } = useCart();

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
            <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl bg-white gap-0 rounded-2xl">
                <div className="grid grid-cols-2 h-[500px]">

                    {/* LEFT: Big Image Area */}
                    <div className="relative bg-slate-50 h-full border-r border-slate-100">
                        {product.main_image_url ? (
                            <Image src={product.main_image_url} fill alt={product.name} className="object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-300">No Image</div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                Quick View
                            </span>
                        </div>
                    </div>

                    {/* RIGHT: Details & Options */}
                    <div className="p-8 flex flex-col h-full overflow-y-auto">
                        <DialogHeader className="mb-6 text-left">
                            <DialogTitle className="text-2xl font-black tracking-tight">{product.name}</DialogTitle>
                            <p className="text-xl font-medium text-slate-500 mt-1">${product.price_usd}</p>
                        </DialogHeader>

                        <div className="space-y-4 mb-8">
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {product.description || "Select a variant below to add this item to your cart."}
                            </p>
                        </div>

                        <div className="mt-auto space-y-3">
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Option</p>
                            <div className="grid grid-cols-1 gap-2">
                                {variants.map((variant: any) => {
                                    const isOOS = (variant.stock || 0) <= 0;
                                    return (
                                        <button
                                            key={variant.id}
                                            onClick={() => !isOOS && handleVariantSelect(variant)}
                                            disabled={isOOS}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-xl border text-left transition-all group",
                                                isOOS
                                                    ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                                                    : "bg-white border-slate-200 hover:border-black hover:shadow-md"
                                            )}
                                        >
                                            <span className={cn("font-bold text-sm", isOOS ? "text-slate-400" : "text-slate-900")}>
                                                {variant.name || [variant.size, variant.color].filter(Boolean).join(" / ")}
                                            </span>

                                            {isOOS ? (
                                                <span className="text-[10px] text-red-500 font-bold uppercase">Sold Out</span>
                                            ) : (
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 group-hover:text-black">
                                                    <span>Add</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ----------------------------------------------------------------------
// 5. MOBILE VIEW (Bottom Sheet)
// ----------------------------------------------------------------------
function MobileVariantDrawer({ isOpen, onClose, product, variants, color }: any) {
    const { addItem, openCart } = useCart();

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
            <SheetContent side="bottom" className="rounded-t-[20px] p-6 max-h-[85vh] overflow-y-auto z-[100]">
                <SheetHeader className="mb-6 text-left flex flex-row gap-4 space-y-0">
                    <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        {product.main_image_url && (
                            <Image src={product.main_image_url} fill alt={product.name} className="object-cover" />
                        )}
                    </div>
                    <div>
                        <SheetTitle className="text-lg font-bold leading-tight">{product.name}</SheetTitle>
                        <p className="text-slate-500 font-medium mt-1">${product.price_usd}</p>
                    </div>
                </SheetHeader>

                <div className="space-y-4 pb-10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Option</p>
                    <div className="grid grid-cols-1 gap-2">
                        {variants.map((variant: any) => {
                            const isOOS = (variant.stock || 0) <= 0;
                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => !isOOS && handleVariantSelect(variant)}
                                    disabled={isOOS}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                                        isOOS
                                            ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                                            : "bg-white border-slate-200 hover:border-black/20 hover:shadow-sm active:scale-[0.98]"
                                    )}
                                >
                                    <div>
                                        <span className={cn("font-bold block text-sm", isOOS ? "text-slate-400" : "text-slate-900")}>
                                            {variant.name || [variant.size, variant.color].filter(Boolean).join(" / ")}
                                        </span>
                                        {isOOS ? (
                                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Sold Out</span>
                                        ) : (
                                            <span className="text-[10px] text-green-600 font-medium">
                                                {variant.stock < 5 ? `Only ${variant.stock} left` : "In Stock"}
                                            </span>
                                        )}
                                    </div>
                                    {!isOOS && (
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100">
                                            <Plus className="w-4 h-4" style={{ color: color }} />
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
// 6. HELPER HOOK (Media Query)
// ----------------------------------------------------------------------
function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
}