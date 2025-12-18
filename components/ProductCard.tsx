import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";

export default function ProductCard({ product, slug }: { product: Product; slug: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-100 relative">
        {/* Image placeholder */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No Image
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-base">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="font-semibold">{formatCurrency(product.price, product.currency)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/store/${slug}/product/${product.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
