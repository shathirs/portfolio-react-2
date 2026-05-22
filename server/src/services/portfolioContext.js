import { Project } from '../models/Project.js'
import { Skill } from '../models/Skill.js'
import { Education } from '../models/Education.js'
import { Certificate } from '../models/Certificate.js'
import { SiteProfile } from '../models/SiteProfile.js'
import { defaultProfile } from '../config/defaultProfile.js'
import { mapDoc } from '../utils/mapDoc.js'

function trimText(text, max = 600) {
  const s = String(text ?? '').trim()
  if (s.length <= max) return s
  return `${s.slice(0, max)}…`
}

function linkLine(label, url) {
  const u = String(url ?? '').trim()
  return u ? `- ${label}: ${u}` : null
}

export async function buildPortfolioContext() {
  const [profileDoc, projects, skills, education, certificates] = await Promise.all([
    SiteProfile.findOne().sort({ createdAt: 1 }),
    Project.find({ status: 'published' }).sort({ createdAt: -1 }),
    Skill.find().sort({ category: 1, percentage: -1 }),
    Education.find().sort({ order: 1, createdAt: -1 }),
    Certificate.find({ status: 'published' }).sort({ order: 1, issuedDate: -1 }),
  ])

  const profile = mapDoc(profileDoc) ?? defaultProfile
  const lines = []

  lines.push('=== PROFILE ===')
  lines.push(`Name: ${profile.name}`)
  lines.push(`Title: ${profile.title}`)
  lines.push(`Tagline: ${profile.tagline}`)
  lines.push(`Bio: ${profile.bio}`)
  lines.push(`Email: ${profile.email}`)
  lines.push(`Phone: ${profile.phone}`)
  lines.push(`Location: ${profile.location}`)
  lines.push(`Degree: ${profile.degree}`)
  lines.push(`Status: ${profile.status}`)
  for (const row of [
    linkLine('CV / resume', profile.cvUrl),
    linkLine('GitHub', profile.github),
    linkLine('LinkedIn', profile.linkedin),
    linkLine('Profile image', profile.profileImage),
  ]) {
    if (row) lines.push(row)
  }

  if (skills.length > 0) {
    lines.push('', '=== SKILLS ===')
    for (const skill of skills) {
      lines.push(
        `- ${skill.name} (${skill.category}) — ${skill.percentage}% proficiency`,
      )
    }
  }

  if (education.length > 0) {
    lines.push('', '=== EDUCATION ===')
    for (const entry of education) {
      lines.push(`- ${entry.degree} @ ${entry.institution} (${entry.period})`)
      if (entry.description) lines.push(`  ${trimText(entry.description, 400)}`)
      const demo = linkLine('  Live demo / program link', entry.liveDemoUrl)
      if (demo) lines.push(demo)
    }
  }

  if (certificates.length > 0) {
    lines.push('', '=== CERTIFICATES ===')
    for (const cert of certificates) {
      lines.push(`- ${cert.title} — ${cert.issuer} (${cert.category})`)
      if (cert.subtitle) lines.push(`  ${cert.subtitle}`)
      if (cert.issuedDate) {
        lines.push(`  Issued: ${new Date(cert.issuedDate).toISOString().slice(0, 10)}`)
      }
      for (const row of [
        linkLine('  Credential URL', cert.credentialUrl),
        linkLine('  Thumbnail / image', cert.thumbnail),
      ]) {
        if (row) lines.push(row)
      }
    }
  }

  if (projects.length > 0) {
    lines.push('', '=== PROJECTS (published) ===')
    for (const project of projects) {
      lines.push(`- ${project.title} [${project.category}]`)
      lines.push(`  Summary: ${trimText(project.shortDescription, 300)}`)
      const features = project.keyFeatures ?? []
      if (features.length > 0) {
        lines.push(`  Key features: ${features.join('; ')}`)
      }
      lines.push(`  Details: ${trimText(project.detailedDescription, 500)}`)
      lines.push(`  Tech: ${(project.technologies || []).join(', ')}`)
      for (const row of [
        linkLine('  Live demo', project.liveDemoUrl),
        linkLine('  Source code', project.sourceCodeUrl),
        linkLine('  Cover image', project.imageUrl),
      ]) {
        if (row) lines.push(row)
      }
      const media = project.media ?? []
      for (const item of media) {
        lines.push(
          `  Media [${item.type}]: ${item.title || item.fileName || 'file'} — ${item.url}`,
        )
      }
    }
  }

  return lines.join('\n')
}
