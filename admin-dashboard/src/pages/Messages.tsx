import { Mail, MailOpen, RefreshCw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageError, PageLoader } from '@/components/ui/PageLoader'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useMessages } from '@/context/MessagesContext'
import { formatRelativeDate } from '@/lib/formatDate'
import type { Message } from '@/types'

export function Messages() {
  const { messages, loading, error, liveConnected, refresh, markRead, deleteMessage } =
    useMessages()
  const [searchParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const selected = messages.find((m) => m.id === selectedId) ?? messages[0] ?? null
  const unreadCount = messages.filter((m) => !m.read).length

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const fromUrl = searchParams.get('id')
    if (fromUrl && messages.some((m) => m.id === fromUrl)) {
      setSelectedId(fromUrl)
      const msg = messages.find((m) => m.id === fromUrl)
      if (msg && !msg.read) markRead(fromUrl)
    } else if (messages.length > 0 && !selectedId) {
      setSelectedId(messages[0].id)
    }
  }, [messages, searchParams, markRead])

  async function handleRefresh() {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  if (loading && messages.length === 0) {
    return <PageLoader label="Loading messages…" />
  }
  if (error) return <PageError message={error} onRetry={refresh} />

  function selectMessage(id: string) {
    setSelectedId(id)
    const msg = messages.find((m) => m.id === id)
    if (msg && !msg.read) markRead(id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-muted">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${liveConnected ? 'bg-emerald-500' : 'bg-amber-400'}`}
            title={liveConnected ? 'Live connection active' : 'Connecting…'}
          />
          {unreadCount > 0
            ? `${unreadCount} unread — updates in real time`
            : 'All messages read — updates in real time'}
        </p>
        <Button
          type="button"
          variant="secondary"
          className="gap-2"
          disabled={refreshing}
          onClick={handleRefresh}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid min-h-[480px] gap-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm lg:grid-cols-5">
        <div className="border-b border-border lg:col-span-2 lg:border-b-0 lg:border-r">
          <ul className="max-h-[520px] divide-y divide-border overflow-y-auto">
            {messages.map((message) => (
              <li key={message.id}>
                <button
                  type="button"
                  onClick={() => selectMessage(message.id)}
                  className={[
                    'w-full px-4 py-4 text-left transition-colors hover:bg-slate-50',
                    selected?.id === message.id ? 'bg-indigo-50/60' : '',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-2">
                    {!message.read ? (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    ) : (
                      <span className="mt-2 h-2 w-2 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={[
                            'truncate text-sm',
                            message.read
                              ? 'font-medium text-slate-700'
                              : 'font-semibold text-slate-900',
                          ].join(' ')}
                        >
                          {message.senderName}
                        </p>
                        <span className="shrink-0 text-xs text-muted">
                          {formatRelativeDate(message.receivedAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
                        {message.subject}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted">{message.body}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {messages.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm text-muted">
              No messages yet. Submit the contact form on your portfolio site to receive
              messages here.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col lg:col-span-3">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-muted">
                    From{' '}
                    <span className="font-medium text-slate-700">{selected.senderName}</span>{' '}
                    &lt;{selected.senderEmail}&gt;
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatRelativeDate(selected.receivedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!selected.read ? (
                    <button
                      type="button"
                      onClick={() => markRead(selected.id)}
                      className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-slate-700"
                      title="Mark as read"
                    >
                      <MailOpen className="h-4 w-4" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {selected.body}
                </p>
              </div>
              <div className="border-t border-border px-6 py-4">
                <a
                  href={`mailto:${selected.senderEmail}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted">
              {messages.length === 0
                ? 'Messages from your portfolio contact form will appear here.'
                : 'Select a message to read'}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={!!deleteTarget}
        title="Delete message?"
        description="This message will be removed from your inbox."
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMessage(deleteTarget.id)
            setSelectedId(null)
          }
          setDeleteTarget(null)
        }}
        confirmLabel="Delete"
      />
    </div>
  )
}
