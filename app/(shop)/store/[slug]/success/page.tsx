import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Order Received!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Thank you for your order. We will contact you shortly to confirm delivery.
      </p>
      <Link href={`/store/${params.slug}`}>
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}
