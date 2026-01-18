import { getPublicStoreBySlug, getPublicProducts } from "@/lib/actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

// 1. Force dynamic rendering so products are always fresh
export const dynamic = "force-dynamic";

export default async function StoreFrontPage({ params }: { params: { slug: string } }) {

  // 2. Fetch Store by Slug
  const store = await getPublicStoreBySlug(params.slug);

  // 3. If store doesn't exist, show 404
  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Store Not Found</h1>
        <p className="text-gray-500">The store you are looking for does not exist or has been moved.</p>
      </div>
    );
  }

  // 4. Fetch Products for this store
  const products = await getPublicProducts(store.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Store Avatar / Initial */}
            <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              {store.name.slice(0, 1).toUpperCase()}
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">{store.name}</h1>
          </div>

          <Button variant="outline" className="relative gap-2 rounded-full border-slate-200 hover:bg-slate-50">
            <ShoppingBag className="h-4 w-4 text-slate-700" />
            <span className="hidden sm:inline font-medium">Cart</span>
            <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-[1.25rem] px-1 rounded-full flex items-center justify-center bg-blue-600 text-white text-[10px]">
              0
            </Badge>
          </Button>
        </div>
      </header>

      {/* HERO BANNER */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Welcome to {store.name}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Browse our exclusive collection. Quality products delivered to your door in Lebanon.
          </p>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main className="container mx-auto px-4 py-12 flex-1">
        {products.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground bg-white rounded-2xl border border-dashed border-slate-300">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900">No products available</h3>
            <p className="text-sm text-slate-500">This store hasn't added any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-xl">

                {/* Image */}
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  {product.main_image_url ? (
                    <img
                      src={product.main_image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-50 text-slate-300">
                      <ShoppingBag className="h-12 w-12 opacity-20" />
                    </div>
                  )}

                  {/* Optional: "New" Badge example */}
                  {/* <Badge className="absolute top-3 left-3 bg-white/90 text-black hover:bg-white">New</Badge> */}
                </div>

                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg leading-tight truncate text-slate-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 h-10 leading-relaxed">
                    {product.description || "No description provided."}
                  </p>
                </CardContent>

                <CardFooter className="p-5 pt-0 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium uppercase">Price</span>
                    <span className="font-bold text-xl text-slate-900">
                      ${product.price_usd?.toFixed(2)}
                    </span>
                  </div>
                  <Button size="sm" className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-lg text-slate-900 mb-2">{store.name}</p>
          <p className="text-sm text-slate-500 mb-8">
            Trusted seller. Shipping all across Lebanon.
          </p>
          <div className="text-xs text-slate-400 pt-8 border-t border-slate-100">
            Powered by <span className="font-semibold text-blue-600">Souqely</span>
          </div>
        </div>
      </footer>

    </div>
  );
}