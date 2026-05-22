import { resolveAuthUser } from '../utils/resolveAuthUser.js'

export async function protect(req, res, next) {
  const user = await resolveAuthUser(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authorized' })
  }
  req.user = user
  next()
}
