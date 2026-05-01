import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
  title: "Standard House | Prefabricated Homes in Uganda",
  description:
    "Standard House is a PropTech company offering prefabricated homes in Uganda with transparent pricing and guaranteed timelines. Choose from Model A/B/C or customize your dream home.",
  keywords: "prefabricated homes Uganda, modular housing, PropTech Africa, prefabricated houses Kampala, steel structure homes Uganda, custom home Uganda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <CozeChatWidget />
      </body>
    </html>
  );
}
