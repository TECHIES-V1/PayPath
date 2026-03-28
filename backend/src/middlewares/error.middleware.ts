import { NextFunction, Request, Response } from 'express'
import { Prisma } from '@prisma/client'

const CONNECTION_ERROR_MESSAGE = 'Connection error. Please check your internet connection.'

function isPrismaConnectionError(err: unknown) {
  if (
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientRustPanicError
  ) {
    return true
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return ['P1000', 'P1001', 'P1002', 'P1017'].includes(err.code)
  }

  if (err instanceof Error) {
    return /prisma|database|connection/i.test(err.message)
  }

  return false
}

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  const isConnectionError = isPrismaConnectionError(err)

  console.error(`[Error] ${req.method} ${req.path}:`, err)

  if (isConnectionError || statusCode >= 500) {
    return res.status(isConnectionError ? 503 : 500).json({
      message: CONNECTION_ERROR_MESSAGE,
    })
  }

  const message = err instanceof Error && err.message ? err.message : 'Something went wrong. Please try again.'

  return res.status(statusCode).json({ message })
}
