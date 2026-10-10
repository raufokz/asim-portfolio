"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import type { BeforeAfterItem } from "@/data/beforeAfter";

type BeforeAfterSliderProps = {
  item: BeforeAfterItem;
  className?: string;
};

/**
 * Accessible before/after comparison slider.
 * - Mouse drag anywhere on the frame, touch drag (vertical page scroll still works)
 * - Keyboard: Left/Right arrows (Shift = larger step), Home/End
 * - Both artworks are clipped with clip-path so they stay perfectly aligned
 */
export default function BeforeAfterSlider({ item, className }: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromPointer = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    draggingRef.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromPointer(e.clientX);
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(100);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[16/10] w-full touch-pan-y select-none overflow-hidden rounded-xl bg-ink/5 ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onDragStart={(e) => e.preventDefault()}
      role="group"
      aria-label={`Before and after comparison: ${item.title}`}
    >
      {/* AFTER layer (full) */}
      <Image
        src={item.afterImage}
        alt={`${item.title} — after: redesigned artwork`}
        fill
        priority={false}
        sizes="(max-width: 1024px) 100vw, 62vw"
        draggable={false}
        className="pointer-events-none object-cover"
      />
      {/* BEFORE layer (clipped to the left of the divider) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden="true"
      >
        <Image
          src={item.beforeImage}
          alt={`${item.title} — before: original artwork`}
          fill
          sizes="(max-width: 1024px) 100vw, 62vw"
          draggable={false}
          className="pointer-events-none object-cover"
          style={{ filter: "grayscale(0.92) contrast(0.92) brightness(1.05)" }}
        />
      </div>

      {/* Labels */}
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
        {item.beforeLabel ?? "Before"}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-lime px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
        {item.afterLabel ?? "After"}
      </span>
      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
        Drag to compare
      </span>

      {/* Divider */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.25)]"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        aria-hidden="true"
      />

      {/* Accessible handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Comparison divider for ${item.title}. Use left and right arrow keys to move.`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% showing before`}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-ink shadow-xl ring-2 ring-ink/10 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  );
}
