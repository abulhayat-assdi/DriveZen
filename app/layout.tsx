import type { Metadata } from "next";
import { Inter, Manrope, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DriveZen — Premium Toyota Aqua Armrest",
  description:
    "DriveZen Premium Armrest — Toyota Aqua-এর জন্য বিশেষভাবে ডিজাইন করা প্রিমিয়াম আর্মরেস্ট। Comfort, Storage ও Premium Feel একসাথে। Cash on delivery, সারা বাংলাদেশে ডেলিভারি।",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${manrope.variable} ${hindSiliguri.variable}`}
    >
      <body className="min-h-screen bg-night text-fg antialiased">{children}</body>
    </html>
  );
}
