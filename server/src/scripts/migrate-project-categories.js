/**
 * One-time migration: map legacy project categories in MongoDB.
 * Run: node src/scripts/migrate-project-categories.js
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { Project } from '../models/Project.js'
import { normalizeProjectCategory } from '../config/projectCategories.js'

async function migrate() {
  await connectDB()
  const projects = await Project.find()
  let updated = 0

  for (const project of projects) {
    const prev = project.category
    const next = normalizeProjectCategory(prev)
    if (prev !== next) {
      project.category = next
      await project.save()
      updated += 1
      console.log(`  ${project.title}: "${prev}" -> "${next}"`)
    }
  }

  console.log(`Done. Updated ${updated} of ${projects.length} project(s).`)
  await mongoose.disconnect()
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
