export type ProjectMediaType = 'image' | 'video' | 'pdf' | 'document'

export interface ProjectMediaItem {
  id?: string
  title: string
  type: ProjectMediaType
  url: string
  mimeType?: string
  fileName?: string
  order: number
}

export interface Project {
  id: string
  title: string
  category: string
  shortDescription: string
  detailedDescription: string
  keyFeatures?: string[]
  liveDemoUrl: string
  sourceCodeUrl: string
  imageUrl: string
  media?: ProjectMediaItem[]
  technologies: string[]
  status: string
  createdAt?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  percentage: number
  icon?: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  period: string
  description: string
  liveDemoUrl: string
  order: number
}

export interface Certificate {
  id: string
  title: string
  subtitle: string
  category: string
  issuer: string
  issuedDate: string | null
  status: string
  thumbnail: string
  credentialUrl: string
  order: number
}

export interface ContactPayload {
  senderName: string
  senderEmail: string
  subject?: string
  body: string
}
