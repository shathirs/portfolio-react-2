import { Plus } from 'lucide-react'
import { useState } from 'react'
import { EducationTable } from '@/components/education/EducationTable'
import { EducationFormModal } from '@/components/education/EducationFormModal'
import { Button } from '@/components/ui/Button'
import { PageError, PageLoader } from '@/components/ui/PageLoader'
import { useEducation } from '@/context/EducationContext'

export function Education() {
  const { loading, error, refresh, entries } = useEducation()
  const [showAdd, setShowAdd] = useState(false)

  if (loading) return <PageLoader label="Loading education…" />
  if (error) return <PageError message={error} onRetry={refresh} />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Manage your academic timeline — {entries.length} entr
          {entries.length === 1 ? 'y' : 'ies'} synced to the public portfolio.
        </p>
        <Button className="gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add education
        </Button>
      </div>

      <EducationTable />

      <EducationFormModal open={showAdd} entry={null} onClose={() => setShowAdd(false)} />
    </div>
  )
}
