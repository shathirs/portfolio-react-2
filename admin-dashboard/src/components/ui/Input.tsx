import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={[
          'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors',
          'placeholder:text-slate-400',
          'focus:border-primary focus:ring-2 focus:ring-primary/20',
          error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-red-500">{error}</p> : null}
    </div>
  )
}
