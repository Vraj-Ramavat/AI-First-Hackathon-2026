import type { Metadata } from "next";
import { Teko, JetBrains_Mono, Inter } from "next/font/google";
import Providers from "@/src/components/Providers";
import "./globals.css";

const fontDisplay = Teko({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

const fontSans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "StockSaathi",
  description:
    "AI that reads shelves, predicts demand, and messages Kirana store owners before they run out of stock. Built for Summer School '26 AI First Hackathon by Team Pixel Error.",
  keywords: [
    "StockSaathi",
    "Kirana Inventory AI",
    "Computer Vision FMCG",
    "Demand Forecasting India",
    "WhatsApp Reorder Automation",
    "IIT Jammu I3C",
    "Team Pixel Error",
  ],
  authors: [
    { name: "Prathamesh Naik" },
    { name: "Vraj Ramavat" },
    { name: "Heli Gupta" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontMono.variable} ${fontSans.variable} scroll-smooth`}>
      <body className="bg-base text-text-primary antialiased min-h-screen selection:bg-accent selection:text-base font-mono">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
