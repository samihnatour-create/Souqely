import { signIn } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const handleFormAction = async (formData: FormData) => {
    "use server"
    await signIn(formData)
  }

  return (
    // 'relative' is required so the background image can 'fill' this container
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12 overflow-hidden">

      {/* 1. The Background Image */}
      <Image
        src="/login-register-bg.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* 2. Low Brightness Overlay */}
      {/* Using 'bg-black/70' creates that high-end dimmed look for the screenshots */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* 3. The Login Card */}
      {/* 'z-20' keeps the card on top of the dark overlay */}
      <Card className="relative z-20 w-full max-w-md bg-white/95 backdrop-blur-md border-none shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Sign in to Souqely</CardTitle>
          <CardDescription className="text-slate-500">
            Enter your email and password to access your store dashboard
          </CardDescription>
        </CardHeader>
        <form action={handleFormAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password text-sm font-semibold text-slate-700">Password</Label>
              <Input id="password" name="password" type="password" required className="h-11" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full h-11 font-bold bg-slate-900 hover:bg-slate-800 transition-all active:scale-95" type="submit">
              Sign In
            </Button>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}