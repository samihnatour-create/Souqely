import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function RegisterPage() {
  return (
    // 'relative' and 'overflow-hidden' are essential for the background layers
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12 overflow-hidden">

      {/* 1. Background Image Layer */}
      <Image
        src="/login-register-bg.png"
        alt="Souqely Merchant Community"
        fill
        className="object-cover"
        priority
      />

      {/* 2. Low Brightness Overlay */}
      {/* Using 'bg-black/70' ensures consistency with your Login page */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* 3. The Registration Card */}
      {/* 'z-20' keeps the card above the dark overlay */}
      <Card className="relative z-20 w-full max-w-md bg-white/95 backdrop-blur-md border-none shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-black tracking-tighter uppercase italic text-slate-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Start selling online with Souqely today
          </CardDescription>
        </CardHeader>

        {/* Your existing functional form component */}
        <RegisterForm />
      </Card>
    </div>
  );
}