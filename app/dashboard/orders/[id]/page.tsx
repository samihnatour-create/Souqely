import { getOrderDetails } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Phone, User, Calendar, CreditCard, Maximize2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import OrderActions from "../_components/order-actions";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const order = await getOrderDetails(params.id);

    if (!order) return <div className="p-10 text-center">Order not found</div>;

    return (
        // 🟢 OPTIMIZATION: p-4 for mobile
        <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto pb-24 md:pb-6">

            {/* 1. HEADER: Responsive Stack */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Link href="/dashboard/orders" className="w-fit">
                        <Button variant="outline" size="sm" className="h-9">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                            Order #{order.id.slice(0, 8)}
                        </h1>
                        <Badge variant="outline" className={`
                            capitalize px-2.5 py-0.5 text-xs font-bold border-0
                            ${order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : ''}
                            ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                            ${order.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                            ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                            ${order.status === 'awaiting_approval' ? 'bg-purple-100 text-purple-700' : ''}
                        `}>
                            {order.status.replace('_', ' ')}
                        </Badge>
                    </div>
                </div>

                {/* 🟢 MOBILE ACTION BAR (Fixed at bottom on mobile, normal on desktop) */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:static md:p-0 md:bg-transparent md:border-0 z-50 flex gap-2 shadow-xl md:shadow-none">
                    <OrderActions order={order} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 2. LEFT COLUMN: Items & Payment Proof */}
                <div className="md:col-span-2 flex flex-col gap-6">

                    {/* ITEMS LIST */}
                    <Card className="overflow-hidden border-none shadow-sm bg-white rounded-xl">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-50 px-4 py-3">
                            <CardTitle className="text-base font-bold">Items Ordered</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[50%] font-bold text-xs uppercase tracking-wider pl-4">Product</TableHead>
                                        <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Price</TableHead>
                                        <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Qty</TableHead>
                                        <TableHead className="text-right font-bold text-xs uppercase tracking-wider pr-4">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.order_items.map((item: any) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-bold text-sm text-slate-900 pl-4 py-4">
                                                {item.product_name}
                                            </TableCell>
                                            <TableCell className="text-right text-slate-500 text-sm">${item.price_at_purchase}</TableCell>
                                            <TableCell className="text-right text-slate-900 font-bold text-sm">x{item.quantity}</TableCell>
                                            <TableCell className="text-right font-bold text-slate-900 text-sm pr-4">
                                                ${(item.price_at_purchase * item.quantity).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                        <TableCell colSpan={3} className="text-right font-bold text-slate-500 pt-4 pb-4">Total Amount:</TableCell>
                                        <TableCell className="text-right font-black text-xl text-slate-900 pt-4 pb-4 pr-4">
                                            ${order.total_usd}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* 🔍 CLICKABLE PAYMENT PROOF CARD */}
                    {order.payment_screenshot_url && (
                        <Card className="overflow-hidden border-2 border-slate-100 rounded-xl shadow-sm">
                            <CardHeader className="bg-slate-50/50 py-3 px-4 border-b border-slate-100">
                                <CardTitle className="flex items-center gap-2 text-sm font-bold">
                                    <CreditCard className="w-4 h-4 text-slate-500" />
                                    Payment Proof
                                    <span className="text-[10px] font-normal text-slate-400 ml-auto uppercase tracking-wide">Tap to zoom</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="relative w-full aspect-video min-h-[250px] cursor-pointer group bg-slate-100">
                                            <Image
                                                src={order.payment_screenshot_url}
                                                alt="Payment Proof"
                                                fill
                                                className="object-contain group-hover:opacity-90 transition-opacity"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                                                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                                    <Maximize2 className="w-6 h-6 text-slate-800" />
                                                </div>
                                            </div>
                                        </div>
                                    </DialogTrigger>

                                    <DialogContent className="max-w-4xl h-[80vh] w-[95vw] p-0 overflow-hidden bg-black flex items-center justify-center border-none rounded-2xl">
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

                                <div className="p-3 bg-white border-t flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-medium">Method:</span>
                                    <Badge variant="secondary" className="uppercase font-bold tracking-wider text-[10px]">
                                        {order.payment_method}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* 3. RIGHT COLUMN: Customer Details */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="border-none shadow-sm bg-white rounded-xl">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-50 px-4 py-3">
                            <CardTitle className="text-base font-bold">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{order.customer_name || "Guest"}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Name</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{order.customer_phone}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Phone</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm leading-snug">{order.customer_address}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">Address</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 mt-2">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Placed On</p>
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