import { ChatMessageContent } from '@/components/chat/ChatMessageContent'
import {
  AI_ASSISTANT_GREETING,
  AI_ASSISTANT_NAME,
} from '@/config/siteBrand'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'
import { useProfileImage } from '@/context/ProfileContext'
import { api } from '@/lib/api'
import type { ChatMessage } from '@/types/chat'
import {
  Bot,
  MessageCircle,
  Minimize2,
  Send,
  Sparkles,
  User,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const SUGGESTIONS = [
  { label: 'Education', query: 'List my education' },
  { label: 'Projects', query: 'What projects have you built?' },
  { label: 'Contact', query: 'How can I contact you?' },
  { label: 'Skills', query: 'What is your tech stack?' },
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white shadow-md shadow-primary/25">
        <Bot className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.07] px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 animate-bounce rounded-full bg-primary/80"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function PortfolioAiChat() {
  const profileImage = useProfileImage()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiReady, setAiReady] = useState<boolean | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content: AI_ASSISTANT_GREETING,
    },
  ])

  useEffect(() => {
    api.getChatStatus().then((s) => setAiReady(s.configured)).catch(() => setAiReady(false))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 300)
      return () => window.clearTimeout(t)
    }
  }, [isOpen])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
    }

    const history = [...messages, userMessage]
    setMessages(history)
    setInput('')
    setIsLoading(true)

    try {
      const payload = history.map(({ role, content }) => ({ role, content }))
      const { reply } = await api.sendChat(payload)
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: reply },
      ])
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again or use the contact form.'
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: msg },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  const showSuggestions = messages.length <= 2 && !isLoading

  return (
    <>
      {isOpen ? (
        <div
          className="fixed bottom-0 right-0 z-50 flex max-h-[100dvh] w-full flex-col sm:bottom-5 sm:right-5 sm:max-h-[min(640px,85dvh)] sm:w-[min(400px,calc(100vw-2rem))]"
          role="dialog"
          aria-label="Portfolio AI chat"
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-navy shadow-2xl shadow-black/50 ring-1 ring-white/5 sm:rounded-3xl">
            {/* Header */}
            <div className="relative shrink-0 overflow-hidden border-b border-white/10 px-4 py-4">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/20 via-violet-500/10 to-transparent" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-lg shadow-primary/30">
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <span
                    className={[
                      'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-navy',
                      aiReady ? 'bg-emerald-400' : 'bg-amber-400',
                    ].join(' ')}
                    title={aiReady ? 'Online' : 'Limited'}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-white">
                    {AI_ASSISTANT_NAME}&apos;s AI Assistant
                  </h3>
                  <p className="text-xs text-slate-400">
                    {aiReady
                      ? 'Answers from portfolio & linked media'
                      : 'Contact form available on site'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="chat-scroll min-h-0 flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-navy-light/80 to-navy px-4 py-4"
            >
              {messages.map((message, index) => {
                const isUser = message.role === 'user'
                const isWelcome = index === 0 && message.role === 'assistant'

                if (isUser) {
                  return (
                    <div key={message.id} className="flex justify-end gap-2">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-primary to-indigo-600 px-4 py-2.5 text-sm leading-relaxed text-white shadow-md shadow-primary/20">
                        {message.content}
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-slate-300">
                        {profileImage ? (
                          <ProfilePhoto
                            src={profileImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </span>
                    </div>
                  )
                }

                return (
                  <div key={message.id} className="flex items-end gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-white shadow-md shadow-primary/25">
                      <Bot className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <div
                      className={[
                        'max-w-[calc(100%-2.5rem)] min-w-0 rounded-2xl rounded-bl-md border px-4 py-3 shadow-sm',
                        isWelcome
                          ? 'border-primary/25 bg-primary/10'
                          : 'border-white/10 bg-white/[0.06]',
                      ].join(' ')}
                    >
                      {isWelcome ? (
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                          Welcome
                        </p>
                      ) : null}
                      <ChatMessageContent content={message.content} />
                    </div>
                  </div>
                )
              })}
              {isLoading ? <TypingIndicator /> : null}
            </div>

            {/* Suggestions */}
            {showSuggestions ? (
              <div className="shrink-0 border-t border-white/5 bg-navy-light/50 px-4 py-3">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Try asking
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map(({ label, query }) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => sendMessage(query)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-white"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="shrink-0 border-t border-white/10 bg-navy p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-navy-light/90 p-1.5 shadow-inner ring-1 ring-white/5 focus-within:border-primary/50 focus-within:ring-primary/20">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message…"
                  disabled={isLoading}
                  className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 disabled:scale-95 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-500">
                AI may make mistakes · Verify important details
              </p>
            </form>
          </div>
        </div>
      ) : null}

      {/* Launcher */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full border border-primary/30 bg-gradient-to-r from-primary to-indigo-600 py-3 pl-4 pr-5 text-sm font-semibold text-white shadow-xl shadow-primary/35 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/40 sm:bottom-6 sm:right-6"
          aria-label="Open AI chat"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <MessageCircle className="h-5 w-5" strokeWidth={2} />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
          </span>
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      ) : null}
    </>
  )
}
