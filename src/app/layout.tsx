import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PortfolioBox — dasturchilar loyihalari",
  description:
    "Dasturchilar oʻz loyihalarini joylaydi, boshqalar koʻrib chiqadi, baholaydi va fikr bildiradi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <ClerkProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
            PortfolioBox — dasturchilar uchun loyihalar platformasi
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
