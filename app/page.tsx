import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle2, Zap, Banknote, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="#">
          <ShoppingBag className="h-6 w-6" />
          <span className="ml-2 font-bold text-xl tracking-tight">Souqely</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/auth/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/auth/register">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-purple-100 to-white dark:from-blue-950 dark:via-purple-950 dark:to-background border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Sell online in Lebanon &mdash; <br className="hidden sm:inline" />
                  <span className="text-primary">without Stripe, PayPal, or headaches.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 leading-relaxed">
                  Create your store in minutes. Accept Cash on Delivery, OMT, and Whish. 
                  Built specifically for Lebanese businesses.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base bg-[#2563eb] hover:bg-[#1d4ed8] hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl text-white border-none">
                    Create your store (free)
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-12 text-base">
                    Sign In
                  </Button>
                </Link>
              </div>
              
              {/* Trust Strip */}
              <div className="pt-8 mt-8 border-t border-gray-200/50 w-full max-w-4xl mx-auto">
                <p className="text-sm text-muted-foreground mb-6 font-medium uppercase tracking-wider">Everything you need to sell in Lebanon</p>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Cash on Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>OMT & Whish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Local Delivery Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>No USD Bank Account Needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Easy Setup</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Launch your store in under 5 minutes. No coding or technical skills required.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Banknote className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Local Payments</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Accept Cash on Delivery, OMT, and Whish payments easily without complex integrations.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Mobile First</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Your store looks stunning on every device, optimized for the mobile shopping experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-950">
        <p className="text-xs text-gray-500 dark:text-gray-400">&copy; 2024 Souqely. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}