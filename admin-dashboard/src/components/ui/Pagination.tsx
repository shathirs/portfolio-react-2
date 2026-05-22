import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

interface PaginationProps {
  page: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  itemLabel?: string
}

export function Pagination({
  page,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = 'items',
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)

  useEffect(() => {
    if (page > totalPages) {
      onPageChange(totalPages)
    }
  }, [page, totalPages, onPageChange])

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const rangeEnd = Math.min(currentPage * pageSize, totalItems)

  function goPrevious() {
    if (canGoPrevious) onPageChange(currentPage - 1)
  }

  function goNext() {
    if (canGoNext) onPageChange(currentPage + 1)
  }

  if (totalItems === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-4">
      <p className="text-sm text-muted">
        Showing {rangeStart} to {rangeEnd} of {totalItems} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={goPrevious}
          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              aria-label={`Page ${n}`}
              aria-current={currentPage === n ? 'page' : undefined}
              className={[
                'min-w-[2.25rem] rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                currentPage === n
                  ? 'bg-primary text-white'
                  : 'border border-border text-slate-700 hover:bg-slate-50',
              ].join(' ')}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!canGoNext}
          onClick={goNext}
          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
