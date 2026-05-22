import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  const checkboxId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label
      htmlFor={checkboxId}
      className={['inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600', className].join(' ')}
    >
      <input
        id={checkboxId}
        type="checkbox"
        className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
        {...props}
      />
      {label}
    </label>
  )
}
