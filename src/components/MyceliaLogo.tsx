interface MyceliaLogoProps {
  size?: number
  color?: string
  className?: string
}

/**
 * Minimal mycelium mark — a central node with 5 branching threads radiating
 * outward, suggesting the fungal network. Works as icon and favicon base.
 */
export function MyceliaLogo({ size = 28, color = 'currentColor', className }: MyceliaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Central node */}
      <circle cx="14" cy="14" r="2" fill={color} />

      {/* Main branches — 5 threads like mycelium hyphae */}
      {/* Top-left */}
      <path d="M13 13 L6 7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="7" r="1" fill={color} />

      {/* Top */}
      <path d="M14 12 L14 4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="14" cy="4" r="1" fill={color} />

      {/* Top-right */}
      <path d="M15 13 L22 7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="22" cy="7" r="1" fill={color} />

      {/* Bottom-left */}
      <path d="M13 15 L5 21" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="5" cy="21" r="1" fill={color} />

      {/* Bottom-right */}
      <path d="M15 15 L23 21" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="23" cy="21" r="1" fill={color} />

      {/* Sub-branches for organic feel */}
      <path d="M10 10 L7 12" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M18 10 L21 12" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <path d="M14 8 L11 6" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
