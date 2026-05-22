import { Bold, Italic, List, ListOrdered } from 'lucide-react'
import type { TextareaHTMLAttributes } from 'react'
import { useRef } from 'react'

interface RichTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export function RichTextarea({
  label,
  value,
  onChange,
  error,
  ...props
}: RichTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function wrapSelection(before: string, after: string) {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(next)
  }

  function insertPrefix(prefix: string) {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    onChange(next)
  }

  const tools = [
    { icon: Bold, action: () => wrapSelection('**', '**'), label: 'Bold' },
    { icon: Italic, action: () => wrapSelection('_', '_'), label: 'Italic' },
    { icon: List, action: () => insertPrefix('- '), label: 'Bullet list' },
    { icon: ListOrdered, action: () => insertPrefix('1. '), label: 'Numbered list' },
  ]

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <div
        className={[
          'overflow-hidden rounded-lg border border-border bg-white',
          error ? 'border-red-400' : 'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
        ].join(' ')}
      >
        <div className="flex gap-1 border-b border-border bg-slate-50 px-2 py-1.5">
          {tools.map(({ icon: Icon, action, label: toolLabel }) => (
            <button
              key={toolLabel}
              type="button"
              onClick={action}
              className="rounded p-1.5 text-muted transition-colors hover:bg-white hover:text-slate-700"
              title={toolLabel}
              aria-label={toolLabel}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[160px] w-full resize-y border-0 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          {...props}
        />
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-500">{error}</p> : null}
    </div>
  )
}
