import { Request, Response } from 'express'
import * as authService from '../services/auth.service'

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    const result = await authService.register(name, email, password)

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
      message: 'Account created successfully',
      user: result.user,
      token: result.token
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const result = await authService.login(email, password)

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id

    const user = await authService.getMe(userId)

    res.status(200).json({ user })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}