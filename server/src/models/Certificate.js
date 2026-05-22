import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Web Development',
        'Database',
        'Programming',
        'Tools & Platforms',
        'Academic',
        'Professional',
        'Other',
      ],
      default: 'Professional',
    },
    issuer: { type: String, required: true, trim: true },
    issuedDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['published', 'draft', 'deleted'],
      default: 'published',
    },
    thumbnail: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Certificate = mongoose.model('Certificate', certificateSchema)
