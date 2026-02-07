import { getPublicStoreBySlug, getPublicProducts } from "@/lib/actions";
import { notFound } from "next/navigation";
import { CartSheet } from "@/components/store/cart-sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PoweredByFooter } from "@/components/store/powered-by";
import { StoreFilterWrapper } from "@/components/store/store-filter-wrapper";

// IMPORT TEMPLATES
import ModernGrid from "@/components/templates/modern-grid";
import TechCyber from "@/components/templates/tech-cyber";
import ClassicList from "@/components/templates/classic-list";
import MinimalistBold from "@/components/templates/minimalist-bold";
import VibrantPop from "@/components/templates/vibrant-pop";

export const dynamic = "force-dynamic";

export default async function StorePage({
  params,
  searchParams
}: {
  params: { slug: string },
  searchParams: { q?: string; category?: string; sort?: string; primary_color?: string; button_radius?: string }
}) {
  // 1. FETCH DATA
  const store = await getPublicStoreBySlug(params.slug);

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Store Not Found</h1>
        <Link href="/"><Button variant="outline">Return Home</Button></Link>
      </div>
    );
  }

  const allProducts = await getPublicProducts(store.id);

  // 2. EXTRACT CATEGORIES
  const uniqueCategories = Array.from(
    new Set(allProducts.map((p: any) => p.category).filter(Boolean))
  ) as string[];

  // 3. SERVER-SIDE FILTERING ENGINE
  const query = searchParams.q?.toLowerCase() || "";
  const categoryFilter = searchParams.category || "all";
  const sortFilter = searchParams.sort || "newest";

  let filteredProducts = allProducts.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query);
    const matchesCategory = categoryFilter === "all" ? true : product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sorting
  if (sortFilter === "price_asc") {
    filteredProducts.sort((a: any, b: any) => a.price_usd - b.price_usd);
  } else if (sortFilter === "price_desc") {
    filteredProducts.sort((a: any, b: any) => b.price_usd - a.price_usd);
  } else {
    filteredProducts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // 4. PREPARE THE FILTER UI (The "Slot")
  // We create the component instance here, but we don't render it yet.
  const filterUI = (
    <StoreFilterWrapper
      categories={uniqueCategories}
      totalProducts={filteredProducts.length}
    />
  );

  // 5. TEMPLATE REGISTRY
  const TEMPLATES: Record<string, React.ComponentType<any>> = {
    "modern-grid": ModernGrid, "modern": ModernGrid,
    "tech-cyber": TechCyber, "tech": TechCyber,
    "classic-list": ClassicList, "list": ClassicList,
    "minimalist-bold": MinimalistBold, "minimalist": MinimalistBold,
    "vibrant-pop": VibrantPop, "vibrant": VibrantPop,
  };

  const SelectedTemplate = TEMPLATES[store.template || "modern-grid"] || ModernGrid;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">

      <div className="flex-1">
        {/* 🟢 PASS THE FILTER AS A PROP */}
        <SelectedTemplate
          store={store}
          products={filteredProducts}
          searchParams={searchParams}
          filterUI={filterUI} // <--- The template will decide where to put this
        />
      </div>

      <PoweredByFooter store={store} />

      <CartSheet
        slug={params.slug}
        color={searchParams.primary_color || store.primary_color}
        radius={searchParams.button_radius || store.button_radius}
        trigger={null}
      />
    </main>
  );
}