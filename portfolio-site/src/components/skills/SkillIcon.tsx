import { getSkillIconUrl } from '@/lib/skillIcons'
import { useEffect, useMemo, useState } from 'react'

type SkillIconProps = {
  name: string
  icon?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const boxClasses = {
  sm: 'h-12 w-12 rounded-xl',
  md: 'h-14 w-14 rounded-xl',
  lg: 'h-16 w-16 rounded-2xl',
}

export function SkillIcon({ name, icon, size = 'lg' }: SkillIconProps) {
  const primaryUrl = useMemo(() => getSkillIconUrl(name, icon), [name, icon])
  const nameOnlyUrl = useMemo(() => getSkillIconUrl(name), [name])

  const [imgSrc, setImgSrc] = useState<string | null>(primaryUrl)

  useEffect(() => {
    setImgSrc(primaryUrl)
  }, [primaryUrl])

  const showLetter = !imgSrc

  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-slate-50 ring-1 ring-slate-100 ${boxClasses[size]}`}
    >
      {showLetter ? (
        <span className="text-lg font-bold text-primary">{name.charAt(0)}</span>
      ) : (
        <img
          src={imgSrc}
          alt={`${name} logo`}
          className={`object-contain p-1.5 ${sizeClasses[size]}`}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (icon?.trim() && nameOnlyUrl && imgSrc !== nameOnlyUrl) {
              setImgSrc(nameOnlyUrl)
            } else {
              setImgSrc(null)
            }
          }}
        />
      )}
    </span>
  )
}
