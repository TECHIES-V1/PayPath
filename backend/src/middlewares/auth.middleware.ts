import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const protect = (req: Request, res: Response, next: NextFunction) => {
    try { 
        const token = req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(400).json({ message: 'Not authorized' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        ;(req as any).user = decoded

        next()
    } catch (error) { 
      res.status(401).json({ message: 'Token invalid or expired' }) 
    }
}