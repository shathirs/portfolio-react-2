import mongoose from 'mongoose'
import { PROJECT_CATEGORIES } from '../config/projectCategories.js'

const projectMediaSchema = new mongoose.Schema(
  {
    title: { type: String, default: '', trim: true },
    type: {
      type: String,
      enum: ['image', 'video', 'pdf', 'document'],
      required: true,
    },
    url: { type: String, required: true, trim: true },
    mimeType: { type: String, default: '' },
    fileName: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: true },
)

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: PROJECT_CATEGORIES,
    },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, default: '' },
    keyFeatures: { type: [String], default: [] },
    liveDemoUrl: { type: String, default: '' },
    sourceCodeUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    media: { type: [projectMediaSchema], default: [] },
    technologies: { type: [String], default: [] },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  },
  { timestamps: true },
)

export const Project = mongoose.model('Project', projectSchema)
