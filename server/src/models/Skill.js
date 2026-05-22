import mongoose from 'mongoose'
import { SKILL_CATEGORIES } from '../config/skillCategories.js'

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: {
      type: String,
      required: true,
      enum: SKILL_CATEGORIES,
      default: 'Other',
    },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    icon: { type: String, default: '' },
  },
  { timestamps: true },
)

export const Skill = mongoose.model('Skill', skillSchema)
