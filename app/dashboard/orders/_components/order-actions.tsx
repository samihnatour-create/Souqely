"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Check, MessageCircle } from "lucide-react";
import Image from "next/image";
import { acceptOrder } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OrderActions({ order }: { order: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAccept = async () => {
        setLoading(true);
        // Call server action to update status to 'shipped'
        const result = await acceptOrder(order.id);
        setLoading(false);

        if (result.success) {
            toast.success("Order accepted!");
            router.refresh();

            // Open WhatsApp automatically after accepting
            const message = `Hello ${order.customer_name}, your order #${order.id.slice(0, 8)} has been accepted and is being prepared! 📦`;
            const whatsappUrl = `https://wa.me/${order.customer_phone}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

        } else {
            toast.error("Error: " + result.error);
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
                        <div className="relative aspect-[9/16] w-full">
                            <Image
                                src={order.payment_screenshot_url}
                                alt="Payment Proof"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="p-4 bg-white">
                            <p className="text-sm font-bold">Payment Receipt</p>
                            <p className="text-xs text-slate-500">Verify the transfer amount matches the total.</p>
                        </div>
                    </DialogContent>
                </Dialog>
            ) : (
                <div className="w-8" /> // Spacer if no image
            )}

            {/* 2. Accept Action */}
            {order.status !== 'shipped' ? (
                <Button
                    size="sm"
                    onClick={handleAccept}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs"
                >
                    {loading ? "..." : <><Check className="w-3 h-3 mr-1" /> Accept</>}
                </Button>
            ) : (
                <div className="flex items-center text-green-600 text-xs font-bold border border-green-200 bg-green-50 px-2 py-1 rounded-md">
                    <Check className="w-3 h-3 mr-1" /> Shipped
                </div>
            )}
        </div>
    );
}