interface ProgressBarProps {
  value: number
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function ProgressBar({
  value,
  showLabel = true,
  size = 'md',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const height = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className="flex min-w-[140px] items-center gap-3">
      <div className={`flex-1 overflow-hidden rounded-full bg-slate-100 ${height}`}>
        <div
          className={`${height} rounded-full bg-primary transition-all duration-300`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel ? (
        <span className="w-10 shrink-0 text-right text-sm font-medium text-slate-700">
          {clamped}%
        </span>
      ) : null}
    </div>
  )
}
