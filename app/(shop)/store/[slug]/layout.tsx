export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* We leave this empty of any Navbars or Footers. 
          The store page itself will handle its own header.
      */}
      {children}
    </div>
  );
}