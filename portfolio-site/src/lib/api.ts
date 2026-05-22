import type {
  Certificate,
  ContactPayload,
  Education,
  Project,
  Skill,
} from '@/types'
import type { ChatMessage, ChatReply } from '@/types/chat'
import type { SiteProfile } from '@/types/profile'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers)
  if (options?.body) headers.set('Content-Type', 'application/json')

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(res.status, data.message || 'Request failed')
  }
  return data as T
}

export const api = {
  getProfile: () => request<SiteProfile>('/public/profile'),

  getProjects: () => request<Project[]>('/public/projects'),
  getProject: (id: string) => request<Project>(`/public/projects/${id}`),
  getSkills: () => request<Skill[]>('/public/skills'),
  getEducation: () => request<Education[]>('/public/education'),
  getCertificates: () => request<Certificate[]>('/public/certificates'),
  sendContact: (body: ContactPayload) =>
    request<{ id: string }>('/messages/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getChatStatus: () =>
    request<{ configured: boolean }>('/public/chat/status'),

  sendChat: (messages: Pick<ChatMessage, 'role' | 'content'>[]) =>
    request<ChatReply>('/public/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),
}
