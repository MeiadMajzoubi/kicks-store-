import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import DeliveryBanner from "./components/DeliveryBanner";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Red Kicks — Find your next pair",
    template: "%s | Red Kicks",
  },
  description:
    "Explore sneakers, everyday favourites, and performance footwear from Nike, adidas, ASICS, On, New Balance, and Birkenstock at Red Kicks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Navbar />
        <DeliveryBanner />

        {children}
        <Footer />
      </body>
    </html>
  );
}
