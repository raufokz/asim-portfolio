"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Columns2,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  Wrench,
  X,
} from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/before-after", label: "Before / After", icon: Columns2 },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NotConfigured() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper p-6 text-center">
      <p className="label text-ink/50">Admin</p>
      <h1 className="font-display text-2xl font-bold">Supabase is not configured</h1>
      <p className="max-w-md text-sm text-ink/60">
        Add <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
        <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono">.env.local</code>, then restart the
        server. See README.md → “Supabase backend”.
      </p>
    </div>
  );
}

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "anon" | "authed">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setStatus("authed");
        setEmail(data.session.user.email ?? null);
      } else {
        setStatus("anon");
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setStatus("authed");
        setEmail(session.user.email ?? null);
      } else {
        setStatus("anon");
        setEmail(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "anon" && !isLoginPage) router.replace("/admin/login");
    if (status === "authed" && isLoginPage) router.replace("/admin");
  }, [status, isLoginPage, router]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (!isSupabaseConfigured) return <NotConfigured />;

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-3">
          <span className="font-display text-xl font-bold">
            ASIM<sup className="text-[0.55em] text-ink/60">®</sup>
          </span>
          <p className="label text-ink/50">Loading admin…</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status !== "authed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="label text-ink/50">Redirecting to login…</p>
      </div>
    );
  }

  const logout = async () => {
    const supabase = getSupabaseBrowser();
    await supabase?.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col bg-ink text-paper lg:flex">
        <div className="border-b border-paper/10 px-6 py-5">
          <Link href="/admin" className="font-display text-xl font-bold">
            ASIM<sup className="text-[0.55em] text-lime">®</sup>
          </Link>
          <p className="mt-1 text-xs text-paper/50">Admin Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-lime text-ink" : "text-paper/70 hover:bg-paper/10 hover:text-paper",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-paper/10 px-3 py-4">
          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            View Site ↗
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar (mobile nav + user) */}
        <header className="flex items-center justify-between gap-4 border-b border-ink/10 bg-white px-4 py-3 lg:px-8">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 lg:hidden"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="truncate text-sm text-ink/60">{email}</p>
          <button
            type="button"
            onClick={logout}
            className="hidden items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-ink hover:text-paper lg:inline-flex"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </header>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileNavOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-ink p-4 text-paper shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-lg font-bold">
                  ASIM<sup className="text-[0.55em] text-lime">®</sup>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-paper/20"
                  aria-label="Close admin menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-1" aria-label="Admin mobile">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                        active ? "bg-lime text-ink" : "text-paper/70 hover:bg-paper/10",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
