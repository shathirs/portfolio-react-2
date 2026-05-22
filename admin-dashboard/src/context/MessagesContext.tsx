import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/lib/api'
import {
  connectMessageStream,
  disconnectMessageStream,
  subscribeMessageRealtime,
} from '@/lib/messageStream'
import type { Message } from '@/types'

interface MessagesContextValue {
  messages: Message[]
  loading: boolean
  error: string | null
  liveConnected: boolean
  incomingAlert: Message | null
  clearIncomingAlert: () => void
  refresh: () => Promise<void>
  markRead: (id: string) => Promise<void>
  deleteMessage: (id: string) => Promise<void>
}

const MessagesContext = createContext<MessagesContextValue | null>(null)

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liveConnected, setLiveConnected] = useState(false)
  const [incomingAlert, setIncomingAlert] = useState<Message | null>(null)

  const clearIncomingAlert = useCallback(() => setIncomingAlert(null), [])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getMessages()
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    connectMessageStream()
    const unsub = subscribeMessageRealtime((event) => {
      if (event.type === 'connected') {
        setLiveConnected(true)
        return
      }
      if (event.type === 'created') {
        setMessages((prev) => {
          if (prev.some((m) => m.id === event.message.id)) return prev
          return [event.message, ...prev]
        })
        setIncomingAlert(event.message)
        setLoading(false)
      }
      if (event.type === 'updated') {
        setMessages((prev) =>
          prev.map((m) => (m.id === event.message.id ? event.message : m)),
        )
      }
      if (event.type === 'deleted') {
        setMessages((prev) => prev.filter((m) => m.id !== event.id))
      }
    })
    return () => {
      unsub()
      disconnectMessageStream()
      setLiveConnected(false)
    }
  }, [])

  const markRead = useCallback(async (id: string) => {
    const updated = await api.updateMessage(id, true)
    setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)))
    setIncomingAlert((prev) => (prev?.id === id ? null : prev))
  }, [])

  const deleteMessage = useCallback(async (id: string) => {
    await api.deleteMessage(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      messages,
      loading,
      error,
      liveConnected,
      incomingAlert,
      clearIncomingAlert,
      refresh,
      markRead,
      deleteMessage,
    }),
    [
      messages,
      loading,
      error,
      liveConnected,
      incomingAlert,
      clearIncomingAlert,
      refresh,
      markRead,
      deleteMessage,
    ],
  )

  return (
    <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
  )
}

export function useMessages() {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider')
  return ctx
}
