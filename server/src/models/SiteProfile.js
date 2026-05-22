import mongoose from 'mongoose'

const siteProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, default: '', trim: true },
    tagline: { type: String, default: '', trim: true },
    bio: { type: String, default: '' },
    email: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    degree: { type: String, default: '', trim: true },
    status: { type: String, default: 'Open to Work', trim: true },
    cvUrl: { type: String, default: '/Shathir_CV.pdf' },
    profileImage: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
  { timestamps: true },
)

export const SiteProfile = mongoose.model('SiteProfile', siteProfileSchema)
