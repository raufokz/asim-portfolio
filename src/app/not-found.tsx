import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <p className="label text-ink/50">404</p>
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        This page doesn’t exist.
      </h1>
      <p className="max-w-md text-ink/65">
        The project or page you’re looking for isn’t here — it may be a concept that hasn’t been
        published yet.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-display font-semibold text-paper transition-colors hover:bg-lime hover:text-ink"
      >
        Back to Home
      </Link>
    </main>
  );
}
