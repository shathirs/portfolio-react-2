import { SiteProfile } from '../models/SiteProfile.js'
import { defaultProfile } from './defaultProfile.js'

export async function ensureProfile() {
  const count = await SiteProfile.countDocuments()
  if (count > 0) return

  await SiteProfile.create(defaultProfile)
  console.log('Site profile created in MongoDB')
}
