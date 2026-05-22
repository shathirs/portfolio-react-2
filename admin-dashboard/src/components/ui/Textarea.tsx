import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function Textarea({ label, error, id, className = '', ...props }: TextareaProps) {
  const textareaId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      <label
        htmlFor={textareaId}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={[
          'w-full resize-y rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors',
          'placeholder:text-slate-400 min-h-[100px]',
          'focus:border-primary focus:ring-2 focus:ring-primary/20',
          error ? 'border-red-400' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-red-500">{error}</p> : null}
    </div>
  )
}
