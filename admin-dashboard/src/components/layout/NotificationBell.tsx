import { Bell, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMessages } from '@/context/MessagesContext'
import { formatRelativeDate } from '@/lib/formatDate'

export function NotificationBell() {
  const { messages, incomingAlert, clearIncomingAlert, markRead, liveConnected } =
    useMessages()
  const [open, setOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const unread = messages.filter((m) => !m.read)
  const unreadCount = unread.length

  useEffect(() => {
    if (!incomingAlert) return
    setToastOpen(true)
    const timer = window.setTimeout(() => {
      setToastOpen(false)
      clearIncomingAlert()
    }, 8000)
    return () => window.clearTimeout(timer)
  }, [incomingAlert, clearIncomingAlert])

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  function toggleOpen() {
    setOpen((prev) => {
      const next = !prev
      if (next) {
        setToastOpen(false)
        clearIncomingAlert()
      }
      return next
    })
  }

  async function openMessage(id: string) {
    setOpen(false)
    setToastOpen(false)
    clearIncomingAlert()
    const msg = messages.find((m) => m.id === id)
    if (msg && !msg.read) await markRead(id)
    navigate(`/messages?id=${id}`)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        className={[
          'relative rounded-lg p-2 transition-colors',
          open || toastOpen
            ? 'bg-indigo-50 text-primary'
            : 'text-muted hover:bg-slate-100 hover:text-slate-700',
        ].join(' ')}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell
          className={['h-5 w-5', incomingAlert && toastOpen ? 'animate-pulse' : ''].join(' ')}
          strokeWidth={1.75}
        />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
        {liveConnected ? (
          <span
            className="absolute bottom-1 right-1 h-2 w-2 rounded-full border-2 border-white bg-emerald-500"
            title="Live updates on"
          />
        ) : null}
      </button>

      {toastOpen && incomingAlert ? (
        <div
          role="alert"
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-white shadow-lg"
        >
          <div className="border-b border-primary/15 bg-indigo-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              New message
            </p>
          </div>
          <button
            type="button"
            onClick={() => openMessage(incomingAlert.id)}
            className="w-full px-4 py-3 text-left transition-colors hover:bg-slate-50"
          >
            <p className="text-sm font-semibold text-slate-900">{incomingAlert.senderName}</p>
            <p className="mt-0.5 truncate text-xs text-muted">{incomingAlert.subject}</p>
            <p className="mt-2 line-clamp-2 text-xs text-slate-600">{incomingAlert.body}</p>
          </button>
        </div>
      ) : null}

      {open ? (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-96 overflow-hidden rounded-xl border border-border bg-white shadow-lg"
          role="menu"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="text-xs text-muted">
                {unreadCount > 0
                  ? `${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`
                  : 'You are all caught up'}
              </p>
            </div>
            {unreadCount > 0 ? (
              <Link
                to="/messages"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-primary hover:text-primary-hover"
              >
                View all
              </Link>
            ) : null}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {unread.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-muted">
                <Mail className="mx-auto mb-2 h-8 w-8 opacity-40" strokeWidth={1.5} />
                No new messages
              </li>
            ) : (
              unread.map((message) => (
                <li key={message.id} className="border-b border-border last:border-0">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openMessage(message.id)}
                    className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900">
                          {message.senderName}
                        </span>
                        <span className="shrink-0 text-xs text-muted">
                          {formatRelativeDate(message.receivedAt)}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-medium text-slate-600">
                        {message.subject}
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted">
                        {message.body}
                      </span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
