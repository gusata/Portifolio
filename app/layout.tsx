import type { Metadata } from "next";
import { Dela_Gothic_One, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const delaGothic = Dela_Gothic_One({
  variable: "--font-gothic",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Gustavo Galeazzi — Full Stack & AI Builder",
  description: "Portfolio of Gustavo Galeazzi — Full Stack Developer and AI Builder based in São Paulo, Brazil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${delaGothic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
