export const dynamic = "force-dynamic";
import { getStoreSettings, getStoreProducts, getUniqueCategories } from "@/lib/actions";
import ProductFilter from "@/components/dashboard/ProductFilter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Tag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  // 1. Fetch the Store Data
  const store = await getStoreSettings();
  if (!store) {
    redirect("/dashboard"); // Redirect if they don't have a store yet
  }

  // 2. Fetch Products & Categories in Parallel (Faster)
  const [products, categories] = await Promise.all([
    getStoreProducts(store.id, searchParams.category),
    getUniqueCategories(store.id)
  ]);

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your store inventory and categories.
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button size="sm" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            <span className="whitespace-nowrap">Add Product</span>
          </Button>
        </Link>
      </div>

      {/* FILTER SECTION (The Wiring) */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <Tag className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
        {/* Pass the dynamic categories to your component */}
        <ProductFilter categories={categories} />
      </div>

      {/* PRODUCTS GRID */}
      {products.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Products Found</CardTitle>
            <CardDescription>
              {searchParams.category
                ? `No products found in the "${searchParams.category}" category.`
                : "You haven't added any products yet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/products/new">
              <Button variant="outline">Create your first product</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {/* Image Placeholder (or Real Image if you have it) */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
                {product.main_image_url ? (
                  <img src={product.main_image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">No Image</span>
                )}
              </div>

              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold truncate pr-2">
                    {product.name}
                  </CardTitle>
                  <span className="font-mono text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                    ${product.price_usd}
                  </span>
                </div>
                <CardDescription className="text-xs flex items-center gap-1">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide">
                    {product.category || "Uncategorized"}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-2">
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                  {product.description || "No description provided."}
                </p>

                <Link href={`/dashboard/products/${product.id}/edit`}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Edit className="h-3 w-3" /> Edit Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}