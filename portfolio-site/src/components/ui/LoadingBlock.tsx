export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}
