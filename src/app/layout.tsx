import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MobileNav from "@/components/navigation/MobileNav";
import Footer from "@/components/Footer";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParkQuest",
  description: "Turn every park into an adventure.",
  applicationName: "ParkQuest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ParkQuest",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icons/parkquest-apple-touch.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#064e3b",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-emerald-950 pb-[calc(4rem+env(safe-area-inset-bottom))] text-white md:pb-0">
        <div className="flex-1">{children}</div>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
