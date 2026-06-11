interface EventimLogoProps {
  size?: number
  className?: string
}

/**
 * Eventim Text-Based Logo (Minimalist Professional)
 * 
 * A high-fidelity wordmark leveraging typographic weight contrast 
 * and color accents for a clean, institutional identity.
 */
export function EventimLogo({
  size = 20,
  className = "",
}: EventimLogoProps) {
  return (
    <div 
      className={`inline-flex items-center select-none cursor-default ${className}`}
      style={{ 
        fontFamily: "'Geist Variable', sans-serif",
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.04em"
      }}
    >
      <span className="font-extrabold text-foreground">EVENT</span>
      <span className="font-light text-primary">IM</span>
      
      {/* Precision design element: A small vertical bar for institutional structure */}
      <div className="ml-2 w-px h-[0.8em] bg-border" />
      <span className="ml-2 text-[0.45em] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Hub
      </span>
    </div>
  )
}
