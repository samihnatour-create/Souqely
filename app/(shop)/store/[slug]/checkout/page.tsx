"use client";

import { useCart } from "@/lib/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createOrder, getPublicStoreBySlug } from "@/lib/actions"; // Added store fetch
import { useRouter } from "next/navigation";
import { Check, Banknote, Loader2 } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  const { items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'omt' | 'whish'>('cod');
  const router = useRouter();

  // 1. Fetch Store Settings to check for enabled payment methods
  useEffect(() => {
    async function loadStore() {
      const data = await getPublicStoreBySlug(params.slug);
      setStore(data);
    }
    loadStore();
  }, [params.slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customer_name: formData.get("name"),
      customer_phone: formData.get("phone"),
      customer_address: formData.get("address"),
      items: items,
      total: cartTotal,
      store_slug: params.slug,
      payment_method: paymentMethod
    };

    const result = await createOrder(orderData);

    if (result.success && result.data?.[0]?.id) {
      const newOrderId = result.data[0].id;

      clearCart();
      toast.success("Order confirmed!");

      // Use a relative path. Middleware handles the 'subdomain -> /store/[slug]' logic.
      router.push(`/success?orderId=${newOrderId}&method=${paymentMethod}`);
    } else {
      // If result.success is false, this is why 'nothing happens'
      console.error("Order Failed:", result.error);
      toast.error(result.error || "Check your internet connection");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-16">

      {/* --- LEFT: SHIPPING & PAYMENT --- */}
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Checkout</h1>
          <p className="text-slate-500 text-sm">Confirm your order details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Delivery */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">1. Delivery Info</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">Full Name</Label>
                <Input name="name" required placeholder="John Doe" className="h-12 border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">Phone Number</Label>
                <Input name="phone" required placeholder="70 123 456" className="h-12 border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">Delivery Address</Label>
                <Input name="address" required placeholder="Beirut, St..." className="h-12 border-slate-200" />
              </div>
            </div>
          </div>

          {/* Section 2: Conditional Payment Method Selector */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">2. Payment Method</h3>
            <div className="grid gap-3">

              {/* COD - Always Visible */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${paymentMethod === 'cod' ? 'border-slate-900 bg-slate-50' : 'border-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm">Cash on Delivery</span>
                </div>
                {paymentMethod === 'cod' && <Check className="w-5 h-5 text-slate-900" />}
              </button>

              {/* OMT Pay - Only if Merchant enabled it */}
              {store?.is_omt_enabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('omt')}
                  className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${paymentMethod === 'omt' ? 'border-[#FFD200] bg-[#FFD200]/5' : 'border-slate-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-8">
                      <Image src="/omt-logo.png" alt="OMT Pay" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-sm">Pay via OMT Pay</span>
                  </div>
                  {paymentMethod === 'omt' && <Check className="w-5 h-5 text-slate-900" />}
                </button>
              )}

              {/* Whish Pay - Only if Merchant enabled it */}
              {store?.is_whish_enabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('whish')}
                  className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${paymentMethod === 'whish' ? 'border-[#E31E24] bg-[#E31E24]/5' : 'border-slate-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-8">
                      <Image src="/whish-logo.jpg" alt="Whish Pay" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-sm">Pay via Whish Pay</span>
                  </div>
                  {paymentMethod === 'whish' && <Check className="w-5 h-5 text-slate-900" />}
                </button>
              )}

            </div>
          </div>

          <div className="pt-6">
            <Button disabled={loading} className={`w-full h-14 text-lg font-bold shadow-xl border-none transition-transform active:scale-[0.98] ${paymentMethod === 'cod' ? 'bg-green-600 hover:bg-green-700 text-white' :
              paymentMethod === 'omt' ? 'bg-[#FFD200] text-black hover:bg-[#e6bd00]' :
                'bg-[#E31E24] text-white hover:bg-[#c2191f]'
              }`}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              {paymentMethod === 'cod' ? `Confirm Order ($${cartTotal})` : `Proceed to Payment ($${cartTotal})`}
            </Button>
            <p className="text-[10px] text-center mt-4 text-slate-400 font-medium uppercase tracking-widest">
              {paymentMethod === 'cod' ? "Payment on delivery" : `Instructions for ${paymentMethod.toUpperCase()} will follow`}
            </p>
          </div>
        </form>
      </div>

      {/* --- RIGHT: ORDER SUMMARY --- */}
      <div className="h-fit">
        <div className="bg-slate-50 rounded-3xl p-8 sticky top-24">
          <h2 className="text-lg font-bold uppercase tracking-wide mb-6">Summary</h2>
          <div className="space-y-4 max-h-[300px] overflow-auto mb-6 pr-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold">
                    {item.quantity}
                  </div>
                  <span className="text-sm font-bold text-slate-700 line-clamp-1">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between items-end pt-4">
              <span className="font-black text-xl italic">TOTAL</span>
              <span className="font-black text-4xl tracking-tighter">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}