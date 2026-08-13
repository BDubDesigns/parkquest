import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
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

const fraunces = Fraunces({
  variable: "--font-fraunces",
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
  themeColor: "#12372a",
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-atlas-paper text-graphite">
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-control bg-forest-ink px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <div id="main-content" className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
