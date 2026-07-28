import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Unbounded } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import ClerkThemeProvider from "@/components/ClerkThemeProvider";
import Navbar from "@/components/Navbar";
import { getT } from "@/lib/i18n/server";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "PortfolioBox — dasturchilar loyihalari",
  description:
    "Dasturchilar oʻz loyihalarini joylaydi, boshqalar koʻrib chiqadi, baholaydi va fikr bildiradi.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, t } = await getT();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${unbounded.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <ClerkThemeProvider locale={locale}>
            <Navbar locale={locale} t={t} />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
              {children}
            </main>
            <footer className="w-full py-8 text-center text-sm text-[var(--text-muted)]">
              {t.footer.tagline}
            </footer>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
