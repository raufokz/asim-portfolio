"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors hover:border-lime hover:bg-lime hover:text-ink"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
