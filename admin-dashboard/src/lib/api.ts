const API_BASE = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'portfo_token'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new ApiError(res.status, data.message || 'Request failed')
  }
  return data as T
}

export const api = {
  login: (username: string, password: string) =>
    request<{
      token: string
      user: { id: string; name: string; username: string; email: string }
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  me: () =>
    request<{
      user: { id: string; name: string; username: string; email: string }
    }>('/auth/me'),

  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),

  changePassword: (body: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getProjects: () => request<import('@/types').Project[]>('/projects'),

  getProject: (id: string) =>
    request<import('@/types').Project>(`/projects/${id}`),

  createProject: (body: Record<string, unknown>) =>
    request<import('@/types').Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateProject: (id: string, body: Record<string, unknown>) =>
    request<import('@/types').Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deleteProject: (id: string) =>
    request<{ message: string }>(`/projects/${id}`, { method: 'DELETE' }),

  uploadProjectImage: async (file: File) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('image', file)

    const res = await fetch(`${API_BASE}/projects/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new ApiError(res.status, data.message || 'Upload failed')
    }
    return data as { url: string }
  },

  uploadProjectMedia: async (file: File) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/projects/upload-media`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new ApiError(res.status, data.message || 'Upload failed')
    }
    return data as import('@/types').ProjectMediaItem & {
      url: string
      fileName: string
    }
  },

  getSkills: () => request<import('@/types').Skill[]>('/skills'),

  createSkill: (body: Record<string, unknown>) =>
    request<import('@/types').Skill>('/skills', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateSkill: (id: string, body: Record<string, unknown>) =>
    request<import('@/types').Skill>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deleteSkill: (id: string) =>
    request<{ message: string }>(`/skills/${id}`, { method: 'DELETE' }),

  getEducation: () => request<import('@/types').Education[]>('/education'),

  createEducation: (body: Record<string, unknown>) =>
    request<import('@/types').Education>('/education', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateEducation: (id: string, body: Record<string, unknown>) =>
    request<import('@/types').Education>(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deleteEducation: (id: string) =>
    request<{ message: string }>(`/education/${id}`, { method: 'DELETE' }),

  suggestSkills: (body: {
    query?: string
    excludeNames?: string[]
    profileHint?: string
  }) =>
    request<{
      configured: boolean
      source?: string
      suggestions: import('@/data/skillRecommendations').SkillRecommendation[]
      message?: string
    }>('/skills/suggest', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMessages: () => request<import('@/types').Message[]>('/messages'),

  updateMessage: (id: string, read: boolean) =>
    request<import('@/types').Message>(`/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ read }),
    }),

  deleteMessage: (id: string) =>
    request<{ message: string }>(`/messages/${id}`, { method: 'DELETE' }),

  getDashboardStats: () =>
    request<import('@/types').DashboardStats & { unreadMessages?: number }>(
      '/dashboard/stats',
    ),

  getDashboardRecent: () =>
    request<{
      projects: import('@/types').Project[]
      messages: import('@/types').Message[]
    }>('/dashboard/recent'),

  getCertificateStats: () =>
    request<import('@/types').CertificateStats>('/certificates/stats'),

  getCertificates: (params?: { status?: string; includeDeleted?: boolean }) => {
    const search = new URLSearchParams()
    if (params?.status) search.set('status', params.status)
    if (params?.includeDeleted) search.set('includeDeleted', 'true')
    const q = search.toString()
    return request<import('@/types').Certificate[]>(
      `/certificates${q ? `?${q}` : ''}`,
    )
  },

  getCertificate: (id: string) =>
    request<import('@/types').Certificate>(`/certificates/${id}`),

  createCertificate: (body: Record<string, unknown>) =>
    request<import('@/types').Certificate>('/certificates', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  updateCertificate: (id: string, body: Record<string, unknown>) =>
    request<import('@/types').Certificate>(`/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deleteCertificate: (id: string, permanent = false) =>
    request<import('@/types').Certificate>(
      `/certificates/${id}${permanent ? '?permanent=true' : ''}`,
      { method: 'DELETE' },
    ),

  getProfile: () => request<import('@/types').SiteProfile>('/profile'),

  updateProfile: (body: Partial<import('@/types').SiteProfile>) =>
    request<import('@/types').SiteProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  uploadProfileImage: async (file: File) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('image', file)

    const res = await fetch(`${API_BASE}/profile/upload-image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new ApiError(res.status, data.message || 'Upload failed')
    }
    return data as import('@/types').SiteProfile
  },

  uploadCertificateImage: async (file: File) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('image', file)

    const res = await fetch(`${API_BASE}/certificates/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new ApiError(res.status, data.message || 'Upload failed')
    }
    return data as { url: string }
  },
}
