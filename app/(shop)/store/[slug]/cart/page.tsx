"use client";

import { useCart } from "@/lib/context/cart-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage({ params }: { params: { slug: string } }) {
  const { items, removeItem, updateQuantity, cartTotal } = useCart();

  // 1. Empty State
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
          <p className="text-slate-500">Looks like you haven't added anything yet.</p>
        </div>
        <Link href={`/store/${params.slug}`}>
          <Button size="lg" className="font-bold">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  // 2. Active Cart UI
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-12">Shopping Cart ({items.length})</h1>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* LEFT: Cart Items List */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 md:gap-6 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">

              {/* Image */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">${item.price}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-black disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-slate-600 hover:text-black"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="ml-auto font-bold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:w-[400px] shrink-0">
          <div className="bg-slate-50 rounded-2xl p-8 sticky top-24">
            <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Order Summary</h2>

            <div className="space-y-4 border-b border-slate-200 pb-6 mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">CALCULATED AT CHECKOUT</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="font-bold text-lg">Total</span>
              <span className="font-black text-3xl tracking-tight">${cartTotal.toFixed(2)}</span>
            </div>

            <Link href={`/store/${params.slug}/checkout`} className="w-full">
              <Button size="lg" className="w-full h-14 text-base font-bold shadow-xl hover:scale-[1.02] transition-transform">
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> Secure Checkout
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple Icon for the summary
function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}