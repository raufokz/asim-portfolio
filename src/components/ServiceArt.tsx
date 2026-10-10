type ServiceArtProps = {
  seed: number;
  title: string;
};

type Scheme = { bg: string; fg: string; accent: string; bordered: boolean };

const schemes: Scheme[] = [
  { bg: "#111111", fg: "#F7F5F0", accent: "#D7FF64", bordered: false },
  { bg: "#F7F5F0", fg: "#111111", accent: "#D7FF64", bordered: true },
  { bg: "#D7FF64", fg: "#111111", accent: "#111111", bordered: false },
  { bg: "#FFFFFF", fg: "#111111", accent: "#D7FF64", bordered: true },
  { bg: "#111111", fg: "#D7FF64", accent: "#F7F5F0", bordered: false },
];

/**
 * Parametric mini-artwork for service cards — each card gets a distinct
 * composition, palette, and letterform so the grid never looks templated.
 */
export default function ServiceArt({ seed, title }: ServiceArtProps) {
  const s = schemes[seed % schemes.length];
  const variant = seed % 5;
  const letter = title.charAt(0).toUpperCase();
  const stroke = s.bordered ? s.fg : s.fg;
  const borderRect = s.bordered ? (
    <rect x="1" y="1" width="398" height="298" fill="none" stroke="#111111" strokeOpacity="0.12" />
  ) : null;

  const art = (() => {
    switch (variant) {
      case 0:
        // Orb + text bars
        return (
          <>
            <circle cx="290" cy="150" r="92" fill="none" stroke={s.fg} strokeWidth="2" opacity="0.9" />
            <circle cx="290" cy="150" r="58" fill={s.accent} />
            <rect x="48" y="96" width="150" height="14" rx="7" fill={s.fg} />
            <rect x="48" y="126" width="112" height="14" rx="7" fill={s.fg} opacity="0.55" />
            <rect x="48" y="156" width="132" height="14" rx="7" fill={s.fg} opacity="0.3" />
            <rect x="48" y="204" width="34" height="34" fill={s.accent} />
          </>
        );
      case 1:
        // Giant letter
        return (
          <>
            <circle cx="316" cy="84" r="70" fill={s.accent} />
            <text
              x="36"
              y="268"
              fontFamily="'Space Grotesk', sans-serif"
              fontSize="230"
              fontWeight="700"
              fill={s.fg}
            >
              {letter}
            </text>
            <rect x="40" y="282" width="120" height="6" fill={s.accent} />
          </>
        );
      case 2:
        // Diagonal band + circle
        return (
          <>
            <rect
              x="-60"
              y="150"
              width="520"
              height="64"
              fill={s.accent}
              transform="rotate(-18 200 150)"
            />
            <circle cx="96" cy="86" r="46" fill="none" stroke={stroke} strokeWidth="2" />
            <rect x="236" y="196" width="120" height="12" rx="6" fill={s.fg} opacity="0.8" />
            <rect x="236" y="220" width="84" height="12" rx="6" fill={s.fg} opacity="0.4" />
          </>
        );
      case 3:
        // Grid of squares
        return (
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              const col = i % 4;
              const row = Math.floor(i / 4);
              const filled = i % 3 === 0;
              return (
                <rect
                  key={i}
                  x={64 + col * 72}
                  y={54 + row * 72}
                  width="52"
                  height="52"
                  fill={filled ? s.accent : "none"}
                  stroke={filled ? "none" : s.fg}
                  strokeOpacity={filled ? undefined : 0.35}
                  strokeWidth="2"
                />
              );
            })}
          </>
        );
      case 4:
      default:
        // Concentric rings + crosshair
        return (
          <>
            <circle cx="200" cy="150" r="104" fill="none" stroke={s.fg} strokeWidth="2" opacity="0.9" />
            <circle cx="200" cy="150" r="72" fill="none" stroke={s.fg} strokeWidth="2" opacity="0.5" />
            <circle cx="200" cy="150" r="40" fill={s.accent} />
            <line x1="200" y1="10" x2="200" y2="290" stroke={s.fg} strokeWidth="1.5" opacity="0.3" />
            <line x1="60" y1="150" x2="340" y2="150" stroke={s.fg} strokeWidth="1.5" opacity="0.3" />
            <text
              x="200"
              y="158"
              textAnchor="middle"
              fontFamily="'Space Grotesk', sans-serif"
              fontSize="26"
              fontWeight="700"
              fill={s.bg === "#D7FF64" ? "#111111" : "#111111"}
            >
              {letter}
            </text>
          </>
        );
    }
  })();

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Abstract mini artwork for ${title}`}
      className="block h-auto w-full"
    >
      <rect width="400" height="300" fill={s.bg} />
      {art}
      {borderRect}
    </svg>
  );
}
