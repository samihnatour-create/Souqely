"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Store, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StoreClientPageProps {
  store: Store;
  products: Product[];
}

export default function StoreClientPage({ store, products }: StoreClientPageProps) {
  const [currency, setCurrency] = useState<"USD" | "LBP">("USD");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg">
           <button
             onClick={() => setCurrency("USD")}
             className={px-3 py-1 text-sm rounded-md transition-all }
           >
             USD
           </button>
           <button
             onClick={() => setCurrency("LBP")}
             className={px-3 py-1 text-sm rounded-md transition-all }
           >
             LBP
           </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg">
          No products available in this store yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              slug={store.slug} 
              currency={currency}
              lbpRate={store.lbp_rate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
