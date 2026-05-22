import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    senderName: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Message = mongoose.model('Message', messageSchema)
