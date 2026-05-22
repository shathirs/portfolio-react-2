import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    liveDemoUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Education = mongoose.model('Education', educationSchema)
