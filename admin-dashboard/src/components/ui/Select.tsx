import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
}

export function Select({
  label,
  options,
  error,
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={[
          'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors',
          'focus:border-primary focus:ring-2 focus:ring-primary/20',
          error ? 'border-red-400' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1.5 text-xs text-red-500">{error}</p> : null}
    </div>
  )
}
