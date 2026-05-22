import { useId } from 'react'

interface LogoIconProps {
  className?: string
  size?: number
}

/** Portfo. brand mark — gradient tile with monogram */
export function LogoIcon({ className = '', size = 36 }: LogoIconProps) {
  const uid = useId().replace(/:/g, '')
  const bgId = `logo-bg-${uid}`
  const ringId = `logo-ring-${uid}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect width="40" height="40" rx="11" fill={`url(#${bgId})`} />
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="10"
        stroke={`url(#${ringId})`}
        strokeWidth="1.5"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M13 11h9.5c3.59 0 6.5 2.69 6.5 6s-2.91 6-6.5 6H17v6h-4V11zm4 9.2c1.77 0 3.2-1.32 3.2-3.2s-1.43-3.2-3.2-3.2H17v6.4h4z"
        fill="#fff"
      />
      <circle cx="30" cy="12" r="2.5" fill="#a5b4fc" opacity="0.9" />
      <defs>
        <linearGradient id={bgId} x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id={ringId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c7d2fe" />
          <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
