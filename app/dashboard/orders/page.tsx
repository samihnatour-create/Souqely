import { getStoreSettings, getStoreOrders } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Package, User, Calendar, CreditCard, ChevronRight } from "lucide-react";
import OrderActions from "./_components/order-actions";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const store = await getStoreSettings();
  if (!store) return <div>Store not found</div>;

  const orders = await getStoreOrders(store.id);

  return (
    // 🟢 OPTIMIZATION: Reduced padding for mobile
    <div className="flex flex-col gap-6 p-3 md:p-8 pt-6 bg-slate-50/50 min-h-screen overflow-x-hidden">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Orders</h1>
          <p className="text-sm text-slate-500">Manage and fulfill your customer orders.</p>
        </div>
        <div className="text-sm font-bold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm w-fit">
          {orders.length} Total Orders
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Once you start selling, your orders will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* 🟢 DESKTOP VIEW: Traditional Table (Hidden on Mobile) */}
          <Card className="hidden md:block border-none shadow-sm bg-white overflow-hidden rounded-xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50 hover:bg-slate-50">
                  <TableRow>
                    <TableHead className="w-[100px] font-bold text-slate-500">Order ID</TableHead>
                    <TableHead className="font-bold text-slate-500">Customer</TableHead>
                    <TableHead className="font-bold text-slate-500">Status</TableHead>
                    <TableHead className="font-bold text-slate-500">Method</TableHead>
                    <TableHead className="text-right font-bold text-slate-500">Amount</TableHead>
                    <TableHead className="text-right w-[150px] font-bold text-slate-500">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium font-mono text-xs text-blue-600">
                        <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                          #{order.id.slice(0, 8)}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-900">{order.customer_name || "Guest"}</span>
                          <span className="text-xs text-slate-500">{order.customer_phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="uppercase text-xs font-bold text-slate-500">
                        {order.payment_method}
                      </TableCell>
                      <TableCell className="text-right font-bold text-sm text-slate-900">
                        ${order.total_usd?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <OrderActions order={order} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 🟢 MOBILE VIEW: Stacked Cards (Hidden on Desktop) */}
          <div className="md:hidden flex flex-col gap-3">
            {orders.map((order) => (
              <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                <Card className="border-none shadow-sm active:scale-[0.98] transition-transform bg-white rounded-xl overflow-hidden">
                  <div className="p-4 flex flex-col gap-3">

                    {/* Row 1: ID & Date */}
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span className="font-mono">#{order.id.slice(0, 8)}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Row 2: Customer & Price */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{order.customer_name || "Guest"}</p>
                          <p className="text-xs text-slate-500">{order.customer_phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-slate-900">${order.total_usd?.toFixed(2)}</p>
                        <p className="text-[10px] font-bold uppercase text-slate-400">{order.payment_method}</p>
                      </div>
                    </div>

                    {/* Row 3: Status & Action Indicator */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-1">
                      <StatusBadge status={order.status} />
                      <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
                        View Details <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Sub-component for cleaner code
function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`
         capitalize border-0 font-bold px-2 py-0.5
         ${status === 'shipped' ? 'bg-blue-100 text-blue-700' : ''}
         ${status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
         ${status === 'processing' ? 'bg-yellow-100 text-yellow-700' : ''}
         ${status === 'completed' ? 'bg-green-100 text-green-700' : ''}
         ${status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
         ${status === 'awaiting_approval' ? 'bg-purple-100 text-purple-700' : ''}
      `}>
      {status?.replace('_', ' ')}
    </Badge>
  );
}