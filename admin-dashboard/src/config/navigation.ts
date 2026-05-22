import type { LucideIcon } from 'lucide-react'
import {
  Award,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Sparkles,
  User,
} from 'lucide-react'

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  end?: boolean
}

export const mainNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Skills', path: '/skills', icon: Sparkles },
  { label: 'Education', path: '/education', icon: GraduationCap },
  { label: 'Certificates', path: '/certificates', icon: Award },
  { label: 'Messages', path: '/messages', icon: Mail },
  { label: 'Profile', path: '/profile', icon: User },
]

export const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/projects/new': 'Add New Project',
  '/skills': 'Skills',
  '/education': 'Education',
  '/certificates': 'Certificates',
  '/messages': 'Messages',
  '/profile': 'Profile',
}

export function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname.match(/^\/projects\/[^/]+\/edit$/)) return 'Edit Project'
  return 'Admin'
}
