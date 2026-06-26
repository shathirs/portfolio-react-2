import { useEffect, useState } from 'react'
import { DEFAULT_PROFILE_IMAGE } from '@/lib/profileImage'

type ProfilePhotoProps = {
  src: string
  alt: string
  className?: string
}

export function ProfilePhoto({ src, alt, className }: ProfilePhotoProps) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== DEFAULT_PROFILE_IMAGE) {
          setImgSrc(DEFAULT_PROFILE_IMAGE)
        }
      }}
    />
  )
}
