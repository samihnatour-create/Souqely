import StoreHeader from "@/components/StoreHeader";

export default function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader storeName="Souqely Store" slug={params.slug} />
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
