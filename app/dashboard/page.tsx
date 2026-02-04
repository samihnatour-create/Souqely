import { getStoreSettings, getDashboardStats } from "@/lib/actions";
import CreateStoreForm from "@/components/dashboard/CreateStoreForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Clock, User, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { getUserSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getUserSession();
  if (!user) redirect("/login");

  const store = await getStoreSettings();
  if (!store) return <CreateStoreForm />;

  const stats = await getDashboardStats(store.id);

  return (
    // 🟢 OPTIMIZATION 1: overflow-x-hidden prevents side-scrolling
    // 🟢 OPTIMIZATION 2: p-4 on mobile, p-8 on desktop
    <div className="flex flex-col gap-6 md:gap-8 p-4 md:p-8 pt-6 bg-slate-50/50 min-h-screen overflow-x-hidden w-full max-w-[100vw]">

      {/* HEADER: Stacks on mobile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 truncate">
            {store.name}
          </h2>
          <p className="text-sm text-slate-500">Overview for today.</p>
        </div>
        <Link
          href={`/store/${store.slug}`}
          target="_blank"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-blue-600 shadow-sm hover:bg-blue-50 transition-colors w-full md:w-auto"
        >
          View Storefront <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* TOP METRICS: 2 Columns on Mobile (Compact) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">

        {/* Revenue */}
        <Card className="rounded-xl shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-slate-500">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold text-slate-900">
              ${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="rounded-xl shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-slate-500">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold text-slate-900">{stats.orderCount}</div>
          </CardContent>
        </Card>

        {/* Pending (Full width on mobile if odd number, but here we fit 2x2) */}
        <Card className="rounded-xl shadow-sm border-none bg-white ring-1 ring-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-orange-600">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold text-slate-900">{stats.pendingCount}</div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="rounded-xl shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-slate-500">Products</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold text-slate-900">{stats.productCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS ROW: Single Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4 min-w-0">
          <SalesChart storeId={store.id} />
        </div>
        <div className="lg:col-span-3 min-w-0">
          <TopProducts storeId={store.id} />
        </div>
      </div>

      {/* RECENT ORDERS: Optimized List for Mobile */}
      <Card className="rounded-xl shadow-sm border-none bg-white overflow-hidden">
        <CardHeader className="p-4 md:p-6 border-b border-slate-50">
          <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">No orders found.</div>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-slate-50/50 transition-colors">

                  {/* Left: Customer Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {order.customer_name || "Guest"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {order.customer_email || order.customer_phone || "No info"}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status & Price (Flex Row on Mobile) */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-12 sm:pl-0">
                    <div className={`text-[10px] md:text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider
                          ${order.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                          ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                          ${order.status === 'awaiting_approval' ? 'bg-purple-100 text-purple-700' : ''}
                      `}>
                      {order.status?.replace('_', ' ')}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        +${order.total_usd?.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}