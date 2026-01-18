import { getOrderDetails } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, MapPin, User, CreditCard } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const order = await getOrderDetails(params.id);

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">

            {/* HEADER & BACK BUTTON */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/orders">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold tracking-tight">Order {order.id.slice(0, 8)}...</h1>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                </div>
                {/* Optional: Add "Print" or "Refund" buttons here later */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT COLUMN: ORDER ITEMS */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                            <CardDescription>Products purchased in this order</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                                No items found (Legacy order)
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        order.items.map((item: any) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.product_name}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.price_at_purchase)}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(item.price_at_purchase * item.quantity)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {/* TOTALS SECTION */}
                            <div className="mt-6 flex flex-col items-end space-y-2 text-sm">
                                <div className="flex w-1/3 justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(order.total_usd)}</span>
                                </div>
                                <div className="flex w-1/3 justify-between font-bold text-base pt-2 border-t">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total_usd)}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Rate: {formatCurrency(order.lbp_rate_at_order || 89500).replace("$", "LBP ")}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: CUSTOMER DETAILS */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-slate-500" />
                                </div>
                                <div>
                                    <div className="font-semibold">{order.customer_name}</div>
                                    <div className="text-xs text-muted-foreground">{order.customer_email || "No email"}</div>
                                    <div className="text-xs text-muted-foreground">{order.customer_phone || "No phone"}</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                                <div className="text-sm">
                                    <div className="font-medium mb-1">Shipping Address</div>
                                    <p className="text-muted-foreground leading-snug">
                                        {order.customer_address || "No address provided"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4" />
                                <span className="capitalize">{order.payment_method?.replace("_", " ") || "Cash"}</span>
                            </div>
                            {/* If you have screenshots, display them here */}
                            {order.payment_screenshot && (
                                <div className="rounded-md border p-1 bg-slate-50">
                                    <p className="text-xs text-center text-muted-foreground mb-1">Receipt</p>
                                    {/* <img src={order.payment_screenshot} ... /> */}
                                    <div className="text-xs text-center text-blue-600 underline cursor-pointer">View Receipt</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}