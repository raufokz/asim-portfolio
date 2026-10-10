import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: string;
  dark?: boolean;
};

export default function SectionHeading({
  index,
  label,
  title,
  description,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className={cn("label", dark ? "text-paper/55" : "text-ink/55")}>
          <span className={dark ? "text-lime" : "text-ink/40"}>✦</span> ({index}) — {label}
        </p>
        <h2
          className={cn(
            "mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.02em]",
            dark ? "text-paper" : "text-ink",
          )}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p
          className={cn(
            "max-w-md text-base leading-relaxed lg:pb-1 lg:text-right",
            dark ? "text-paper/60" : "text-ink/60",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
