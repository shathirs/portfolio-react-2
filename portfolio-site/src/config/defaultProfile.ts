import type { SiteProfile } from '@/types/profile'

/** Used when the API is unreachable (e.g. backend not running in dev). */
export const defaultProfile: SiteProfile = {
  name: 'Shathir Sheriff',
  title: 'MERN Stack Developer',
  tagline: 'Software Engineering Student',
  bio: 'Final year Software Engineering undergraduate at SLIIT City Uni (University of Bedfordshire) with hands-on experience building full-stack applications using MongoDB, Express.js, React and Node.js. Passionate about efficient, user-friendly web solutions.',
  email: 'sheriffshathir@gmail.com',
  phone: '+94 71 4876 345',
  location: 'Kalutara South, Sri Lanka',
  degree: 'BSc (Hons) Software Engineering',
  status: 'Open to Work',
  cvUrl: '/Shathir_CV.pdf',
  profileImage: '/profile.png',
  github: 'https://github.com/shathirs',
  linkedin: 'https://www.linkedin.com/in/shathir-sheriff/',
}
