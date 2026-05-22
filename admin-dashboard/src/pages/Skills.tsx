import { Plus } from 'lucide-react'
import { useState } from 'react'
import { SkillsTable } from '@/components/skills/SkillsTable'
import { SkillFormModal } from '@/components/skills/SkillFormModal'
import { Button } from '@/components/ui/Button'
import { PageError, PageLoader } from '@/components/ui/PageLoader'
import { useSkills } from '@/context/SkillsContext'

export function Skills() {
  const { loading, error, refresh } = useSkills()
  const [showAdd, setShowAdd] = useState(false)

  if (loading) return <PageLoader label="Loading skills…" />
  if (error) return <PageError message={error} onRetry={refresh} />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Manage technical skills and proficiency levels for your portfolio.
        </p>
        <Button className="gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add New Skill
        </Button>
      </div>

      <SkillsTable />

      <SkillFormModal open={showAdd} skill={null} onClose={() => setShowAdd(false)} />
    </div>
  )
}
