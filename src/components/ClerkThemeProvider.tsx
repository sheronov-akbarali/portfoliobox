"use client";

import { useEffect, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { ruRU, enUS } from "@clerk/localizations";
import type { Locale } from "@/lib/i18n/config";

export default function ClerkThemeProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const localization = locale === "ru" ? ruRU : locale === "en" ? enUS : undefined;

  return (
    <ClerkProvider
      localization={localization}
      appearance={{
        variables: {
          colorPrimary: "#6d5ef7",
          colorBackground: isDark ? "#15172a" : "#ffffff",
          colorForeground: isDark ? "#f3f4fb" : "#12131f",
          colorInput: isDark ? "#1f2237" : "#f3f4fb",
          borderRadius: "1rem",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
