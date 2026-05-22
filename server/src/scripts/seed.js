/**
 * Seed data sourced from https://shathir-sheriff.vercel.app/
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { User } from '../models/User.js'
import { Project } from '../models/Project.js'
import { Skill } from '../models/Skill.js'
import { Message } from '../models/Message.js'
import { Education } from '../models/Education.js'
import { Certificate } from '../models/Certificate.js'
import { SiteProfile } from '../models/SiteProfile.js'
import { defaultProfile } from '../config/defaultProfile.js'

const PORTFOLIO_URL = 'https://shathir-sheriff.vercel.app'
const GITHUB_URL = 'https://github.com/shathirs'

const projects = [
  {
    title: 'Havelock Smart Resident Portal',
    category: 'Academic',
    shortDescription:
      'AI-driven apartment management system with complaint prioritization and role-based access.',
    detailedDescription: `Developed a full-stack smart resident management system using React.js, Node.js and MongoDB for University of Bedfordshire (2025–Present).

Implemented AI-based complaint prioritization and role-based access control.

Built features such as visitor pass generation, parcel tracking and billing management.

Designed RESTful APIs and ensured secure, scalable system architecture.`,
    liveDemoUrl: PORTFOLIO_URL,
    sourceCodeUrl: GITHUB_URL,
    imageUrl:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    keyFeatures: [
      'AI-based complaint prioritization and role-based access control',
      'Visitor pass generation, parcel tracking, and billing management',
      'RESTful APIs with secure, scalable architecture',
    ],
    technologies: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    status: 'published',
  },
  {
    title: 'Villa 97, Bolgoda - Official Website',
    category: 'Academic',
    shortDescription:
      'Full-stack villa booking site with user management and Agile team delivery.',
    detailedDescription: `Developed a full-stack web application using React.js, Node.js and PostgreSQL (2026).

Contributed as Scheduling Manager, planning and tracking project timelines.

Designed and implemented a User Management System for registration, authentication and data management.

Collaborated in a five-member Agile team (Project Manager, Startup Manager, Quality Manager, Risk Manager, Scheduling Manager) using version control tools.`,
    liveDemoUrl: PORTFOLIO_URL,
    sourceCodeUrl: GITHUB_URL,
    imageUrl:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    keyFeatures: [
      'User management with registration and authentication',
      'Agile team delivery with scheduling and timeline tracking',
      'Full-stack villa booking with PostgreSQL backend',
    ],
    technologies: ['React', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    status: 'published',
  },
  {
    title: 'AI Recipe Generator',
    category: 'Hobby',
    shortDescription:
      'Pantry-aware recipe app with Google Gemini, meal plans, and shopping lists.',
    detailedDescription: `Developed a full-stack web application using React.js, Node.js and PostgreSQL (2026).

Google Gemini for recipe generation and pantry-aware ideas.

JWT authentication with optional SMTP password-reset emails.

Users save recipes, plan weekly meals, build shopping lists (including sync from meal plans), and manage a pantry.`,
    keyFeatures: [
      'Google Gemini recipe generation from pantry ingredients',
      'JWT authentication with optional password-reset emails',
      'Weekly meal plans and shopping lists synced from recipes',
    ],
    liveDemoUrl: PORTFOLIO_URL,
    sourceCodeUrl: GITHUB_URL,
    imageUrl:
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop',
    technologies: ['React', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    status: 'published',
  },
  {
    title: 'Banana Math Game',
    category: 'Academic',
    shortDescription:
      'Puzzle game web app built for a university API project with PHP and MySQL.',
    detailedDescription: `Developed a user-friendly web application for a given API in a University of Bedfordshire project (2025).

Puzzle game with additional events to make gameplay more engaging.

Built with HTML, CSS, JavaScript, PHP and MySQL.`,
    keyFeatures: [
      'Engaging puzzle gameplay with bonus events',
      'University API integration project',
      'PHP and MySQL backend with responsive web UI',
    ],
    liveDemoUrl: PORTFOLIO_URL,
    sourceCodeUrl: GITHUB_URL,
    imageUrl:
      'https://images.unsplash.com/photo-1606092195730-7d4b9af5f50d?w=400&h=300&fit=crop',
    technologies: ['HTML/CSS', 'JavaScript', 'PHP', 'MySQL'],
    status: 'published',
  },
  {
    title: 'Wealth Management App with AI Recommendation System',
    category: 'Industry',
    shortDescription:
      'AI-augmented wealth management app with Amazon Bedrock recommendations.',
    detailedDescription: `Built at Codewave Academy (2025).

Full-stack, AI-augmented wealth management app using Next.js 14, Tailwind, Express, and MongoDB.

Implemented secure REST APIs, authentication UX, and Amazon Bedrock-powered recommendations.

Delivered production-ready features including logging, rate limiting, and deployment documentation.`,
    keyFeatures: [
      'Amazon Bedrock-powered investment recommendations',
      'Secure REST APIs and authentication UX',
      'Production-ready logging, rate limiting, and deployment docs',
    ],
    liveDemoUrl: PORTFOLIO_URL,
    sourceCodeUrl: GITHUB_URL,
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    technologies: [
      'Next.js 14',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'MongoDB',
      'AWS Bedrock',
    ],
    status: 'published',
  },
  {
    title: 'Inventory Management System',
    category: 'Industry',
    shortDescription:
      'Seafood restaurant inventory system with role-based login and low-stock alerts.',
    detailedDescription: `Developed at SLIIT City Uni – HD in IT (2024).

Complete inventory management system for a seafood restaurant client.

Responsive React front-end with RESTful APIs using Node.js and Express.js, connected to MongoDB for real-time data handling.

Included role-based login, PDF reporting, and low-stock alerts.`,
    keyFeatures: [
      'Real-time inventory with MongoDB and REST APIs',
      'Role-based login and PDF reporting',
      'Low-stock alerts for restaurant operations',
    ],
    liveDemoUrl: PORTFOLIO_URL,
    sourceCodeUrl: GITHUB_URL,
    imageUrl:
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST API'],
    status: 'published',
  },
  {
    title: 'E-commerce Website for Luxury Watches',
    category: 'Academic',
    shortDescription:
      'Luxury watch e-commerce site with cart, auth, and secure checkout.',
    detailedDescription: `Developed at SLIIT City Uni – HD in IT (2023).

Fully functional e-commerce website with responsive modern UI.

Dynamic product listings, user authentication, shopping cart, and secure checkout using PHP and MySQL.

Designed intuitive front-end pages with HTML, CSS, and JavaScript.`,
    keyFeatures: [
      'Dynamic product listings and shopping cart',
      'User authentication and secure checkout',
      'Responsive luxury watch storefront UI',
    ],
    liveDemoUrl: PORTFOLIO_URL,
    sourceCodeUrl: GITHUB_URL,
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    technologies: ['HTML/CSS', 'JavaScript', 'PHP', 'MySQL'],
    status: 'published',
  },
]

const skills = [
  { name: 'React.js', category: 'Frontend', percentage: 90 },
  { name: 'Next.js', category: 'Frontend', percentage: 85 },
  { name: 'TypeScript', category: 'Frontend', percentage: 85 },
  { name: 'JavaScript', category: 'Frontend', percentage: 90 },
  { name: 'Tailwind CSS', category: 'Frontend', percentage: 92 },
  { name: 'HTML/CSS', category: 'Frontend', percentage: 88 },
  { name: 'Node.js', category: 'Backend', percentage: 88 },
  { name: 'Express.js', category: 'Backend', percentage: 85 },
  { name: 'PHP', category: 'Backend', percentage: 75 },
  { name: 'REST APIs', category: 'Backend', percentage: 86 },
  { name: 'MongoDB', category: 'Database', percentage: 85 },
  { name: 'PostgreSQL', category: 'Database', percentage: 78 },
  { name: 'MySQL', category: 'Database', percentage: 80 },
  {
    name: 'AWS',
    category: 'Cloud & DevOps',
    percentage: 70,
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original.svg',
  },
  { name: 'Git & GitHub', category: 'Tools & Practices', percentage: 88 },
  { name: 'Agile Methodology', category: 'Tools & Practices', percentage: 85 },
]

const education = [
  {
    degree: 'BSc (Hons) in Software Engineering',
    institution: 'University of Bedfordshire',
    period: '2025 – Present',
    description:
      'Final year undergraduate, affiliated through SLIIT City Uni. Focus on MERN stack and full-stack development.',
    order: 1,
  },
  {
    degree: 'Higher Diploma in Information Technology',
    institution: 'SLIIT City Uni',
    period: '2022 – 2025',
    description: 'Foundation in software development, databases, and web technologies.',
    order: 2,
  },
]

const certificates = [
  {
    title: 'Higher Diploma in Information Technology',
    subtitle: 'Academic Qualification',
    category: 'Academic',
    issuer: 'SLIIT City Uni',
    issuedDate: new Date('2025-06-15'),
    status: 'published',
    thumbnail:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&h=90&fit=crop',
    credentialUrl: 'https://shathir-sheriff.vercel.app/',
    order: 1,
  },
  {
    title: 'NextGenAI App Bootcamp',
    subtitle: 'Professional Certificate',
    category: 'Programming',
    issuer: 'CodeWave',
    issuedDate: new Date('2026-01-31'),
    status: 'published',
    thumbnail:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    credentialUrl:
      'https://hyperstack.id/credential/8db7e00f-459b-4a9f-ad35-6826c42d7f1c',
    order: 2,
  },
  {
    title: 'Certificate in Artificial Intelligence',
    subtitle: 'Professional Certificate',
    category: 'Programming',
    issuer: 'AII',
    issuedDate: new Date('2024-11-20'),
    status: 'published',
    thumbnail:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&h=90&fit=crop',
    credentialUrl: '',
    order: 3,
  },
  {
    title: 'Certificate in Human Resource Management',
    subtitle: 'Professional Certificate',
    category: 'Professional',
    issuer: 'CIPM',
    issuedDate: new Date('2024-08-05'),
    status: 'published',
    thumbnail:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=120&h=90&fit=crop',
    credentialUrl: '',
    order: 4,
  },
  {
    title: 'G.C.E. Advance Level Certificate',
    subtitle: 'Academic Certificate',
    category: 'Academic',
    issuer: 'D.S. Sennanayaka National School, Beruwala',
    issuedDate: new Date('2022-12-18'),
    status: 'published',
    thumbnail:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&h=90&fit=crop',
    credentialUrl: '',
    order: 5,
  },
  {
    title: 'Wealth Management App — Codewave Academy',
    subtitle: 'Project Completion Certificate',
    category: 'Web Development',
    issuer: 'Codewave Academy',
    issuedDate: new Date('2025-01-15'),
    status: 'draft',
    thumbnail:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=90&fit=crop',
    credentialUrl: 'https://github.com/shathirs',
    order: 6,
  },
]

const messages = [
  {
    senderName: 'Portfolio Visitor',
    senderEmail: 'visitor@example.com',
    subject: 'Interested in your MERN projects',
    body: 'I reviewed your portfolio at shathir-sheriff.vercel.app and would like to discuss a collaboration opportunity.',
    read: false,
  },
]

async function seed() {
  await connectDB()

  await Promise.all([
    User.deleteMany(),
    Project.deleteMany(),
    Skill.deleteMany(),
    Message.deleteMany(),
    Education.deleteMany(),
    Certificate.deleteMany(),
    SiteProfile.deleteMany(),
  ])

  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'Shathir Sheriff',
    username: (process.env.ADMIN_USERNAME || 'admin').toLowerCase(),
    email: (process.env.ADMIN_EMAIL || 'admin@portfo.com').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin',
  })

  const [projectCount, skillCount, eduCount, certCount, messageCount, profileDoc] =
    await Promise.all([
      Project.insertMany(projects),
      Skill.insertMany(skills),
      Education.insertMany(education),
      Certificate.insertMany(certificates),
      Message.insertMany(messages),
      SiteProfile.create(defaultProfile),
    ])

  console.log('Database seeded from https://shathir-sheriff.vercel.app/')
  console.log(`  Projects:      ${projectCount.length}`)
  console.log(`  Skills:        ${skillCount.length}`)
  console.log(`  Education:     ${eduCount.length}`)
  console.log(`  Certificates:  ${certCount.length}`)
  console.log(`  Messages:      ${messageCount.length}`)
  console.log(`  Site profile:  ${profileDoc.name}`)
  console.log(
    `  Admin:         ${admin.username} (${admin.email}) — password hashed in MongoDB`,
  )

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
