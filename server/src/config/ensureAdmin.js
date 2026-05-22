import { User } from '../models/User.js'

/**
 * Ensures one admin account exists in MongoDB (from .env on first run).
 * Password is bcrypt-hashed by the User model before save.
 */
export async function ensureAdmin() {
  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim()
  const email = (process.env.ADMIN_EMAIL || 'admin@portfo.com').toLowerCase().trim()
  const name = process.env.ADMIN_NAME || 'Administrator'
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    console.warn('ADMIN_PASSWORD is not set — skipping admin user creation')
    return
  }

  const existing = await User.findOne({
    $or: [{ username }, { email }],
  })

  if (existing) {
    console.log(`Admin user already in MongoDB: ${existing.username}`)
    return
  }

  await User.create({
    name,
    username,
    email,
    password,
    role: 'admin',
  })

  console.log(`Admin user stored in MongoDB (username: ${username})`)
}
