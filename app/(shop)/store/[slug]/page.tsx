import { getPublicStoreBySlug, getPublicProducts } from "@/lib/actions";
import { notFound } from "next/navigation";
import { CartSheet } from "@/components/store/cart-sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PoweredByFooter } from "@/components/store/powered-by"; // 🟢 Import Global Footer

// 🟢 IMPORT TEMPLATES
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
  searchParams: { [key: string]: string | undefined }
}) {
  // 1. FETCH DATA (Server Side)
  const store = await getPublicStoreBySlug(params.slug);

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Store Not Found</h1>
        <Link href="/"><Button variant="outline">Return Home</Button></Link>
      </div>
    );
  }

  const products = await getPublicProducts(store.id);

  // 2. TEMPLATE REGISTRY
  const TEMPLATES: Record<string, React.ComponentType<any>> = {
    // 1. Fashion/General
    "modern-grid": ModernGrid,
    "modern": ModernGrid,

    // 2. Electronics/Gaming
    "tech-cyber": TechCyber,
    "tech": TechCyber,

    // 3. Food/Grocery
    "classic-list": ClassicList,
    "list": ClassicList,

    // 4. Minimalist
    "minimalist-bold": MinimalistBold,
    "minimalist": MinimalistBold,

    // 5. Vibrant
    "vibrant-pop": VibrantPop,
    "vibrant": VibrantPop,
  };

  // 3. SELECT TEMPLATE
  // Uses store.template from DB, defaults to 'modern-grid' if empty
  const SelectedTemplate = TEMPLATES[store.template || "modern-grid"] || ModernGrid;

  return (
    <main className="min-h-screen flex flex-col">
      {/* 4. RENDER SELECTED TEMPLATE */}
      {/* Flex-1 ensures it takes up all available space, pushing footer down */}
      <div className="flex-1">
        <SelectedTemplate
          store={store}
          products={products}
          searchParams={searchParams}
        />
      </div>

      {/* 5. GLOBAL FOOTER (Auto-adapts to theme) */}
      <PoweredByFooter store={store} />

      {/* 6. GLOBAL CART (Hidden until triggered) */}
      <CartSheet
        slug={params.slug}
        color={searchParams.primary_color || store.primary_color}
        radius={searchParams.button_radius || store.button_radius}
        trigger={null}
      />
    </main>
  );
}