import { getPublicStoreBySlug, getPublicProducts } from "@/lib/actions";
import { notFound } from "next/navigation";
import { CartSheet } from "@/components/store/cart-sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// 🟢 IMPORT TEMPLATES
import ModernGrid from "@/components/templates/modern-grid";
import TechCyber from "@/components/templates/tech-cyber";
// import ClassicList from "@/components/templates/classic-list"; // Ready for later

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
  // This maps the database string to the React Component
  const TEMPLATES: Record<string, React.ComponentType<any>> = {
    "modern-grid": ModernGrid,
    "tech-cyber": TechCyber,
    "classic-list": ModernGrid, // Fallback until you build it
    "minimalist": ModernGrid,   // Fallback until you build it
  };

  // 3. SELECT TEMPLATE
  // Uses store.template from DB, defaults to 'modern-grid' if empty
  const SelectedTemplate = TEMPLATES[store.template || "modern-grid"] || ModernGrid;

  return (
    <>
      {/* 4. RENDER SELECTED TEMPLATE */}
      {/* We pass searchParams so the Live Editor still works! */}
      <SelectedTemplate
        store={store}
        products={products}
        searchParams={searchParams}
      />

      {/* 5. GLOBAL CART (Always present) */}
      <CartSheet
        slug={params.slug}
        color={searchParams.primary_color || store.primary_color} // Reactive to editor
        radius={searchParams.button_radius || store.button_radius}
        trigger={null}
      />
    </>
  );
}