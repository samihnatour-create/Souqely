import { getStoreSettings } from "@/lib/actions";
import { createClient } from "@/lib/supabase-server"; // Use Server Client
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Edit, AlertCircle } from "lucide-react"; // Added Icons
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const store = await getStoreSettings();
  if (!store) return <div>Store not found</div>;

  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your inventory and prices.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      {!products?.length ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <p className="text-muted-foreground mb-4">You haven't added any products yet.</p>
          <Link href="/dashboard/products/new">
            <Button variant="outline">Create your first product</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            // Logic for Stock Color
            const stock = product.stock || 0;
            const isOutOfStock = stock === 0;
            const isLowStock = stock > 0 && stock < 10;

            return (
              <Card key={product.id} className="overflow-hidden flex flex-col group hover:shadow-lg transition-all">

                {/* IMAGE AREA */}
                <div className="relative aspect-square bg-slate-100">
                  {product.main_image_url ? (
                    <Image
                      src={product.main_image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                      <Package className="w-10 h-10" />
                    </div>
                  )}

                  {/* STATUS BADGE (Top Left) */}
                  <div className="absolute top-2 left-2">
                    {product.active ? (
                      <Badge className="bg-white/90 text-black hover:bg-white shadow-sm">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-200/90 text-slate-600">Draft</Badge>
                    )}
                  </div>

                  {/* 📦 STOCK BADGE (Top Right) - NEW */}
                  <div className="absolute top-2 right-2">
                    <Badge className={`
                        shadow-sm border-0
                        ${isOutOfStock ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                        ${isLowStock ? 'bg-orange-400 hover:bg-orange-500 text-white' : ''}
                        ${!isLowStock && !isOutOfStock ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                     `}>
                      {isOutOfStock ? "Out of Stock" : `${stock} in stock`}
                    </Badge>
                  </div>
                </div>

                {/* CONTENT AREA */}
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-base font-bold line-clamp-1" title={product.name}>
                      {product.name}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-grow">
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-black">${product.price_usd}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatCurrency(product.price_usd * (store.lbp_rate || 89500), "LBP")})
                    </span>
                  </div>
                </CardContent>

                {/* FOOTER ACTIONS */}
                <CardFooter className="p-4 pt-0 border-t bg-slate-50/50 mt-auto">
                  <Link href={`/dashboard/products/${product.id}`} className="w-full mt-4">
                    <Button variant="outline" className="w-full bg-white hover:bg-slate-100">
                      <Edit className="w-4 h-4 mr-2 text-slate-500" />
                      Edit Product
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}