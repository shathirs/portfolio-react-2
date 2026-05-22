import mongoose from 'mongoose'

const revokedTokenSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
)

revokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const RevokedToken = mongoose.model('RevokedToken', revokedTokenSchema)
