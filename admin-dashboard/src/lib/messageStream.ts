import { getToken } from '@/lib/api'
import type { Message } from '@/types'

export type MessageRealtimeEvent =
  | { type: 'connected' }
  | { type: 'created'; message: Message }
  | { type: 'updated'; message: Message }
  | { type: 'deleted'; id: string }

type Listener = (event: MessageRealtimeEvent) => void

const listeners = new Set<Listener>()
let source: EventSource | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

function notify(event: MessageRealtimeEvent) {
  listeners.forEach((fn) => fn(event))
}

function streamUrl() {
  const base = import.meta.env.VITE_API_URL || '/api'
  const token = getToken()
  if (!token) return null
  return `${base}/messages/stream?token=${encodeURIComponent(token)}`
}

function scheduleReconnect() {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectMessageStream()
  }, 3000)
}

export function subscribeMessageRealtime(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function connectMessageStream() {
  const url = streamUrl()
  if (!url) return

  if (source) {
    source.close()
    source = null
  }

  source = new EventSource(url)

  source.addEventListener('connected', () => {
    notify({ type: 'connected' })
  })

  source.addEventListener('message:created', (ev) => {
    try {
      const message = JSON.parse(ev.data) as Message
      notify({ type: 'created', message })
    } catch {
      /* ignore malformed payload */
    }
  })

  source.addEventListener('message:updated', (ev) => {
    try {
      const message = JSON.parse(ev.data) as Message
      notify({ type: 'updated', message })
    } catch {
      /* ignore */
    }
  })

  source.addEventListener('message:deleted', (ev) => {
    try {
      const { id } = JSON.parse(ev.data) as { id: string }
      if (id) notify({ type: 'deleted', id })
    } catch {
      /* ignore */
    }
  })

  source.onerror = () => {
    source?.close()
    source = null
    scheduleReconnect()
  }
}

export function disconnectMessageStream() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  source?.close()
  source = null
}
