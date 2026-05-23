import { Calendar, ExternalLink, X } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { categoryBadgeStyles } from '@/config/certificateCategories'
import { CertificateThumbnail } from '@/components/certificates/CertificateThumbnail'
import { formatDate } from '@/lib/formatDate'
import type { Certificate } from '@/types'

interface CertificateViewModalProps {
  certificate: Certificate | null
  onClose: () => void
  onEdit: () => void
}

export function CertificateViewModal({
  certificate,
  onClose,
  onEdit,
}: CertificateViewModalProps) {
  if (!certificate) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-muted hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <CertificateThumbnail
          thumbnail={certificate.thumbnail}
          thumbnailType={certificate.thumbnailType}
          title={certificate.title}
          className="mb-4 h-32 w-full rounded-lg object-cover"
        />

        <h3 className="text-xl font-semibold text-slate-900">{certificate.title}</h3>
        {certificate.subtitle ? (
          <p className="mt-1 text-sm text-muted">{certificate.subtitle}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={[
              'rounded-full px-2.5 py-0.5 text-xs font-medium',
              categoryBadgeStyles[certificate.category],
            ].join(' ')}
          >
            {certificate.category}
          </span>
          <Badge variant={certificate.status} dot>
            {certificate.status}
          </Badge>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-muted">Issuer</dt>
            <dd className="font-medium text-slate-900">{certificate.issuer}</dd>
          </div>
          {certificate.issuedDate ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted" />
              <dd className="text-slate-700">{formatDate(certificate.issuedDate)}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={onEdit}>
            Edit
          </Button>
          {certificate.credentialUrl ? (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              View Credential
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
