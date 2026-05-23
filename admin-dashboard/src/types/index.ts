import type { ProjectCategory } from '@/config/projectCategories'

export type ProjectStatus = 'published' | 'draft'

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
  category: ProjectCategory
  shortDescription: string
  detailedDescription: string
  keyFeatures: string[]
  liveDemoUrl: string
  sourceCodeUrl: string
  imageUrl: string
  media: ProjectMediaItem[]
  technologies: string[]
  status: ProjectStatus
  createdAt: string
}

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Cloud & DevOps'
  | 'Tools & Practices'
  | 'Other'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
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
  createdAt?: string
  updatedAt?: string
}

export interface Message {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  body: string
  receivedAt: string
  read: boolean
}

export type CertificateStatus = 'published' | 'draft' | 'deleted'

export type CertificateCategory =
  | 'Web Development'
  | 'Database'
  | 'Programming'
  | 'Tools & Platforms'
  | 'Academic'
  | 'Professional'
  | 'Other'

export type CertificateMediaType = 'image' | 'pdf'

export interface Certificate {
  id: string
  title: string
  subtitle: string
  category: CertificateCategory
  issuer: string
  issuedDate: string | null
  status: CertificateStatus
  thumbnail: string
  thumbnailType?: CertificateMediaType
  credentialUrl: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface CertificateStats {
  total: number
  published: number
  draft: number
  deleted: number
}

export interface SiteProfile {
  id?: string
  name: string
  title: string
  tagline: string
  bio: string
  email: string
  phone: string
  location: string
  degree: string
  status: string
  cvUrl: string
  profileImage: string
  github: string
  linkedin: string
}

export interface DashboardStats {
  totalProjects: number
  totalSkills: number
  totalCertificates: number
  totalMessages: number
  unreadMessages?: number
}
