import { getStoreSettings, getDashboardStats } from "@/lib/actions";
import CreateStoreForm from "@/components/dashboard/CreateStoreForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Clock, ArrowUpRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils"; // Ensure you have this or just use template literals

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const store = await getStoreSettings();

  if (!store) {
    return <CreateStoreForm />;
  }

  const stats = await getDashboardStats(store.id);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{store.name}</h2>
          <p className="text-muted-foreground">Here is what's happening with your store today.</p>
        </div>
      </div>

      {/* TOP METRICS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">

        {/* Revenue */}
        <Card className="rounded-xl shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="rounded-xl shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.orderCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime orders</p>
          </CardContent>
        </Card>

        {/* Pending Orders - NEW ACTIONABLE CARD */}
        <Card className="rounded-xl shadow-sm border-none bg-white ring-1 ring-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">To Fulfill</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingCount}</div>
            <p className="text-xs text-orange-600/80 mt-1 font-medium">
              Orders waiting for shipping
            </p>
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card className="rounded-xl shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Products</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.productCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.productCount === 0 ? (
                <Link href="/dashboard/products/new" className="text-blue-600 hover:underline">
                  + Add first product
                </Link>
              ) : (
                "In your catalog"
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RECENT ORDERS TABLE - FILLS THE EMPTY SPACE */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 rounded-xl shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You made {stats.recentOrders.length} sales recently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No orders found.</div>
              ) : (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{order.customer_name || "Guest"}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_email || order.customer_phone || "No contact info"}</p>
                    </div>
                    <div className="ml-auto font-medium">
                      +${order.total_usd?.toFixed(2)}
                    </div>
                    <div className={`ml-4 text-xs px-2 py-1 rounded-full capitalize 
                        ${order.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                        ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                        ${order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : ''}
                    `}>
                      {order.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE - QUICK TIPS or STATUS SUMMARY */}
        <Card className="col-span-3 rounded-xl shadow-sm border-none bg-white">
          <CardHeader>
            <CardTitle>Store Status</CardTitle>
            <CardDescription>Performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Pending Orders</div>
                <div className="text-xs text-muted-foreground">Require immediate action</div>
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingCount}</div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Completed Orders</div>
                <div className="text-xs text-muted-foreground">Total successful sales</div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats.recentOrders.filter((o: any) => o.status === 'completed').length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}