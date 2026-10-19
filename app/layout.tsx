import type { Metadata } from "next";
import { Bebas_Neue, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import DeliveryBanner from "./components/DeliveryBanner";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// The condensed face the RED KICKS logo is drawn in; used only for big display lines.
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Red Kicks — Find your next pair",
    template: "%s | Red Kicks",
  },
  description:
    "Explore sneakers, everyday favourites, and performance footwear from Nike, Adidas, ASICS, On, New Balance, and Birkenstock at Red Kicks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${bebasNeue.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="skip-link">Skip to content</a>
        {/* Announcement bar above the menu, where shoppers expect it (Nike, Adidas, JD). */}
        <DeliveryBanner />
        <Navbar />

        {children}
        <Footer />
      </body>
    </html>
  );
}
