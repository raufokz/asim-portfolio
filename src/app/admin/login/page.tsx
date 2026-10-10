"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { Button, Field, inputClass } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("Supabase is not configured. Check .env.local.");
      setLoading(false);
      return;
    }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message || "Login failed. Check your email and password.");
      setLoading(false);
      return;
    }
    router.replace("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-6">
      <div className="w-full max-w-sm rounded-2xl bg-paper p-8 shadow-2xl">
        <p className="label text-ink/50">Admin</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          ASIM<sup className="text-[0.55em] text-ink/60">®</sup> Dashboard
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Sign in to manage projects, services, testimonials, inquiries, and site settings.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Email">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@studio.com"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </Field>

          {error && (
            <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button type="submit" variant="lime" disabled={loading} className="w-full py-3">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-ink/45">
          Admin access only. Credentials are managed in Supabase Auth.
        </p>
      </div>
    </div>
  );
}
