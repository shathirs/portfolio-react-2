import { ChevronDown, LogOut, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/context/ProfileContext'

export function ProfileMenu() {
  const { user, logout } = useAuth()
  const { profile, avatarUrl } = useProfile()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const displayName = profile?.name ?? user?.name ?? 'Administrator'
  const displayEmail = profile?.email ?? user?.email ?? 'Admin'

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } finally {
      setLoggingOut(false)
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative border-l border-border pl-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          'flex items-center gap-3 rounded-lg py-1 pr-1 transition-colors',
          open ? 'bg-slate-50' : 'hover:bg-slate-50',
        ].join(' ')}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-9 w-9 rounded-full object-cover bg-slate-100 ring-2 ring-slate-100"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-primary ring-2 ring-slate-100">
            {displayName.charAt(0)}
          </span>
        )}
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium text-slate-900">{displayName}</span>
          <span className="block text-xs text-muted">{displayEmail}</span>
        </span>
        <ChevronDown
          className={[
            'hidden h-4 w-4 text-muted transition-transform sm:block',
            open ? 'rotate-180' : '',
          ].join(' ')}
          strokeWidth={2}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-white py-1 shadow-lg"
        >
          <div className="border-b border-border px-4 py-3 sm:hidden">
            <p className="text-sm font-semibold text-slate-900">{displayName}</p>
            <p className="text-xs text-muted">{displayEmail}</p>
          </div>

          <Link
            to="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <User className="h-4 w-4 text-muted" strokeWidth={1.75} />
            Profile
          </Link>

          <button
            type="button"
            role="menuitem"
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
