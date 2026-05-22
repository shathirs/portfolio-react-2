import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Message } from '@/types'
import { formatRelativeDate } from '@/lib/formatDate'

interface RecentMessagesProps {
  messages: Message[]
}

function truncate(text: string, max = 72) {
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <div className="rounded-xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="font-semibold text-slate-900">Recent Messages</h2>
        <Link
          to="/messages"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          View All Messages
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>

      <ul className="divide-y divide-border">
        {messages.map((message) => (
          <li key={message.id}>
            <Link
              to={`/messages?id=${message.id}`}
              className="block px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-primary">
                  <Mail className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-900">{message.senderName}</p>
                    <span className="shrink-0 text-xs text-muted">
                      {formatRelativeDate(message.receivedAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-slate-600">
                    {message.subject}
                  </p>
                  <p className="mt-1 text-sm text-muted">{truncate(message.body)}</p>
                </div>
                {!message.read ? (
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                    aria-label="Unread"
                  />
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {messages.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-muted">No messages yet.</p>
      ) : null}
    </div>
  )
}
