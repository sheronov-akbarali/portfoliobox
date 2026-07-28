import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

export default async function Navbar({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary;
}) {
  const user = await currentUser();

  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <div className="glass-pill flex h-16 w-full max-w-5xl items-center justify-between gap-3 rounded-full px-3 sm:px-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-display font-semibold text-base sm:text-lg text-[var(--text)]"
        >
          <span className="accent-gradient inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold shadow-[0_4px_14px_rgba(109,94,247,0.45)]">
            PB
          </span>
          <span className="hidden sm:inline">PortfolioBox</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />

          {user ? (
            <>
              <Link
                href="/projects/new"
                className="accent-gradient hidden sm:inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-white shadow-[0_4px_14px_rgba(109,94,247,0.35)] transition hover:brightness-110 active:scale-95"
              >
                {t.nav.postProject}
              </Link>
              <Link
                href="/projects/new"
                className="accent-gradient inline-flex sm:hidden h-9 w-9 items-center justify-center rounded-full text-white shadow-[0_4px_14px_rgba(109,94,247,0.35)]"
                aria-label={t.nav.postProject}
              >
                +
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="glass-pill hidden sm:inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-[var(--text)] transition hover:scale-105 active:scale-95">
                  {t.nav.signIn}
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="accent-gradient inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-white shadow-[0_4px_14px_rgba(109,94,247,0.35)] transition hover:brightness-110 active:scale-95">
                  {t.nav.signUp}
                </button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
