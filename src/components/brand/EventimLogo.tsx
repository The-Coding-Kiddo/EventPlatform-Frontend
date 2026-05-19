interface EventimLogoProps {
  size?: number
  showWordmark?: boolean
  className?: string
}

/**
 * Eventim brand logo.
 *
 * Mark: a 4-pointed sparkle (✦) inside a blue→violet gradient rounded square.
 *       The sparkle is clean, geometric, and reads perfectly from 16 px to 128 px.
 *
 * Wordmark: "Eventim" bold in Geist Variable, with the leading "E" in primary blue.
 */
export function EventimLogo({
  size = 32,
  showWordmark = true,
  className = "",
}: EventimLogoProps) {
  const markId = "evt-mark-grad"
  const fs = Math.round(size * 0.65)

  return (
    <span
      className={`inline-flex items-center select-none ${className}`}
      style={{ gap: Math.round(size * 0.3) }}
    >
      {/* ── Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={markId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* Badge background */}
        <rect width="40" height="40" rx="11" fill={`url(#${markId})`} />

        {/*
          4-pointed sparkle ✦
          The cubic-bezier control points pull each arm inward so the
          sides are concave, creating the classic "sparkle" silhouette.
          Center: 20,20  Outer tips: top 20,5  right 35,20  bottom 20,35  left 5,20
        */}
        <path
          d="
            M 20 5
            C 21.8 13.2  26.8 18.2  35 20
            C 26.8 21.8  21.8 26.8  20 35
            C 18.2 26.8  13.2 21.8  5  20
            C 13.2 18.2  18.2 13.2  20 5
            Z
          "
          fill="white"
          fillOpacity="0.95"
        />
      </svg>

      {/* ── Wordmark ── */}
      {showWordmark && (
        <span
          style={{
            fontFamily: "'Geist Variable', 'Inter', sans-serif",
            fontSize: fs,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#3b82f6" }}>E</span>
          <span>ventim</span>
        </span>
      )}
    </span>
  )
}
