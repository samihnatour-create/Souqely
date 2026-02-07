import type { Metadata } from "next";
import { Sora, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// 1. Configure Fonts
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Souqely — E-commerce built for Lebanon",
  description: "OMT. Whish. WhatsApp. LBP. Everything local stores actually use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${sora.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased bg-white text-[#0f1117]">
        {children}
      </body>
    </html>
  );
}