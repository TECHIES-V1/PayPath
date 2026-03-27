import { NextFunction, Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as passportService from '../services/passport.service'

export const getPassport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const passport = await passportService.getPassport(req.user!.id)
    res.status(200).json({ passport })
  } catch (error: any) {
    res.status(500)
    next(error)
  }
}

export const getBreakdown = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const breakdown = await passportService.getBreakdown(req.user!.id)
    res.status(200).json({ breakdown })
  } catch (error: any) {
    res.status(500)
    next(error)
  }
}
