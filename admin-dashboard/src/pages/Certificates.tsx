import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CertificateFormModal } from '@/components/certificates/CertificateFormModal'
import { CertificateStatCards } from '@/components/certificates/CertificateStatCards'
import { CertificatesTable } from '@/components/certificates/CertificatesTable'
import { Button } from '@/components/ui/Button'
import { PageError, PageLoader } from '@/components/ui/PageLoader'
import { useCertificates } from '@/context/CertificatesContext'

export function Certificates() {
  const { loading, error, stats, refresh } = useCertificates()
  const [showAdd, setShowAdd] = useState(false)

  if (loading) return <PageLoader label="Loading certificates…" />
  if (error) return <PageError message={error} onRetry={refresh} />
  if (!stats) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Manage all your certificates.</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add New Certificate
        </Button>
      </div>

      <CertificateStatCards stats={stats} />
      <CertificatesTable />

      <CertificateFormModal
        open={showAdd}
        certificate={null}
        onClose={() => setShowAdd(false)}
      />
    </div>
  )
}
