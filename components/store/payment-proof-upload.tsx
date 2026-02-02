"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Loader2, CheckCircle2, UploadCloud, Store } from "lucide-react"; // Added Store icon
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { Button } from "@/components/ui/button"; // Import Button

// Add storeSlug to props
export default function PaymentProofUpload({
    orderId,
    color,
    storeSlug
}: {
    orderId: string,
    color: string,
    storeSlug: string
}) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    // Helper to get the store URL
    const getStoreUrl = () => {
        const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
            (process.env.NODE_ENV === "development" ? "localhost:3000" : "souqely.com");

        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        return `${protocol}://${storeSlug}.${domain}`;
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        await handleUpload(file);
    };

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `${orderId}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('payment-receipts')
                .upload(fileName, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw new Error(uploadError.message);

            const { data: { publicUrl } } = supabase.storage
                .from('payment-receipts')
                .getPublicUrl(fileName);

            const { error: rpcError } = await supabase.rpc('update_order_proof', {
                target_order_id: orderId,
                new_screenshot_url: publicUrl
            });

            if (rpcError) throw new Error(rpcError.message);

            setSuccess(true);
            toast.success("Receipt sent!");
            router.refresh();

        } catch (error: any) {
            console.error(error);
            toast.error("Upload failed");
            setPreviewUrl(null);
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center gap-3 text-green-800">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                    <div className="text-center">
                        <p className="font-bold">Receipt Received!</p>
                        <p className="text-sm">We are verifying your payment.</p>
                    </div>
                    {previewUrl && (
                        <div className="relative w-full h-32 mt-2 rounded-lg overflow-hidden border border-green-200 shadow-sm">
                            <Image src={previewUrl} alt="Receipt Preview" fill className="object-cover" />
                        </div>
                    )}
                </div>

                {/* NEW: Back to Store Button */}
                <Link href={getStoreUrl()} className="block">
                    <Button className="w-full font-bold h-12 rounded-xl" style={{ backgroundColor: color }}>
                        <Store className="w-4 h-4 mr-2" /> Back to Store
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <input
                type="file"
                id="proof-upload"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
            />
            <label htmlFor="proof-upload" className="w-full block">
                {previewUrl && uploading ? (
                    <div className="w-full h-48 relative rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50">
                        <Image src={previewUrl} alt="Uploading..." fill className="object-contain opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
                        </div>
                    </div>
                ) : (
                    <div
                        className={`w-full h-14 flex items-center justify-center gap-2 rounded-xl text-white font-bold cursor-pointer hover:opacity-90 transition-all shadow-md active:scale-95`}
                        style={{ backgroundColor: color }}
                    >
                        <UploadCloud className="w-5 h-5" />
                        <span>{uploading ? "Uploading..." : "Select Screenshot"}</span>
                    </div>
                )}
            </label>
        </div>
    );
}