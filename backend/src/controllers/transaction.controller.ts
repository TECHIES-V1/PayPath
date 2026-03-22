import { Request, Response } from 'express'
import * as transactionService from '../services/transaction.service'

export const createTransaction = async (req: Request, res:Response) => {
    try {
        const userId = (req as any).user.id
        const { amount, type, category, date } = req.body

        const transaction = await transactionService.createTransaction(
            userId,
            amount,
            type,
            category,
            date ? new Date(date) : undefined
        )

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction
        })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { type, category } = req.query

    const transactions = await transactionService.getTransactions(
      userId,
      type as string | undefined,
      category as string | undefined
    )

    res.status(200).json({ transactions })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const  id  = req.params.id as string
    const { amount, type, category, date } = req.body

    const transaction = await transactionService.updateTransaction(
      id,
      userId,
      { amount, type, category, date: date ? new Date(date) : undefined }
    )

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const  id  = req.params.id as string

    await transactionService.deleteTransaction(id, userId)

    res.status(200).json({ message: 'Transaction deleted successfully' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
