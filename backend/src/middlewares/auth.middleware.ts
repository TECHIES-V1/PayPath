import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string }
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Not authorized — no token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Token invalid' })
    }

    req.user = { id: decoded.id }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' })
  }
}
