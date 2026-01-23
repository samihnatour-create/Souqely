import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <Card>
        <CardHeader>
          <CardTitle>Shipping Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+961 3 123456" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Beirut" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Street, Building, Floor" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payment">Payment Method</Label>
            <Select>
              <SelectTrigger id="payment">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                <SelectItem value="omt">OMT</SelectItem>
                <SelectItem value="whish">Whish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link href={`/store/${params.slug}/success`}>
            <Button className="w-full mt-4">Place Order</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
