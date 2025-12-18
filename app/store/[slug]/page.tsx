import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

// Dummy data for now
const products: Product[] = [
  {
    id: "1",
    store_id: "1",
    name: "Classic T-Shirt",
    description: "A comfortable cotton t-shirt.",
    price: 15.00,
    currency: "USD",
    stock_quantity: 100,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    store_id: "1",
    name: "Denim Jeans",
    description: "High quality denim jeans.",
    price: 45.00,
    currency: "USD",
    stock_quantity: 50,
    active: true,
    created_at: new Date().toISOString(),
  },
];

export default function StorePage({ params }: { params: { slug: string } }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} slug={params.slug} />
      ))}
    </div>
  );
}
