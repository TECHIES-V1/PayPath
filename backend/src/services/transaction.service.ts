import prisma from '../lib/prisma'
import { Prisma } from '@prisma/client'

interface CreateTransactionData {
  amount: number
  type: string
  category: string
  date?: string
  notes?: string
}

interface TransactionFilters {
  type?: string
  category?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export const create = async (userId: string, data: CreateTransactionData) => {
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount: new Prisma.Decimal(data.amount),
      type: data.type,
      category: data.category,
      date: data.date ? new Date(data.date) : new Date(),
      notes: data.notes?.trim() ? data.notes.trim() : null,
    },
  })
  return transaction
}

export const getAll = async (userId: string, filters: TransactionFilters) => {
  const page = filters.page || 1
  const limit = filters.limit || 20
  const skip = (page - 1) * limit

  const where: any = { userId }
  if (filters.type) where.type = filters.type
  if (filters.category) where.category = filters.category
  if (filters.startDate || filters.endDate) {
    where.date = {}
    if (filters.startDate) where.date.gte = new Date(filters.startDate)
    if (filters.endDate) where.date.lte = new Date(filters.endDate)
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ])

  return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export const getById = async (userId: string, id: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
  })
  if (!transaction) throw new Error('Transaction not found')
  return transaction
}

export const update = async (userId: string, id: string, data: Partial<CreateTransactionData>) => {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } })
  if (!existing) throw new Error('Transaction not found')

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...(data.amount !== undefined && { amount: new Prisma.Decimal(data.amount) }),
      ...(data.type && { type: data.type }),
      ...(data.category && { category: data.category }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.notes !== undefined && { notes: data.notes.trim() ? data.notes.trim() : null }),
    },
  })
  return transaction
}

export const remove = async (userId: string, id: string) => {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } })
  if (!existing) throw new Error('Transaction not found')

  await prisma.transaction.delete({ where: { id } })
  return { message: 'Transaction deleted' }
}

export const getSummary = async (userId: string) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startOfMonth, lte: endOfMonth },
    },
  })

  let income = 0
  let expense = 0
  for (const tx of transactions) {
    const amount = Number(tx.amount)
    if (tx.type === 'income') income += amount
    else expense += amount
  }

  return {
    income,
    expense,
    balance: income - expense,
    transactionCount: transactions.length,
    month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
  }
}
