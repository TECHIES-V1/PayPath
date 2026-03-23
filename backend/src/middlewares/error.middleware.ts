import { Request, Response, NextFunction } from 'express'

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message)

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500

  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}
