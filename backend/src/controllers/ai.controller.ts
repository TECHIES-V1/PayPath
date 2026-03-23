import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as aiService from '../services/ai.service'

export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' })
    }

    const result = await aiService.chat(req.user!.id, message.trim())
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getInsights = async (req: AuthRequest, res: Response) => {
  try {
    const result = await aiService.getInsights(req.user!.id)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
