import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoreHeader({ storeName, slug }: { storeName: string; slug: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/store/${slug}`} className="font-bold text-xl">
          {storeName}
        </Link>
        <Link href={`/store/${slug}/cart`}>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
