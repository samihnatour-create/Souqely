import { getStoreSettings, getStoreOrders } from "@/lib/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import OrderActions from "./_components/order-actions"; // Importing your new component

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const store = await getStoreSettings();
  if (!store) return <div>Store not found</div>;

  const orders = await getStoreOrders(store.id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            You have {orders.length} total orders. Review payment proofs before accepting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No orders found yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    {/* 1. Clickable ID for full details */}
                    <TableCell className="font-medium font-mono text-xs">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                      >
                        #{order.id.slice(0, 8)}
                      </Link>
                    </TableCell>

                    {/* 2. Customer Info */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{order.customer_name || "Guest"}</span>
                        <span className="text-xs text-muted-foreground">{order.customer_phone}</span>
                      </div>
                    </TableCell>

                    {/* 3. Status Badge (Includes your new 'shipped' status) */}
                    <TableCell>
                      <Badge variant="outline" className={`
                        capitalize
                        ${order.status === 'shipped' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                        ${order.status === 'pending' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' : ''}
                        ${order.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                        ${order.status === 'awaiting_approval' ? 'bg-purple-100 text-purple-700 hover:bg-purple-100' : ''}
                      `}>
                        {order.status?.replace('_', ' ')}
                      </Badge>
                    </TableCell>

                    {/* 4. Payment Method (Crucial for verifying receipts) */}
                    <TableCell className="uppercase text-xs font-bold text-slate-500">
                      {order.payment_method}
                    </TableCell>

                    <TableCell className="text-right font-bold text-sm">
                      ${order.total_usd?.toFixed(2)}
                    </TableCell>

                    {/* 5. THE NEW ACTIONS (Preview & Accept) */}
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <OrderActions order={order} />
                      </div>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}