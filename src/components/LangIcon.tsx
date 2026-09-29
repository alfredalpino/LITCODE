import type { CSSProperties } from "react";

/**
 * Inline, brand-colored language logos for the Labs pills / switcher.
 * Replaces the generic </> Code2 glyph with recognizable marks.
 *
 * Keyed by the catalog `lab.language` value (falls back by id for python-dsa).
 * All marks render at a consistent box (~16–20px) and carry their own brand
 * colors, so they read well on the Tokyo Night dark panel and on the active
 * (white-text) pill alike. Kept intentionally compact — no external assets.
 */

export type LangIconKey =
  | "javascript"
  | "typescript"
  | "python"
  | "ruby"
  | "rust"
  | "cpp"
  | "c"
  | "java"
  | "go"
  | "kotlin"
  | "swift"
  | "php"
  | "csharp";

interface LangIconProps {
  lang: string;
  size?: number;
  className?: string;
}

/** Normalize catalog language/id strings to an icon key. */
export function langIconToKey(lang: string): LangIconKey | null {
  const l = lang.toLowerCase();
  if (l === "javascript" || l === "js") return "javascript";
  if (l === "typescript" || l === "ts") return "typescript";
  if (l.startsWith("python") || l === "py") return "python";
  if (l === "ruby" || l === "rb") return "ruby";
  if (l === "rust" || l === "rs") return "rust";
  if (l === "cpp" || l === "c++" || l === "cxx") return "cpp";
  if (l === "c") return "c";
  if (l === "java") return "java";
  if (l === "go" || l === "golang") return "go";
  if (l === "kotlin" || l === "kt") return "kotlin";
  if (l === "swift") return "swift";
  if (l === "php") return "php";
  if (l === "csharp" || l === "c#" || l === "cs") return "csharp";
  return null;
}

/** Rounded badge used for the letterform marks (JS / TS / C). */
function Badge({
  size,
  fill,
  text,
  color,
  fontSize,
}: {
  size: number;
  fill: string;
  text: string;
  color: string;
  fontSize: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1" y="1" width="22" height="22" rx="4" fill={fill} />
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontWeight="700"
        fontSize={fontSize}
        fill={color}
      >
        {text}
      </text>
    </svg>
  );
}

