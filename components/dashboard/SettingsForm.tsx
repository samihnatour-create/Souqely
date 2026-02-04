"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateStoreSettings } from "@/lib/actions";
import { Store } from "@/types";
import { Loader2, Send, CreditCard, Banknote, Smartphone, Store as StoreIcon } from "lucide-react";

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
    <form action={handleSubmit} className="grid gap-6 md:gap-8 pb-20 md:pb-0">

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
          }`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {/* General Information */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
        <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-4 md:p-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
              <StoreIcon className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg font-bold">General Info</CardTitle>
              <CardDescription className="text-xs md:text-sm">Store details & contact.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:gap-6 p-4 md:p-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs uppercase font-bold text-slate-400">Store Name</Label>
            <Input id="name" name="name" defaultValue={store?.name} required className="h-11 md:h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-xs uppercase font-bold text-slate-400">Phone Number</Label>
            <Input id="phone" name="phone" defaultValue={store?.phone || ""} placeholder="+961 3 123456" className="h-11 md:h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium" />
          </div>
        </CardContent>
      </Card>

      {/* Order Notifications (Telegram) */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
        <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-4 md:p-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg font-bold">Notifications</CardTitle>
              <CardDescription className="text-xs md:text-sm">Get orders on your phone.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-4 md:p-6 space-y-4">
            <div className="space-y-3">
              <Label htmlFor="telegram_chat_id" className="text-xs uppercase font-bold text-blue-400">Telegram Chat ID</Label>
              <Input
                id="telegram_chat_id"
                name="telegram_chat_id"
                defaultValue={store?.telegram_chat_id || ""}
                placeholder="e.g. 123456789"
                className="h-11 md:h-10 bg-white border-blue-100 focus:border-blue-300 transition-all font-mono text-blue-900"
              />

              <div className="text-xs text-slate-500 bg-white p-3 md:p-4 rounded-xl border border-blue-100/50 leading-relaxed shadow-sm">
                <strong className="text-slate-900 block mb-2">How to connect:</strong>
                <ol className="list-decimal pl-4 space-y-1.5 marker:text-blue-400 marker:font-bold">
                  <li>Search for <strong className="text-blue-600">@userinfobot</strong> on Telegram.</li>
                  <li>Click <strong>Start</strong> to get your ID number.</li>
                  <li>Paste the ID number above.</li>
                  <li>Start a chat with <strong className="text-blue-600">@SouqelyBot</strong> so we can message you.</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency & Rate */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
        <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-4 md:p-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg font-bold">Currency</CardTitle>
              <CardDescription className="text-xs md:text-sm">Exchange rate settings.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-2">
            <Label htmlFor="lbp_rate" className="text-xs uppercase font-bold text-slate-400">LBP Rate (1 USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">LBP</span>
              <Input
                id="lbp_rate"
                name="lbp_rate"
                type="number"
                defaultValue={store?.lbp_rate || 89500}
                placeholder="89500"
                className="h-11 md:h-10 pl-12 bg-slate-50 border-slate-200 focus:bg-white transition-all font-mono font-bold text-slate-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Integrations */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
        <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-4 md:p-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg font-bold">Payments</CardTitle>
              <CardDescription className="text-xs md:text-sm">Local payment methods.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:gap-6 p-4 md:p-6">

          {/* Whish Pay */}
          <div className={`space-y-4 border rounded-xl p-4 transition-colors ${isWhishEnabled ? 'bg-red-50/50 border-red-100' : 'bg-slate-50/50 border-slate-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isWhishEnabled ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-400'}`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <Label className={`text-base font-bold ${isWhishEnabled ? 'text-red-700' : 'text-slate-500'}`}>Whish Pay</Label>
                  <p className="text-xs text-slate-400">Accept Whish Money transfers.</p>
                </div>
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
              <div className="pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                <Label htmlFor="whish_number" className="text-xs uppercase font-bold text-red-400 mb-1.5 block">Whish Number</Label>
                <Input
                  id="whish_number"
                  name="whish_number"
                  defaultValue={store?.whish_number || ""}
                  placeholder="+961 70 123456"
                  className="h-11 md:h-10 bg-white border-red-100 focus:border-red-300 font-medium"
                />
              </div>
            )}
          </div>

          {/* OMT Pay */}
          <div className={`space-y-4 border rounded-xl p-4 transition-colors ${isOmtEnabled ? 'bg-yellow-50/50 border-yellow-200' : 'bg-slate-50/50 border-slate-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOmtEnabled ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-400'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <Label className={`text-base font-bold ${isOmtEnabled ? 'text-yellow-800' : 'text-slate-500'}`}>OMT Pay</Label>
                  <p className="text-xs text-slate-400">Accept OMT transfers.</p>
                </div>
              </div>
              <div className="flex items-center">
                <input type="hidden" name="is_omt_enabled" value={isOmtEnabled ? "on" : "off"} />
                <Switch
                  checked={isOmtEnabled}
                  onCheckedChange={setIsOmtEnabled}
                  className="data-[state=checked]:bg-yellow-500"
                />
              </div>
            </div>
            {isOmtEnabled && (
              <div className="pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                <Label htmlFor="omt_name" className="text-xs uppercase font-bold text-yellow-600 mb-1.5 block">OMT Name</Label>
                <Input
                  id="omt_name"
                  name="omt_name"
                  defaultValue={store?.omt_name || ""}
                  placeholder="Full Name on ID"
                  className="h-11 md:h-10 bg-white border-yellow-200 focus:border-yellow-400 font-medium"
                />
              </div>
            )}
          </div>

        </CardContent>

        {/* Sticky Mobile Action Bar / Normal Desktop Footer */}
        <CardFooter className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 md:static md:bg-transparent md:border-0 md:p-6 md:pt-0">
          <Button disabled={isLoading} className="w-full md:w-auto md:ml-auto h-12 md:h-10 font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg md:shadow-none">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}