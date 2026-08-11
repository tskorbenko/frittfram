import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["cyrillic", "latin"], display: "swap" });

export const metadata: Metadata = {
  title: "FrittFram — сайти, SEO та digital-рішення для бізнесу у Швеції",
  description: "FrittFram створює сайти, WordPress та WooCommerce-рішення, SEO, брендинг і автоматизацію для малого та середнього бізнесу на шведському ринку.",
  icons: { icon: "/logo.webp" },
  openGraph: {
    title: "FrittFram — цифрові рішення для бізнесу у Швеції",
    description: "Сайти, SEO, e-commerce, брендинг і автоматизація для шведського ринку.",
    type: "website",
    locale: "uk_UA",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "FrittFram — цифрові рішення для бізнесу у Швеції" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body className={manrope.variable}>{children}</body></html>;
}
