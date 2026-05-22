import { Award } from 'lucide-react'
import { useState } from 'react'
import { canPreviewThumbnail, resolveThumbnailUrl } from '@/lib/thumbnailUrl'

interface CertificateThumbnailProps {
  thumbnail?: string
  title: string
  className?: string
}

export function CertificateThumbnail({
  thumbnail,
  title,
  className = 'h-12 w-16 shrink-0 rounded-md object-cover',
}: CertificateThumbnailProps) {
  const [failed, setFailed] = useState(false)
  const src = resolveThumbnailUrl(thumbnail)
  const showImage = src && !failed && canPreviewThumbnail(thumbnail)

  if (!showImage) {
    return (
      <div
        className={[
          'flex shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary',
          className.includes('h-32') ? 'h-32 w-full' : 'h-12 w-16',
        ].join(' ')}
      >
        <Award className={className.includes('h-32') ? 'h-10 w-10' : 'h-5 w-5'} strokeWidth={1.75} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={title}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
