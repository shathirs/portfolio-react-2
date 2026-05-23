import { Award, FileText } from 'lucide-react'
import { useState } from 'react'
import {
  isCertificatePdf,
  resolveCertificateMediaUrl,
  type CertificateMediaType,
} from '@/lib/certificateMedia'
import { canPreviewThumbnail } from '@/lib/thumbnailUrl'

interface CertificateThumbnailProps {
  thumbnail?: string
  thumbnailType?: CertificateMediaType
  title: string
  className?: string
}

export function CertificateThumbnail({
  thumbnail,
  thumbnailType = 'image',
  title,
  className = 'h-12 w-16 shrink-0 rounded-md object-cover',
}: CertificateThumbnailProps) {
  const [failed, setFailed] = useState(false)
  const isPdf = isCertificatePdf(thumbnail, thumbnailType)
  const src = resolveCertificateMediaUrl(thumbnail, thumbnailType)
  const showMedia = src && !failed && canPreviewThumbnail(thumbnail, thumbnailType)

  if (!showMedia) {
    return (
      <div
        className={[
          'flex shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary',
          className.includes('h-32') ? 'h-32 w-full' : 'h-12 w-16',
        ].join(' ')}
      >
        {isPdf ? (
          <FileText className={className.includes('h-32') ? 'h-10 w-10' : 'h-5 w-5'} strokeWidth={1.75} />
        ) : (
          <Award className={className.includes('h-32') ? 'h-10 w-10' : 'h-5 w-5'} strokeWidth={1.75} />
        )}
      </div>
    )
  }

  if (isPdf) {
    return (
      <iframe
        title={title}
        src={src}
        className={[className, 'border border-border bg-white'].join(' ')}
      />
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
