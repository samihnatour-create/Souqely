import { getOrderDetails } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog
import { ArrowLeft, MapPin, Phone, User, Calendar, CreditCard, Maximize2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import OrderActions from "../_components/order-actions";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const order = await getOrderDetails(params.id);

    if (!order) return <div className="p-10 text-center">Order not found</div>;

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">

            {/* 1. HEADER: Back Button, Title, Status & Quick Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/orders">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(0, 8)}</h1>

                    {/* Status Badge (Matched Colors) */}
                    <Badge variant="outline" className={`
            capitalize px-3 py-1 text-sm border-0
            ${order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : ''}
            ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
            ${order.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
            ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
            ${order.status === 'awaiting_approval' ? 'bg-purple-100 text-purple-700' : ''}
          `}>
                        {order.status.replace('_', ' ')}
                    </Badge>
                </div>

                <div className="flex gap-2">
                    {/* Reuse your existing actions (Accept/WhatsApp) */}
                    <OrderActions order={order} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 2. LEFT COLUMN: Items & Payment Proof */}
                <div className="md:col-span-2 flex flex-col gap-6">

                    {/* ITEMS LIST */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Items Ordered</CardTitle>
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
                                    {order.order_items.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.product_name}</TableCell>
                                            <TableCell className="text-right">${item.price_at_purchase}</TableCell>
                                            <TableCell className="text-right">x{item.quantity}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                ${(item.price_at_purchase * item.quantity).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold pt-4 text-slate-500">Total Amount:</TableCell>
                                        <TableCell className="text-right font-black text-xl pt-4">
                                            ${order.total_usd}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* 🔍 CLICKABLE PAYMENT PROOF CARD */}
                    {order.payment_screenshot_url && (
                        <Card className="overflow-hidden border-2 border-slate-100">
                            <CardHeader className="bg-slate-50/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CreditCard className="w-5 h-5 text-slate-500" />
                                    Payment Proof
                                    <span className="text-xs font-normal text-slate-400 ml-auto">Click image to zoom</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        {/* Interactive Trigger */}
                                        <div className="relative w-full aspect-video min-h-[300px] cursor-pointer group bg-slate-100">
                                            <Image
                                                src={order.payment_screenshot_url}
                                                alt="Payment Proof"
                                                fill
                                                className="object-contain group-hover:opacity-90 transition-opacity"
                                                unoptimized
                                            />
                                            {/* Zoom Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                                                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                                    <Maximize2 className="w-6 h-6 text-slate-800" />
                                                </div>
                                            </div>
                                        </div>
                                    </DialogTrigger>

                                    {/* Full Screen Popup */}
                                    <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden bg-black flex items-center justify-center border-none">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={order.payment_screenshot_url}
                                                alt="Payment Proof Fullscreen"
                                                fill
                                                className="object-contain"
                                                unoptimized
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <div className="p-4 bg-white border-t flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Method:</span>
                                    <Badge variant="secondary" className="uppercase font-bold tracking-wider">
                                        {order.payment_method}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* 3. RIGHT COLUMN: Customer Details */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{order.customer_name || "Guest"}</p>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Name</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{order.customer_phone}</p>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Phone</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 leading-snug">{order.customer_address}</p>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">Address</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Placed On</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}