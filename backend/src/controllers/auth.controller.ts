import { NextFunction, Request, Response } from 'express'
import * as authService from '../services/auth.service'
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/auth.validator'
import { AuthRequest } from '../middlewares/auth.middleware'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message,
      })
    }

    const { name, email, password } = parsed.data
    const result = await authService.register(name, email, password)

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      message: 'Account created successfully',
      user: result.user,
      token: result.token,
    })
  } catch (error: any) {
    res.status(error.message === 'User already exists' ? 409 : 400)
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message,
      })
    }

    const { email, password } = parsed.data
    const result = await authService.login(email, password)

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
    })
  } catch (error: any) {
    res.status(401)
    next(error)
  }
}

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const user = await authService.getMe(userId)
    res.status(200).json({ user })
  } catch (error: any) {
    res.status(404)
    next(error)
  }
}

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message })
    }

    const user = await authService.updateProfile(req.user!.id, parsed.data.name.trim())
    res.status(200).json({ message: 'Profile updated', user })
  } catch (error: any) {
    res.status(400)
    next(error)
  }
}

export const updateAvatarPlaceholder = async (_req: AuthRequest, res: Response) => {
  res.status(501).json({ message: 'Profile photo upload is not implemented yet' })
}
