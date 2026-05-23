import { Calendar, Eye, Pencil, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Pagination } from '@/components/ui/Pagination'
import { categoryBadgeStyles, certificateCategories } from '@/config/certificateCategories'
import { CertificateFormModal } from '@/components/certificates/CertificateFormModal'
import { CertificateThumbnail } from '@/components/certificates/CertificateThumbnail'
import { CertificateViewModal } from '@/components/certificates/CertificateViewModal'
import { useCertificates } from '@/context/CertificatesContext'
import { formatDate } from '@/lib/formatDate'
import type { Certificate } from '@/types'

const PAGE_SIZE = 6

export function CertificatesTable() {
  const { certificates, deleteCertificate } = useCertificates()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [formCert, setFormCert] = useState<Certificate | 'new' | null>(null)
  const [viewCert, setViewCert] = useState<Certificate | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return certificates.filter((c) => {
      const matchCategory =
        categoryFilter === 'all' || c.category === categoryFilter
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        (c.subtitle ?? '').toLowerCase().includes(q)
      return matchCategory && matchSearch
    })
  }, [certificates, search, categoryFilter])

  const currentPage = Math.min(
    Math.max(1, page),
    Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  )

  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  )

  const editingCert = formCert && formCert !== 'new' ? formCert : null

  return (
    <>
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-slate-900">All Certificates</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                placeholder="Search certificates…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="w-full rounded-lg border border-border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="all">All Categories</option>
              {certificateCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50/80">
                <th className="px-6 py-3.5 font-semibold text-slate-700">Certificate</th>
                <th className="px-6 py-3.5 font-semibold text-slate-700">Category</th>
                <th className="px-6 py-3.5 font-semibold text-slate-700">Issuer</th>
                <th className="px-6 py-3.5 font-semibold text-slate-700">Issued Date</th>
                <th className="px-6 py-3.5 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3.5 text-right font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map((cert) => (
                <tr key={cert.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <CertificateThumbnail
                        thumbnail={cert.thumbnail}
                        thumbnailType={cert.thumbnailType}
                        title={cert.title}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{cert.title}</p>
                        {cert.subtitle ? (
                          <p className="text-xs text-muted">{cert.subtitle}</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={[
                        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                        categoryBadgeStyles[cert.category],
                      ].join(' ')}
                    >
                      {cert.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">{cert.issuer}</td>
                  <td className="px-6 py-4">
                    {cert.issuedDate ? (
                      <span className="inline-flex items-center gap-1.5 text-muted">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(cert.issuedDate)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={cert.status} dot>
                      {cert.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setFormCert(cert)}
                        className="rounded-lg p-2 text-muted hover:bg-indigo-50 hover:text-primary"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewCert(cert)}
                        className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-slate-700"
                        aria-label="View"
                      >
                        <Eye className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(cert)}
                        className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted">
            No certificates found.
          </p>
        ) : (
          <Pagination
            page={page}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            itemLabel="certificates"
          />
        )}
      </div>

      <CertificateFormModal
        open={formCert !== null}
        certificate={editingCert}
        onClose={() => setFormCert(null)}
      />

      <CertificateViewModal
        certificate={viewCert}
        onClose={() => setViewCert(null)}
        onEdit={() => {
          if (viewCert) {
            setFormCert(viewCert)
            setViewCert(null)
          }
        }}
      />

      <Modal
        open={!!deleteTarget}
        title="Delete certificate?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be moved to deleted. You can restore it later from the database.`
            : undefined
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) await deleteCertificate(deleteTarget.id)
          setDeleteTarget(null)
        }}
        confirmLabel="Delete"
      />
    </>
  )
}
