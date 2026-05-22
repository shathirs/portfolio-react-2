import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { RevokedToken } from '../models/RevokedToken.js'
import { hashToken } from './tokenHash.js'

/** Resolve admin user from Bearer header or ?token= (for SSE). */
export async function resolveAuthUser(req) {
  const header = req.headers.authorization
  const queryToken =
    typeof req.query?.token === 'string' ? req.query.token.trim() : ''
  const token =
    header?.startsWith('Bearer ') ? header.split(' ')[1] : queryToken || null

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const revoked = await RevokedToken.findOne({ tokenHash: hashToken(token) })
    if (revoked) return null

    const user = await User.findById(decoded.id).select('-password')
    return user ?? null
  } catch {
    return null
  }
}
