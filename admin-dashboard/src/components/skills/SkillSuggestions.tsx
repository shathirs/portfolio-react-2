import { Sparkles } from 'lucide-react'
import { categoryBadgeStyles } from '@/config/skillCategories'
import {
  filterSkillRecommendations,
  type SkillRecommendation,
} from '@/data/skillRecommendations'
import { getSkillIconUrl } from '@/lib/skillIcons'
import type { SkillCategory } from '@/types'

type SkillSuggestionsProps = {
  query: string
  existingNames: string[]
  onSelect: (rec: SkillRecommendation) => void
  showWhenEmpty?: boolean
  aiSuggestions?: SkillRecommendation[]
  aiLoading?: boolean
  aiError?: string | null
  aiConfigured?: boolean
}

function SuggestionRow({
  rec,
  onSelect,
  ai,
}: {
  rec: SkillRecommendation
  onSelect: (rec: SkillRecommendation) => void
  ai?: boolean
}) {
  const iconUrl = getSkillIconUrl(rec.name, rec.icon)
  return (
    <li role="option">
      <button
        type="button"
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-indigo-50"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(rec)}
      >
        {iconUrl ? (
          <img src={iconUrl} alt="" className="h-8 w-8 shrink-0 object-contain" />
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-primary">
            {rec.name.charAt(0)}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-slate-900">
            {rec.name}
            {ai ? (
              <Sparkles className="ml-1 inline h-3 w-3 text-violet-500" aria-hidden />
            ) : null}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <span
              className={[
                'inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold',
                categoryBadgeStyles[rec.category as SkillCategory],
              ].join(' ')}
            >
              {rec.category}
            </span>
            {rec.defaultPercentage != null ? (
              <span className="text-[10px] text-muted">{rec.defaultPercentage}%</span>
            ) : null}
          </span>
          {rec.reason ? (
            <span className="mt-0.5 block truncate text-[10px] text-slate-500">
              {rec.reason}
            </span>
          ) : null}
        </span>
      </button>
    </li>
  )
}

export function SkillSuggestions({
  query,
  existingNames,
  onSelect,
  showWhenEmpty = true,
  aiSuggestions = [],
  aiLoading = false,
  aiError = null,
  aiConfigured = false,
}: SkillSuggestionsProps) {
  const staticResults = filterSkillRecommendations(query, existingNames)
    .filter((s) => !aiSuggestions.some((a) => a.name.toLowerCase() === s.name.toLowerCase()))
    .slice(0, 8)

  const hasAi = aiSuggestions.length > 0
  const hasStatic = staticResults.length > 0
  const showPanel =
    aiLoading ||
    hasAi ||
    hasStatic ||
    (query.trim() && !hasAi && !hasStatic) ||
    (showWhenEmpty && !query.trim())

  if (!showPanel) return null

  return (
    <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-border bg-white shadow-lg">
      {aiLoading ? (
        <p className="flex items-center gap-2 border-b border-border bg-violet-50/80 px-3 py-2.5 text-xs font-medium text-violet-700">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          AI is finding skill recommendations…
        </p>
      ) : null}

      {aiError ? (
        <p className="border-b border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {aiError}
        </p>
      ) : null}

      {!aiConfigured && !query.trim() ? (
        <p className="border-b border-border bg-slate-50 px-3 py-2 text-xs text-muted">
          Add GROQ_API_KEY (or GEMINI/OPENAI) in server/.env for AI recommendations.
        </p>
      ) : null}

      <ul className="max-h-56 overflow-y-auto py-1" role="listbox">
        {hasAi ? (
          <>
            <li className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-violet-600">
              AI recommendations
            </li>
            {aiSuggestions.map((rec) => (
              <SuggestionRow key={`ai-${rec.name}`} rec={rec} onSelect={onSelect} ai />
            ))}
          </>
        ) : null}

        {hasStatic ? (
          <>
            <li className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {hasAi ? 'Popular picks' : query.trim() ? 'Suggestions' : 'Popular skills'}
            </li>
            {staticResults.map((rec) => (
              <SuggestionRow key={rec.name} rec={rec} onSelect={onSelect} />
            ))}
          </>
        ) : null}

        {!aiLoading && !hasAi && !hasStatic && query.trim() ? (
          <li className="px-3 py-2 text-xs text-muted">
            No matches. Type a technology name or use AI Suggest below.
          </li>
        ) : null}
      </ul>
    </div>
  )
}
