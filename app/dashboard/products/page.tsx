import { getStoreSettings } from "@/lib/actions";
import { createClient } from "@/lib/supabase-server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Edit, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { FilterBarWrapper } from "@/components/shared/FilterBarWrapper";
import BulkProductUpload from "@/components/admin/BulkProductUpload";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; stock?: string; view?: string };
}) {
  const store = await getStoreSettings();
  if (!store) return <div>Store not found</div>;

  const supabase = createClient();

  // 1. FETCH PRODUCTS (Your original logic)
  const { data: products } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  if (!products) return <div>Failed to load products</div>;

  // 2. EXTRACT CATEGORIES (For the Filter Dropdown)
  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  // 3. FILTERING LOGIC
  const query = searchParams.q?.toLowerCase() || "";
  const catFilter = searchParams.category || "all";
  const stockFilter = searchParams.stock || "all";
  const view = searchParams.view || "grid"; // Default to Grid

  const filteredProducts = products.filter((product) => {
    // Search
    const matchesSearch = product.name.toLowerCase().includes(query);
    // Category
    const matchesCategory = catFilter === "all" ? true : product.category === catFilter;
    // Stock
    const hasVariants = product.product_variants && product.product_variants.length > 0;
    const totalStock = hasVariants
      ? product.product_variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0)
      : (product.stock || 0);

    let matchesStock = true;
    if (stockFilter === "in_stock") matchesStock = totalStock > 0;
    if (stockFilter === "out_of_stock") matchesStock = totalStock <= 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    // 🟢 OPTIMIZATION: Reduced padding for mobile
    <div className="flex flex-col gap-6 p-3 md:p-8 pt-6 bg-slate-50/50 min-h-screen overflow-x-hidden">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 font-jakarta">Products</h1>
          <p className="text-sm text-slate-500">Manage your inventory.</p>
        </div>

        {/* 🟢 ACTION BUTTONS CONTAINER */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

          {/* 1. Bulk Import Button */}
          <BulkProductUpload />

          {/* 2. Add Product Button */}
          <Link href="/dashboard/products/new" className="w-full md:w-auto">
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 md:h-11 rounded-xl shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* 🟢 FILTER BAR ADDITION */}
      <FilterBarWrapper type="products" categories={uniqueCategories} />

      {/* EMPTY STATE (Dynamic based on search results) */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {products.length === 0 ? "No products yet" : "No results found"}
          </h3>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto">
            {products.length === 0
              ? "Add your first product to start selling on your storefront."
              : "Try adjusting your filters or search terms."}
          </p>
          {products.length === 0 ? (
            <Link href="/dashboard/products/new">
              <Button variant="outline" className="border-slate-300 text-slate-700 font-bold">
                Create your first product
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/products">
              <Button variant="link" className="text-blue-600 font-bold">Clear Filters</Button>
            </Link>
          )}
        </div>
      ) : (
        // 🟢 VIEW TOGGLE CONTAINER
        <div className={
          view === 'list'
            ? "flex flex-col gap-3"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
        }>
          {filteredProducts.map((product) => {

            // STOCK LOGIC (Your original calculation)
            const hasVariants = product.product_variants && product.product_variants.length > 0;
            const totalStock = hasVariants
              ? product.product_variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0)
              : (product.stock || 0);

            const isOutOfStock = totalStock <= 0;
            const isLowStock = totalStock > 0 && totalStock < 10;

            // 🟢 LIST VIEW CARD (New Horizontal Layout)
            if (view === 'list') {
              return (
                <Card key={product.id} className="flex flex-row items-center p-3 gap-3 md:gap-4 border-none shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-all">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    {product.main_image_url ? (
                      <Image src={product.main_image_url} alt={product.name} fill className="object-cover" />
                    ) : <Package className="w-6 h-6 m-auto text-slate-300 relative top-1/2 -translate-y-1/2" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate text-sm md:text-base">{product.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="uppercase font-bold tracking-wider text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{product.category || "General"}</span>
                      <span className={isLowStock ? "text-orange-600 font-bold" : (isOutOfStock ? "text-red-600 font-bold" : "")}>
                        {totalStock} in stock
                      </span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className="font-black text-slate-900 text-sm md:text-lg">
                      ${product.price_usd}
                    </span>
                    <Link href={`/dashboard/products/${product.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            }

            // 🟢 GRID VIEW CARD (Your Original Vertical Layout)
            return (
              <Card key={product.id} className="overflow-hidden flex flex-col group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-xl md:rounded-2xl">

                {/* IMAGE AREA */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  {product.main_image_url ? (
                    <Image
                      src={product.main_image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300">
                      <Package className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                  )}

                  {/* COMPACT BADGES for Mobile */}
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1">
                    {product.active ? null : (
                      <Badge variant="secondary" className="bg-slate-200/90 text-slate-600 font-bold backdrop-blur-sm text-[10px] h-5 px-1.5 md:text-xs md:h-6 md:px-2.5">
                        Draft
                      </Badge>
                    )}

                    {(isOutOfStock || isLowStock) && (
                      <Badge className={`
                            shadow-sm border-0 font-bold backdrop-blur-sm text-[10px] h-5 px-1.5 md:text-xs md:h-6 md:px-2.5
                            ${isOutOfStock ? 'bg-red-500/90 text-white' : 'bg-orange-500/90 text-white'}
                          `}>
                        {isOutOfStock ? "Out" : "Low"}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* CONTENT AREA - COMPACT */}
                <CardHeader className="p-3 pb-1 md:p-4 md:pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-sm md:text-base font-bold line-clamp-2 text-slate-900 leading-tight" title={product.name}>
                      {product.name}
                    </CardTitle>
                  </div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">
                    {product.category || "General"}
                  </p>
                </CardHeader>

                <CardContent className="p-3 pt-0 md:p-4 md:pt-0 flex-grow flex flex-col">
                  {/* Price */}
                  <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2 mt-1 mb-2">
                    <span className="text-base md:text-xl font-black text-slate-900">${product.price_usd}</span>
                    <span className="text-[10px] md:text-xs text-slate-500 font-medium truncate">
                      {formatCurrency(product.price_usd * (store.lbp_rate || 89500), "LBP")}
                    </span>
                  </div>

                  {/* VARIANTS - Simplified for Mobile */}
                  {hasVariants && (
                    <div className="mt-auto bg-slate-50 p-2 md:p-3 rounded-lg border border-slate-100 text-[10px] md:text-xs">
                      <div className="flex justify-between text-slate-400 font-black uppercase mb-1">
                        <span>Var</span>
                        <span>Qty</span>
                      </div>
                      <div className="space-y-1 max-h-[60px] md:max-h-[80px] overflow-y-auto">
                        {product.product_variants.map((v: any) => (
                          <div key={v.id} className="flex justify-between items-center">
                            <span className="truncate max-w-[80px] md:max-w-[120px] font-bold text-slate-700">
                              {v.name || v.size || v.color}
                            </span>
                            <span className={`font-mono font-bold ${v.stock <= 0 ? 'text-red-500' : 'text-slate-600'}`}>
                              {v.stock}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* COMPACT FOOTER */}
                <CardFooter className="p-3 pt-0 md:p-4 md:pt-0 mt-auto">
                  <Link href={`/dashboard/products/${product.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold h-8 md:h-10 rounded-lg md:rounded-xl text-xs md:text-sm">
                      Edit
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