export function LangIcon({ lang, size = 18, className }: LangIconProps) {
  const key = langIconToKey(lang);
  const style: CSSProperties = { flex: "0 0 auto", display: "inline-block" };
  const wrap = (node: React.ReactNode) => (
    <span className={className} style={style} aria-hidden="true">
      {node}
    </span>
  );

  switch (key) {
    case "javascript":
      return wrap(
        <Badge size={size} fill="#f7df1e" text="JS" color="#111" fontSize={9} />
      );
    case "typescript":
      return wrap(
        <Badge size={size} fill="#3178c6" text="TS" color="#fff" fontSize={9} />
      );
    case "c":
      return wrap(
        <Badge size={size} fill="#5c6bc0" text="C" color="#fff" fontSize={11} />
      );
    case "cpp":
      // Official-style C++ shield; the "C" and "++" read as negative space
      // (evenodd holes) so the dark pill shows through the letterforms.
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#00599c"
            fillRule="evenodd"
            d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z"
          />
        </svg>
      );
    case "python":
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#3776ab"
            d="M63.4 2.3c-5 0-9.8.4-13.1 1.2C39.7 5.4 37.9 9.1 37.9 16.2v9.4h25.9v3.3H28.2c-7.1 0-13.4 4.3-15.3 12.5-2.3 9.4-2.4 15.3 0 25.1 1.8 7.3 5.9 12.5 13 12.5h8.9V76.3c0-8.1 7-15.2 15.3-15.2h25.8c6.8 0 12.2-5.6 12.2-12.4V16.2c0-6.6-5.6-11.6-12.2-12.7-4.2-.7-8.5-1.1-12.5-1.2zM49.5 10.2c2.7 0 4.9 2.2 4.9 5 0 2.7-2.2 4.9-4.9 4.9-2.7 0-4.9-2.2-4.9-4.9 0-2.8 2.2-5 4.9-5z"
          />
          <path
            fill="#ffd343"
            d="M89.9 28.9v11.5c0 8.4-7.2 15.5-15.3 15.5H48.8c-6.7 0-12.2 5.7-12.2 12.4v23.3c0 6.6 5.8 10.5 12.2 12.4 7.7 2.3 15.1 2.7 24.3 0 6.1-1.8 12.2-5.3 12.2-12.4v-9.4H61.4v-3.3h34.4c7.1 0 9.8-5 12.3-12.5 2.6-7.7 2.5-15.1 0-25.1-1.6-6.4-5.2-12.5-12.3-12.5h-6zm-14.5 62.3c2.7 0 4.9 2.2 4.9 4.9 0 2.8-2.2 5-4.9 5s-4.9-2.2-4.9-5c0-2.7 2.2-4.9 4.9-4.9z"
          />
        </svg>
      );
    case "ruby":
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <polygon points="12,2 22,9 12,22 2,9" fill="#cc342d" />
          <path
            d="M2 9 H22 M12 2 L7 9 L12 22 M12 2 L17 9 L12 22"
            stroke="#9b111e"
            strokeWidth="0.7"
            fill="none"
          />
          <path d="M12 2 L2 9 L7 9 Z" fill="#e0554d" />
          <path d="M12 2 L22 9 L17 9 Z" fill="#b3251f" />
        </svg>
      );
    case "rust":
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <g stroke="#dea584" strokeWidth="1.6" fill="none">
            <circle cx="12" cy="12" r="6.4" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              const x1 = 12 + Math.cos(a) * 6.4;
              const y1 = 12 + Math.sin(a) * 6.4;
              const x2 = 12 + Math.cos(a) * 9;
              const y2 = 12 + Math.sin(a) * 9;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
          <text
            x="12"
            y="12.5"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            fontWeight="700"
            fontSize="7"
            fill="#dea584"
          >
            R
          </text>
        </svg>
      );
    case "java":
      // Official-style Java "steaming coffee cup" (Duke's cup): red steam
      // curls over a blue cup + saucer. Trademark-safe recreation.
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#0074BD"
            d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"
          />
          <path
            fill="#EA2D2E"
            d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"
          />
          <path
            fill="#0074BD"
            d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"
          />
          <path
            fill="#EA2D2E"
            d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"
          />
          <path
            fill="#0074BD"
            d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"
          />
        </svg>
      );
    case "go":
      // Simplified Go gopher: cyan head, wide eyes, buck teeth. A friendly
      // recreation of the mascot (not the stock raster), readable at ~16px.
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          {/* ears */}
          <ellipse cx="8" cy="4.6" rx="1.9" ry="2.3" fill="#00add8" />
          <ellipse cx="16" cy="4.6" rx="1.9" ry="2.3" fill="#00add8" />
          <ellipse cx="8" cy="4.8" rx="0.8" ry="1.1" fill="#0b6f88" />
          <ellipse cx="16" cy="4.8" rx="0.8" ry="1.1" fill="#0b6f88" />
          {/* head */}
          <rect x="3.4" y="4" width="17.2" height="17" rx="8.6" fill="#00add8" />
          {/* eye whites */}
          <circle cx="9.2" cy="10" r="3.4" fill="#fff" stroke="#0a2a33" strokeWidth="0.5" />
          <circle cx="14.8" cy="10" r="3.4" fill="#fff" stroke="#0a2a33" strokeWidth="0.5" />
          {/* pupils (toward center) */}
          <circle cx="10.4" cy="10.2" r="1.25" fill="#0a2540" />
          <circle cx="13.6" cy="10.2" r="1.25" fill="#0a2540" />
          {/* nose */}
          <ellipse cx="12" cy="13" rx="1" ry="0.8" fill="#23405a" />
          {/* buck teeth */}
          <rect
            x="10.9"
            y="13.7"
            width="2.2"
            height="2.4"
            rx="0.4"
            fill="#fff"
            stroke="#0a2a33"
            strokeWidth="0.4"
          />
          <line x1="12" y1="13.9" x2="12" y2="15.9" stroke="#0a2a33" strokeWidth="0.4" />
        </svg>
      );
    case "kotlin":
      // Official Kotlin mark: folded square with the brand diagonal gradient
      // (coral → magenta → violet). Not a "Kt" letter badge.
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="lc-kotlin-grad"
              x1="500.003"
              x2="-.097"
              y1="579.106"
              y2="1079.206"
              gradientTransform="translate(15.534 -96.774) scale(.1939)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".003" stopColor="#e44857" />
              <stop offset=".469" stopColor="#c711e1" />
              <stop offset="1" stopColor="#7f52ff" />
            </linearGradient>
          </defs>
          <path
            fill="url(#lc-kotlin-grad)"
            d="M112.484 112.484H15.516V15.516h96.968L64 64Zm0 0"
          />
        </svg>
      );
    case "swift":
      // Official-style Swift bird: white swift on the brand orange rounded
      // square. Not a "Sw" letter badge.
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#f05138"
            d="M126.33 34.06a39.32 39.32 0 00-.79-7.83 28.78 28.78 0 00-2.65-7.58 28.84 28.84 0 00-4.76-6.32 23.42 23.42 0 00-6.62-4.55 27.27 27.27 0 00-7.68-2.53c-2.65-.51-5.56-.51-8.21-.76H30.25a45.46 45.46 0 00-6.09.51 21.82 21.82 0 00-5.82 1.52c-.53.25-1.32.51-1.85.76a33.82 33.82 0 00-5 3.28c-.53.51-1.06.76-1.59 1.26a22.41 22.41 0 00-4.76 6.32 23.61 23.61 0 00-2.65 7.58 78.5 78.5 0 00-.79 7.83v60.39a39.32 39.32 0 00.79 7.83 28.78 28.78 0 002.65 7.58 28.84 28.84 0 004.76 6.32 23.42 23.42 0 006.62 4.55 27.27 27.27 0 007.68 2.53c2.65.51 5.56.51 8.21.76h63.22a45.08 45.08 0 008.21-.76 27.27 27.27 0 007.68-2.53 30.13 30.13 0 006.62-4.55 22.41 22.41 0 004.76-6.32 23.61 23.61 0 002.65-7.58 78.49 78.49 0 00.79-7.83V34.06z"
          />
          <path
            fill="#fefefe"
            d="M85 96.5c-11.11 6.13-26.38 6.76-41.75.47A64.53 64.53 0 0113.84 73a50 50 0 0010.85 6.32c15.87 7.1 31.73 6.61 42.9 0-15.9-11.66-29.4-26.82-39.46-39.2a43.47 43.47 0 01-5.29-6.82c12.16 10.61 31.5 24 38.38 27.79a271.77 271.77 0 01-27-32.34 266.8 266.8 0 0044.47 34.87c.71.38 1.26.7 1.7 1a32.7 32.7 0 001.21-3.51c3.71-12.89-.53-27.54-9.79-39.67C93.25 33.81 106 57.05 100.66 76.51c-.14.53-.29 1-.45 1.55l.19.22c10.59 12.63 7.68 26 6.35 23.5C101 91 90.37 94.33 85 96.5z"
          />
        </svg>
      );
    case "php":
      // Simplified elePHPant: the PHP elephant mascot in brand violet-blue.
      // Trademark-safe recreation, not the "php" wordmark.
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          {/* body + head */}
          <path
            fill="#777bb4"
            d="M3.6 12.4c0-3.3 3.1-5.9 7.4-5.9 3.2 0 5.9 1.3 7.3 3.4.7-.2 1.6-.1 2.2.5.8.8.8 2 .2 2.9-.4.6-1.1.9-1.8.9-.2 1-.7 1.9-1.5 2.6v2.2c0 .5-.4.9-.9.9h-1.3c-.5 0-.9-.4-.9-.9v-.7c-.9.2-1.9.3-2.9.3-.8 0-1.5-.1-2.2-.2v.6c0 .5-.4.9-.9.9H6.9c-.5 0-.9-.4-.9-.9v-2.1c-1.5-1.1-2.4-2.7-2.4-4.5z"
          />
          {/* ear */}
          <path
            fill="#4f5b93"
            d="M9.4 8.4c1.4-.3 2.4.4 2.7 1.7.3 1.3-.4 2.5-1.6 2.8-1.1.3-2-.2-2.4-1.2-.5-1.3.1-2.8 1.3-3.3z"
          />
          {/* eye */}
          <circle cx="9.4" cy="9.7" r="0.9" fill="#fff" />
          <circle cx="9.5" cy="9.7" r="0.45" fill="#1c2233" />
          {/* trunk */}
          <path
            fill="#777bb4"
            d="M4.2 13.6c-.9.1-1.7.6-1.7 1.6 0 .7.5 1.2 1.1 1.2.5 0 .9-.3 1-.8.1-.5.1-1 .2-1.5z"
          />
        </svg>
      );
    case "csharp":
      // Official-style C# mark: violet hexagon badge with a white "C#".
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 128 128"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#9B4F96"
            d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"
          />
          <path
            fill="#68217A"
            d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"
          />
          <path
            fill="#fff"
            d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.1h3.8l1.2-6.1h4.8l-1.2 6.1h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6h-4.9l1.2-6h-3.8l-1.2 6h-4.8l1.2-6h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z"
          />
        </svg>
      );
    default:
      // Unknown language — neutral code glyph so nothing renders blank.
      return wrap(
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          role="img"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="8 6 3 12 8 18" />
          <polyline points="16 6 21 12 16 18" />
        </svg>
      );
  }
}
