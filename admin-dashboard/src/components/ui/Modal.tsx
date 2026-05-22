import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  onConfirm: () => void
  confirmLabel?: string
  confirmVariant?: 'primary' | 'secondary'
  children?: ReactNode
}

export function Modal({
  open,
  title,
  description,
  onClose,
  onConfirm,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  children,
}: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-muted hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="pr-8 text-lg font-semibold text-slate-900">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-muted">{description}</p>
        ) : null}
        {children}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            className={
              confirmVariant === 'primary'
                ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-400/40'
                : ''
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
