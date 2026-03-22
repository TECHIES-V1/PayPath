import { Request, Response } from 'express'
import * as authService from '../services/auth.service'
import { registerSchema, loginSchema } from '../validators/auth.validator'
import { AuthRequest } from '../middlewares/auth.middleware'

export const register = async (req: Request, res: Response) => {
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
    const status = error.message === 'User already exists' ? 409 : 400
    res.status(status).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
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
    res.status(401).json({ message: error.message })
  }
}

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const user = await authService.getMe(userId)
    res.status(200).json({ user })
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}
