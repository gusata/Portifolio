import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./developer.css";
import "./photography.css";
import "./photography-editorial.css";
import "./photography-room.css";
import "./photography-grid.css";
import "./typography.css";

const dualitySans = localFont({
  src: "../public/fonts/archivo-latin.woff2",
  variable: "--font-archivo",
  weight: "400 800",
  display: "swap",
});
const annotations = localFont({
  src: "../public/fonts/jetbrains-mono-latin.woff2",
  variable: "--font-annotations",
  weight: "400 500",
  display: "swap",
});
const photographic = localFont({
  src: "../public/fonts/newsreader-italic-latin.woff2",
  variable: "--font-photographic",
  weight: "400 500",
  style: "italic",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Gustavo Galeazzi — Two Worlds",
  description: "Two disciplines. One creative mind. Explore Gustavo Galeazzi as developer and photographer.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dualitySans.variable} ${annotations.variable} ${photographic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
