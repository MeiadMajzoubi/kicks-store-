import type { Metadata } from "next";
import { Anton, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";
import Footer from "./components/Footer";
import { getSearchProducts } from "@/lib/products";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Heavy condensed face for big slogans (hero, 404): the sports-poster look.
const anton = Anton({
  variable: "--font-anton",
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The search bar runs in the browser, so the server loads its shoes and hands them over.
  const searchProducts = await getSearchProducts();

  return (
    <html lang="en" className={`${geistSans.variable} ${anton.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="skip-link">Skip to content</a>
        {/* Announcement bar above the menu, where shoppers expect it (Nike, Adidas, JD). */}
        <AnnouncementBar />
        <Navbar searchProducts={searchProducts} />

        {children}
        <Footer />
      </body>
    </html>
  );
}
