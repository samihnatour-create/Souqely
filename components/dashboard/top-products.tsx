import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, ImageIcon } from "lucide-react";
import Image from "next/image";
import { getTopProducts } from "@/lib/dashboard-data"; // Import the server action

export async function TopProducts({ storeId }: { storeId: string }) {
    // 🟢 Fetch Real Data
    const products = await getTopProducts(storeId);

    return (
        <Card className="border-none shadow-sm h-full bg-white">
            <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Top Performers
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                {products.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        No sales yet. Start selling to see your top products!
                    </div>
                ) : (
                    products.map((product, index) => (
                        <div key={product.id} className="flex items-center gap-4">
                            {/* Rank Badge */}
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? "bg-yellow-100 text-yellow-700" :
                                    index === 1 ? "bg-slate-100 text-slate-700" :
                                        "bg-orange-50 text-orange-700"
                                }`}>
                                {index + 1}
                            </div>

                            {/* Product Image */}
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                                {product.image ? (
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate text-slate-900">{product.name}</p>
                                <p className="text-xs text-slate-500">{product.sales} units sold</p>
                            </div>

                            {/* Revenue */}
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900">${product.revenue.toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}