"use client";

import { signUp } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage(null);

    const result = await signUp(formData);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
      setIsLoading(false);
    } else if (result?.success) {
      setMessage({ type: "success", text: result.success });
      router.push("/auth/verify");
    } else {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <CardContent className="space-y-4">
        {/* Enhanced Messaging UI */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-600 border border-red-100"
            }`}>
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isLoading}
            className="h-12 rounded-xl focus-visible:ring-blue-600 transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password font-semibold text-slate-700">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isLoading}
            className="h-12 rounded-xl focus-visible:ring-blue-600 transition-all"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-6 pt-2">
        {/* Bold, Action-Oriented Button */}
        <Button
          className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-lg shadow-slate-900/10"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="text-center text-sm text-slate-500 font-medium">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 font-black hover:underline transition-colors">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}