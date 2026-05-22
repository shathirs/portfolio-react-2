import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { RevokedToken } from '../models/RevokedToken.js'
import { mapDoc } from '../utils/mapDoc.js'
import { hashToken } from '../utils/tokenHash.js'
import { protect } from '../middleware/auth.js'

const router = Router()

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body
    const loginId = (username || email || '').toLowerCase().trim()

    if (!loginId || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const user = await User.findOne({
      $or: [{ username: loginId }, { email: loginId }],
    }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const token = signToken(user._id)
    res.json({
      token,
      user: mapDoc(user),
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/me', protect, (req, res) => {
  res.json({ user: mapDoc(req.user) })
})

router.post('/logout', protect, async (req, res) => {
  try {
    const token = req.authToken
    if (!token) {
      return res.status(400).json({ message: 'No active session' })
    }

    const decoded = jwt.decode(token)
    if (!decoded?.exp) {
      return res.status(400).json({ message: 'Invalid session token' })
    }

    await RevokedToken.findOneAndUpdate(
      { tokenHash: hashToken(token) },
      {
        tokenHash: hashToken(token),
        userId: req.user._id,
        expiresAt: new Date(decoded.exp * 1000),
      },
      { upsert: true, new: true },
    )

    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    console.error('Logout error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
