import { LoadingBlock } from '@/components/ui/LoadingBlock'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { canPreviewThumbnail, resolveThumbnailUrl } from '@/lib/thumbnailUrl'
import type { Certificate } from '@/types'
import { Award, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'

function CertificateCard({ cert }: { cert: Certificate }) {
  const thumb = resolveThumbnailUrl(cert.thumbnail)
  const showThumb = canPreviewThumbnail(cert.thumbnail)
  const viewUrl = cert.credentialUrl?.trim() || ''

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/40">
        {showThumb && thumb ? (
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        ) : (
          <Award className="h-14 w-14 text-primary/60" strokeWidth={1.25} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {cert.category}
        </span>
        <h3 className="mt-1 text-base font-bold text-slate-900">{cert.title}</h3>
        {cert.subtitle ? (
          <p className="text-sm text-slate-500">{cert.subtitle}</p>
        ) : null}
        <p className="mt-2 text-sm text-slate-600">{cert.issuer}</p>
        {cert.issuedDate ? (
          <p className="mt-1 text-xs text-slate-400">{formatDate(cert.issuedDate)}</p>
        ) : null}
        {viewUrl ? (
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            View
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="mt-4 text-sm text-slate-400">Credential on file</span>
        )}
      </div>
    </article>
  )
}

export function CertificatesSection() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getCertificates()
      .then(setCerts)
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'Failed to load certificates'),
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="certificates" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          title="Certificates"
          subtitle="Professional certifications and academic achievements."
        />
        {loading ? <LoadingBlock /> : null}
        {error ? (
          <p className="mt-8 text-center text-sm text-red-600">{error}</p>
        ) : null}
        {!loading && !error ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
