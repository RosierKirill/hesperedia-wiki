import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { hashPassword, comparePassword } from '../utils/password'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { authenticate } from '../middleware/auth'
import { authLimiter } from '../middleware/rateLimiter'

const router = Router()

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(100),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/register', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body)

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })
    if (existing) {
      res.status(409).json({ error: { message: 'Email or username already taken' } })
      return
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: { email, username, passwordHash },
      select: { id: true, email: true, username: true, role: true, createdAt: true },
    })

    const payload = { id: user.id, email: user.email, role: user.role as never }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    res.status(201).json({ data: { user, accessToken, refreshToken } })
  } catch (err) {
    next(err)
  }
})

router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      res.status(401).json({ error: { message: 'Invalid email or password' } })
      return
    }

    const payload = { id: user.id, email: user.email, role: user.role as never }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    const { passwordHash: _, ...safeUser } = user
    res.json({ data: { user: safeUser, accessToken, refreshToken } })
  } catch (err) {
    next(err)
  }
})

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(401).json({ error: { message: 'Refresh token required' } })
      return
    }

    const payload = verifyRefreshToken(refreshToken)
    const user = await prisma.user.findUnique({ where: { id: payload.id } })
    if (!user) {
      res.status(401).json({ error: { message: 'User not found' } })
      return
    }

    const newPayload = { id: user.id, email: user.email, role: user.role as never }
    const accessToken = signAccessToken(newPayload)
    res.json({ data: { accessToken } })
  } catch (err) {
    next(err)
  }
})

router.delete('/logout', authenticate, (_req: Request, res: Response) => {
  res.json({ data: { message: 'Logged out' } })
})

export default router
