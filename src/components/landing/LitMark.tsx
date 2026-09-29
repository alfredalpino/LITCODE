/** LITCODE mark — open practice loop with deliberate break. Uses currentColor. */
export function LitMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M44.8 14.6c8.6 3.4 14.7 11.7 14.7 21.6 0 12.7-10.3 23-23 23S13.5 49 13.5 36.2 23.8 13.2 36.5 13.2"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="square"
      />
      <rect
        x="41.5"
        y="11.2"
        width="7.5"
        height="7.5"
        rx="1"
        fill="currentColor"
        transform="rotate(28 45.25 14.95)"
      />
    </svg>
  );
}
