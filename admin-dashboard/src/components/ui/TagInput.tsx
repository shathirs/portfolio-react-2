import { X } from 'lucide-react'
import { type KeyboardEvent, useState } from 'react'

interface TagInputProps {
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
}

export function TagInput({
  label,
  tags,
  onChange,
  placeholder = 'Type and press Enter',
  suggestions = [],
}: TagInputProps) {
  const [input, setInput] = useState('')

  function addTag(value: string) {
    const trimmed = value.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed])
    setInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    }
  }

  const availableSuggestions = suggestions.filter((s) => !tags.includes(s))

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>

      <div className="rounded-lg border border-border bg-white px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {tags.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-primary"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onChange(tags.filter((t) => t !== tag))}
                  className="rounded p-0.5 hover:bg-indigo-100"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      {availableSuggestions.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {availableSuggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="rounded-md border border-border px-2 py-0.5 text-xs text-muted transition-colors hover:border-primary hover:text-primary"
            >
              + {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
