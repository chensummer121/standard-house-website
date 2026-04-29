import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CozeChatWidget from "@/components/CozeChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Standard House | Premium African Home Designs",
  description:
    "Discover beautifully crafted house designs inspired by African architecture. Custom home building, investment opportunities, and sustainable living solutions.",
  keywords: "house design, African architecture, home plans, custom homes, Ethiopia real estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <Script
          src="https://lf-cdn.coze.cn/obj/unpkg/latest/coze/web-sdk/dist/js-umd/index.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log("Coze Web SDK loaded");
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <CozeChatWidget />
      </body>
    </html>
  );
}
