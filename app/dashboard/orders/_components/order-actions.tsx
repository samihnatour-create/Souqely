"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Check, Loader2 } from "lucide-react"; // Added Loader2
import Image from "next/image";
import { acceptOrder } from "@/lib/actions"; // 🟢 Ensure path matches your file
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OrderActions({ order }: { order: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAccept = async () => {
        if (loading) return;
        setLoading(true);

        try {
            // 1. Call Server Action
            const result = await acceptOrder(order.id);

            if (!result.success) {
                toast.error(result.error || "Failed to accept order");
                setLoading(false);
                return;
            }

            // 2. Success! Refresh UI
            toast.success("Order accepted!");
            router.refresh(); // Update the list immediately

            // 3. Prepare WhatsApp Message
            // 🟢 Clean the phone number (remove spaces, dashes, parentheses)
            const rawPhone = order.customer_phone || "";
            const cleanPhone = rawPhone.replace(/\D/g, '');

            // 🟢 Fallback for Lebanese numbers without country code
            const finalPhone = cleanPhone.startsWith("961")
                ? cleanPhone
                : `961${cleanPhone.startsWith("0") ? cleanPhone.slice(1) : cleanPhone}`;

            const message = `Hello ${order.customer_name || "Customer"}, your order #${order.id.slice(0, 5)} has been accepted and is being prepared! 📦`;
            const whatsappUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;

            // 4. Open WhatsApp
            window.open(whatsappUrl, '_blank');

        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* 1. Preview Screenshot (Only if URL exists) */}
            {order.payment_screenshot_url ? (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4 text-slate-600" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md p-0 overflow-hidden bg-black border-slate-800">
                        {/* Wrapper div for aspect ratio */}
                        <div className="relative w-full aspect-[9/16] bg-black">
                            <Image
                                src={order.payment_screenshot_url}
                                alt="Payment Proof"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="p-4 bg-white">
                            <p className="text-sm font-bold text-slate-900">Payment Receipt</p>
                            <p className="text-xs text-slate-500">Verify the transfer amount matches the total.</p>
                        </div>
                    </DialogContent>
                </Dialog>
            ) : (
                <div className="w-8" /> // Spacer to keep alignment
            )}

            {/* 2. Accept Action */}
            {order.status !== 'shipped' ? (
                <Button
                    size="sm"
                    onClick={handleAccept}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs font-bold transition-all"
                >
                    {loading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <>
                            <Check className="w-3 h-3 mr-1" /> Accept
                        </>
                    )}
                </Button>
            ) : (
                <div className="flex items-center text-green-600 text-xs font-bold border border-green-200 bg-green-50 px-2 py-1 rounded-md select-none">
                    <Check className="w-3 h-3 mr-1" /> Shipped
                </div>
            )}
        </div>
    );
}