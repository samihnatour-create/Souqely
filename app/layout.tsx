import type { Metadata } from "next";
import { Sora, Fraunces } from "next/font/google"; // 🟢 Import Fonts
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
    <html lang="en">
      <body className={`${sora.variable} ${fraunces.variable} font-sans antialiased bg-white text-[#0f1117]`}>
        {children}
      </body>
    </html>
  );
}