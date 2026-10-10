const items = [
  "Brand Identity",
  "Packaging",
  "Poster Design",
  "Social Campaigns",
  "Typography",
  "Art Direction",
  "Editorial",
  "Motion",
];

export default function Marquee() {
  return (
    <section aria-hidden="true" className="overflow-hidden bg-lime py-4">
      <div className="flex w-max animate-marquee">
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-6 px-5 font-display text-lg font-bold uppercase tracking-tight text-ink"
          >
            {item}
            <span className="text-ink/35">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
