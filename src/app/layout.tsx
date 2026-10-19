import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Cozy Cat | Freelance websites, résumés and food photos in Miri",
  description:
    "Independent freelancer in Miri, Sarawak. Website design from RM129, résumé formatting from RM19, and natural food photo enhancement from RM15.",
  openGraph: {
    title: "Cozy Cat | Freelance websites, résumés and food photos in Miri",
    description:
      "Websites, résumés, and food photos from an independent freelancer in Miri, Sarawak.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${display.variable} antialiased`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
