import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Pulse",
  description: "Your personal tech news aggregator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} font-sans antialiased bg-gray-50 text-gray-900`}
      >
        <Navbar />
        <div className="flex max-w-7xl mx-auto">
          <Suspense>
            <Sidebar />
          </Suspense>
          <main className="flex-1 p-6 min-h-[calc(100vh-3.5rem)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
