import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as transactionService from '../services/transaction.service'
import { createTransactionSchema, updateTransactionSchema } from '../validators/transaction.validator'

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createTransactionSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message })
    }
    const transaction = await transactionService.create(req.user!.id, parsed.data)
    res.status(201).json({ message: 'Transaction created', transaction })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    const filters = {
      type: req.query.type as string,
      category: req.query.category as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    }
    const result = await transactionService.getAll(req.user!.id, filters)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await transactionService.getById(req.user!.id, req.params.id as string)
    res.status(200).json({ transaction })
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = updateTransactionSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message })
    }
    const transaction = await transactionService.update(req.user!.id, req.params.id as string, parsed.data)
    res.status(200).json({ message: 'Transaction updated', transaction })
  } catch (error: any) {
    const status = error.message === 'Transaction not found' ? 404 : 400
    res.status(status).json({ message: error.message })
  }
}

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const result = await transactionService.remove(req.user!.id, req.params.id as string)
    res.status(200).json(result)
  } catch (error: any) {
    const status = error.message === 'Transaction not found' ? 404 : 400
    res.status(status).json({ message: error.message })
  }
}

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const summary = await transactionService.getSummary(req.user!.id)
    res.status(200).json({ summary })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
