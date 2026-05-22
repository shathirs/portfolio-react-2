export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: number
  role: ChatRole
  content: string
}

export interface ChatReply {
  configured: boolean
  reply: string
}
