import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  slug: string;
  currency?: "USD" | "LBP";
  lbpRate?: number;
}

export default function ProductCard({ product, slug, currency = "USD", lbpRate = 89500 }: ProductCardProps) {

  const price = currency === "USD"
    ? product.price_usd
    : product.price_usd * lbpRate;

  return (
    <Card className="overflow-hidden flex flex-col h-full group">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.main_image_url ? (
          <img
            src={product.main_image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-1 text-base leading-tight" title={product.name}>
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <p className="font-bold text-lg text-primary">
          {formatCurrency(price, currency)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/store/${slug}/product/${product.id}`} className="w-full">
          <Button className="w-full" size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
