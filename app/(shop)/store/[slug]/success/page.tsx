import { getPublicStoreBySlug } from "@/lib/actions";
import { CheckCircle2, Camera, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PaymentProofUpload from "@/components/store/payment-proof-upload";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  params,
  searchParams
}: {
  params: { slug: string },
  searchParams: { orderId: string, method?: string }
}) {
  const store = await getPublicStoreBySlug(params.slug);
  const method = searchParams.method || 'cod';

  const isWhish = method === 'whish';
  const isOmt = method === 'omt';
  const isDigital = isWhish || isOmt;

  const theme = {
    color: isWhish ? "#E31E24" : isOmt ? "#FFD200" : "#22c55e",
    textColor: isOmt ? "text-black" : "text-white",
    number: isWhish ? store.whish_number : isOmt ? store.omt_name : null,
    logo: isWhish ? "/whish-logo.jpg" : isOmt ? "/omt-logo.png" : null
  };

  // Helper to generate the correct subdomain URL
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
    (process.env.NODE_ENV === "development" ? "localhost:3000" : "souqely.com");
  const storeUrl = `${protocol}://${params.slug}.${domain}`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div
        className="max-w-lg w-full bg-white rounded-[2.5rem] border-t-[12px] p-8 shadow-2xl text-center"
        style={{ borderTopColor: theme.color }}
      >

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          {isDigital ? (
            <div className="relative w-32 h-16">
              {theme.logo && (
                <Image src={theme.logo} alt={method} fill className="object-contain" />
              )}
            </div>
          ) : (
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-black uppercase mb-4 tracking-tight">
          {isDigital ? "Transfer Required" : "Order Confirmed!"}
        </h1>

        {/* CONTENT */}
        {isDigital ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-slate-500 font-medium">
              Please transfer the total to the merchant's
              <span className="font-bold uppercase ml-1" style={{ color: theme.color }}>{method}</span> number:
            </p>

            <div
              className={`py-5 rounded-2xl text-2xl font-mono font-black tracking-widest shadow-sm border border-slate-100 ${theme.textColor}`}
              style={{ backgroundColor: theme.color }}
            >
              {theme.number || "No Number Set"}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-left">
              <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold">
                <Camera className="w-5 h-5" />
                <h3>Upload Payment Receipt</h3>
              </div>

              {/* Updated Component with Store Slug */}
              <PaymentProofUpload
                orderId={searchParams.orderId}
                color={theme.color}
                storeSlug={params.slug}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-slate-500">
              Thank you for shopping with <span className="font-bold text-slate-900">{store.name}</span>.
              Your order is being prepared and will be delivered via Cash on Delivery.
            </p>

            {/* FIXED COD BUTTON */}
            <Link href={storeUrl} className="block">
              <Button className="w-full h-12 font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                <Store className="w-4 h-4 mr-2" /> Back to Store
              </Button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}