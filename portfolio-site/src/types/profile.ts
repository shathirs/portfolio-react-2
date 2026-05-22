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

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
] as const

export const techOrbit = [
  { name: 'React', color: '#61dafb', abbr: 'R' },
  { name: 'Node.js', color: '#339933', abbr: 'N' },
  { name: 'MongoDB', color: '#47A248', abbr: 'M' },
  { name: 'Express', color: '#ffffff', abbr: 'E' },
] as const
