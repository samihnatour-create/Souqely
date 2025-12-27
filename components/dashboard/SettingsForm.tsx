"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateStoreSettings } from "@/lib/actions";
import { Store } from "@/types";
import { Loader2 } from "lucide-react";

export default function SettingsForm({ store }: { store: Store }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isWhishEnabled, setIsWhishEnabled] = useState(store?.is_whish_enabled || false);
  const [isOmtEnabled, setIsOmtEnabled] = useState(store?.is_omt_enabled || false);
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage(null);

    const result = await updateStoreSettings(formData);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result?.success) {
      setMessage({ type: "success", text: result.success });
    }

    setIsLoading(false);
  }

  return (
    <form action={handleSubmit} className="grid gap-8">
      {message && (
        <div className={`p-4 rounded-md ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message.text}
        </div>
      )}

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Update your store details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Store Name</Label>
            <Input id="name" name="name" defaultValue={store?.name} required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" defaultValue={store?.phone || ""} placeholder="+961 3 123456" />
          </div>
        </CardContent>
      </Card>

      {/* Currency & Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Currency & Rate</CardTitle>
          <CardDescription>
            Set your store's currency exchange rate.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="lbp_rate">LBP Rate (1 USD = ? LBP)</Label>
            <Input
              id="lbp_rate"
              name="lbp_rate"
              type="number"
              defaultValue={store?.lbp_rate || 89500}
              placeholder="89500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Integrations</CardTitle>
          <CardDescription>
            Configure your local payment methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">

          {/* Whish Pay */}
          <div className="space-y-4 border rounded-lg p-4 bg-red-50/50">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold text-red-700">Accept Whish Pay</Label>
                <p className="text-sm text-muted-foreground">Enable payments via Whish Money.</p>
              </div>
              <div className="flex items-center">
                <input type="hidden" name="is_whish_enabled" value={isWhishEnabled ? "on" : "off"} />
                <Switch
                  checked={isWhishEnabled}
                  onCheckedChange={setIsWhishEnabled}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>
            </div>
            {isWhishEnabled && (
              <div className="grid gap-4 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="grid gap-2">
                  <Label htmlFor="whish_number">Whish Number</Label>
                  <Input
                    id="whish_number"
                    name="whish_number"
                    defaultValue={store?.whish_number || ""}
                    placeholder="+961 70 123456"
                  />
                </div>
              </div>
            )}
          </div>

          {/* OMT Pay */}
          <div className="space-y-4 border rounded-lg p-4 bg-yellow-50/50">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold text-yellow-700">Accept OMT Pay</Label>
                <p className="text-sm text-muted-foreground">Enable payments via OMT.</p>
              </div>
              <div className="flex items-center">
                <input type="hidden" name="is_omt_enabled" value={isOmtEnabled ? "on" : "off"} />
                <Switch
                  checked={isOmtEnabled}
                  onCheckedChange={setIsOmtEnabled}
                  className="data-[state=checked]:bg-yellow-400"
                />
              </div>
            </div>
            {isOmtEnabled && (
              <div className="grid gap-4 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="grid gap-2">
                  <Label htmlFor="omt_name">OMT Merchant Name</Label>
                  <Input
                    id="omt_name"
                    name="omt_name"
                    defaultValue={store?.omt_name || ""}
                    placeholder="e.g. My Store OMT"
                  />
                </div>
              </div>
            )}
          </div>

        </CardContent>
        <CardFooter className="justify-end border-t px-6 py-4">
          <Button disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
