"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/context/cart-context";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface CartSheetProps {
    trigger: React.ReactNode; // The button that opens this cart
    slug: string;             // For checkout link
    color: string;            // Store Primary Color
    radius: string;           // Store Button Radius
}

export function CartSheet({ trigger, slug, color, radius }: CartSheetProps) {
    const { items, removeItem, updateQuantity, cartTotal } = useCart();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>

            {/* We apply a class to ensure the sheet has a high z-index and white background.
         We don't rely on global CSS variables here because Portals can break them.
      */}
            <SheetContent className="w-full sm:max-w-md flex flex-col bg-white p-0 border-l border-slate-100 shadow-2xl">

                {/* HEADER */}
                <SheetHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                    <SheetTitle className="text-lg font-black uppercase tracking-tight">
                        My Cart ({items.length})
                    </SheetTitle>
                    {/* Close button is handled automatically by Sheet, but we can add a custom one if needed */}
                </SheetHeader>

                {/* BODY (Scrollable Items) */}
                <ScrollArea className="flex-1 px-6">
                    {items.length === 0 ? (
                        <div className="h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium">Your cart is empty</p>
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="mt-2 border-slate-200"
                                style={{ borderRadius: radius }}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 py-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    {/* Image */}
                                    <div className="relative w-20 h-20 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <ShoppingBag className="w-6 h-6 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-slate-900 line-clamp-2 pr-2 leading-tight">
                                                {item.name}
                                            </h4>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-sm font-bold text-slate-500">${item.price}</p>

                                            {/* QTY Controls */}
                                            <div className="flex items-center bg-slate-50 rounded-md border border-slate-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-l-md transition-colors disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-r-md transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* FOOTER (Checkout) */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Subtotal</span>
                            <span className="font-black text-lg">${cartTotal.toFixed(2)}</span>
                        </div>

                        <Link href={`/checkout`} onClick={() => setOpen(false)} className="block">
                            <Button
                                className="w-full h-12 text-base font-bold shadow-xl hover:brightness-110 hover:scale-[1.02] transition-all active:scale-[0.98]"
                                style={{ backgroundColor: color, borderRadius: radius }}
                            >
                                Checkout <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}