import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        Your cart is empty.
      </div>
      <div className="flex justify-end">
        <Link href={`/store/${params.slug}/checkout`}>
          <Button>Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
