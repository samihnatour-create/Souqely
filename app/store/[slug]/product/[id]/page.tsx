import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";

// Dummy data
const product: Product = {
  id: "1",
  store_id: "1",
  name: "Classic T-Shirt",
  description: "A comfortable cotton t-shirt.",
  price: 15.00,
  currency: "USD",
  stock_quantity: 100,
  active: true,
  created_at: new Date().toISOString(),
};

export default function ProductDetailsPage({ params }: { params: { slug: string; id: string } }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        No Image
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold">{formatCurrency(product.price, product.currency)}</p>
        <p className="text-muted-foreground">{product.description}</p>
        <div className="mt-4">
          <Button size="lg" className="w-full md:w-auto">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
