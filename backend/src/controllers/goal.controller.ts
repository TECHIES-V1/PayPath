import { NextFunction, Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as goalService from '../services/goal.service'
import { createGoalSchema, updateGoalSchema, contributeSchema } from '../validators/goal.validator'

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = createGoalSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message })
    }
    const goal = await goalService.create(req.user!.id, parsed.data)
    res.status(201).json({ message: 'Goal created', goal })
  } catch (error: any) {
    res.status(400)
    next(error)
  }
}

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const goals = await goalService.getAll(req.user!.id)
    res.status(200).json({ goals })
  } catch (error: any) {
    res.status(400)
    next(error)
  }
}

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const goal = await goalService.getById(req.user!.id, req.params.id as string)
    res.status(200).json({ goal })
  } catch (error: any) {
    res.status(404)
    next(error)
  }
}

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = updateGoalSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message })
    }
    const goal = await goalService.update(req.user!.id, req.params.id as string, parsed.data)
    res.status(200).json({ message: 'Goal updated', goal })
  } catch (error: any) {
    res.status(error.message === 'Goal not found' ? 404 : 400)
    next(error)
  }
}

export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await goalService.remove(req.user!.id, req.params.id as string)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(error.message === 'Goal not found' ? 404 : 400)
    next(error)
  }
}

export const contribute = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = contributeSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message })
    }
    const goal = await goalService.contribute(req.user!.id, req.params.id as string, parsed.data.amount)
    res.status(200).json({ message: 'Contribution added', goal })
  } catch (error: any) {
    res.status(error.message === 'Goal not found' ? 404 : 400)
    next(error)
  }
}
