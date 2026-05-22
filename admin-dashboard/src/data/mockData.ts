import type { DashboardStats, Message, Project, Skill } from '@/types'

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    category: 'Industry',
    shortDescription: 'Full-stack online store with cart and payments.',
    detailedDescription: '',
    keyFeatures: [],
    liveDemoUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com',
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=80&h=80&fit=crop',
    media: [],
    technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
    status: 'published',
    createdAt: '2025-04-12T10:00:00Z',
  },
  {
    id: '2',
    title: 'Task Manager App',
    category: 'Hobby',
    shortDescription: 'Kanban-style task board with drag and drop.',
    detailedDescription: '',
    keyFeatures: [],
    liveDemoUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com',
    media: [],
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    status: 'published',
    createdAt: '2025-03-28T14:30:00Z',
  },
  {
    id: '3',
    title: 'AI Recipe Generator',
    category: 'Industry',
    shortDescription: 'Recipe suggestions powered by OpenAI API.',
    detailedDescription: '',
    keyFeatures: [],
    liveDemoUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com',
    media: [],
    imageUrl: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=80&h=80&fit=crop',
    technologies: ['React', 'Node.js', 'OpenAI'],
    status: 'draft',
    createdAt: '2025-05-01T09:15:00Z',
  },
  {
    id: '4',
    title: 'Event Hub',
    category: 'Academic',
    shortDescription: 'Event discovery and ticketing platform.',
    detailedDescription: '',
    keyFeatures: [],
    liveDemoUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com',
    media: [],
    imageUrl: 'https://images.unsplash.com/photo-1540575467061-178a50c2df87?w=80&h=80&fit=crop',
    technologies: ['React', 'MongoDB', 'Express'],
    status: 'published',
    createdAt: '2025-02-15T11:00:00Z',
  },
  {
    id: '5',
    title: 'Portfolio Website',
    category: 'Hobby',
    shortDescription: 'Personal portfolio with admin dashboard.',
    detailedDescription: '',
    keyFeatures: [],
    liveDemoUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com',
    media: [],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=80&fit=crop',
    technologies: ['React', 'Tailwind CSS', 'Vite'],
    status: 'published',
    createdAt: '2025-01-20T08:00:00Z',
  },
  {
    id: '6',
    title: 'Complaint Prioritization',
    category: 'Industry',
    shortDescription: 'NLP-based complaint routing for support teams.',
    detailedDescription: '',
    keyFeatures: [],
    liveDemoUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com',
    media: [],
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=80&h=80&fit=crop',
    technologies: ['Python', 'TensorFlow', 'React'],
    status: 'published',
    createdAt: '2024-11-05T16:45:00Z',
  },
  {
    id: '7',
    title: 'Service Request Board',
    category: 'Industry',
    shortDescription: 'Internal IT service request tracking.',
    detailedDescription: '',
    keyFeatures: [],
    liveDemoUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com',
    media: [],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=80&h=80&fit=crop',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
    status: 'draft',
    createdAt: '2024-10-18T12:00:00Z',
  },
  {
    id: '8',
    title: 'Course Eligibility App',
    category: 'Hobby',
    shortDescription: 'Student course eligibility checker.',
    detailedDescription: '',
    keyFeatures: [],
    liveDemoUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com',
    media: [],
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&h=80&fit=crop',
    technologies: ['React', 'JavaScript'],
    status: 'published',
    createdAt: '2024-09-02T10:30:00Z',
  },
]

export const mockSkills: Skill[] = [
  { id: '1', name: 'React.js', category: 'Frontend', percentage: 90 },
  { id: '2', name: 'Node.js', category: 'Backend', percentage: 85 },
  { id: '3', name: 'TypeScript', category: 'Frontend', percentage: 88 },
  { id: '4', name: 'MongoDB', category: 'Database', percentage: 80 },
  { id: '5', name: 'Express.js', category: 'Backend', percentage: 82 },
  { id: '6', name: 'Tailwind CSS', category: 'Frontend', percentage: 92 },
  { id: '7', name: 'Python', category: 'Backend', percentage: 75 },
  { id: '8', name: 'Git & GitHub', category: 'Tools & Practices', percentage: 88 },
  { id: '9', name: 'REST APIs', category: 'Backend', percentage: 86 },
  { id: '10', name: 'PostgreSQL', category: 'Database', percentage: 70 },
  { id: '11', name: 'Docker', category: 'Cloud & DevOps', percentage: 65 },
  { id: '12', name: 'AWS', category: 'Cloud & DevOps', percentage: 60 },
]

export const mockMessages: Message[] = [
  {
    id: '1',
    senderName: 'Sarah Johnson',
    senderEmail: 'sarah.j@company.com',
    subject: 'Freelance project inquiry',
    body: 'Hi, I came across your portfolio and would love to discuss a potential React project for our startup.',
    receivedAt: '2025-05-20T14:22:00Z',
    read: false,
  },
  {
    id: '2',
    senderName: 'Michael Chen',
    senderEmail: 'mchen@techcorp.io',
    subject: 'Full-stack developer role',
    body: 'We are hiring a MERN developer and your Event Hub project caught our attention. Are you open to opportunities?',
    receivedAt: '2025-05-18T09:10:00Z',
    read: true,
  },
  {
    id: '3',
    senderName: 'Emily Rodriguez',
    senderEmail: 'emily.r@designstudio.com',
    subject: 'Collaboration on UI',
    body: 'Would you be interested in collaborating on a portfolio redesign? I handle design and need a dev partner.',
    receivedAt: '2025-05-15T16:45:00Z',
    read: true,
  },
  {
    id: '4',
    senderName: 'David Kumar',
    senderEmail: 'david.k@gmail.com',
    subject: 'Question about AI project',
    body: 'Your complaint prioritization thesis project looks impressive. Could you share more about the model you used?',
    receivedAt: '2025-05-12T11:30:00Z',
    read: false,
  },
  {
    id: '5',
    senderName: 'Lisa Thompson',
    senderEmail: 'lisa@university.edu',
    subject: 'Guest lecture invitation',
    body: 'Our CS department would like to invite you to speak about building production MERN applications.',
    receivedAt: '2025-05-08T08:00:00Z',
    read: true,
  },
]

export const mockCertificateCount = 6

export function getDashboardStats(): DashboardStats {
  return {
    totalProjects: mockProjects.length,
    totalSkills: mockSkills.length,
    totalCertificates: mockCertificateCount,
    totalMessages: mockMessages.length,
  }
}

export function getRecentProjects(limit = 4) {
  return [...mockProjects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

export function getRecentMessages(limit = 4) {
  return [...mockMessages]
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, limit)
}
