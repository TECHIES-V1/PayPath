import prisma from '../lib/prisma'

export const createTransaction = async (
  userId: string,
  amount: number,
  type: string,
  category: string,
  date?: Date
) => {
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      amount,
      type,
      category,
      date: date || new Date()
    }
  })

  return transaction
}

export const getTransactions = async (
  userId: string,
  type?: string | undefined,
  category?: string | undefined
) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(type && { type }),
      ...(category && { category })
    },
    orderBy: {
      date: 'desc'
    }
  })

  return transactions
}

export const updateTransaction = async (
  id: string,
  userId: string,
  data: {
    amount?: number
    type?: string
    category?: string
    date?: Date
  }
) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id }
  })

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  if (transaction.userId !== userId) {
    throw new Error('Not authorized')
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data
  })

  return updated
}

export const deleteTransaction = async (
  id: string,
  userId: string
) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id }
  })

  if (!transaction) {
    throw new Error('Transaction not found')
  }

  if (transaction.userId !== userId) {
    throw new Error('Not authorized')
  }

  await prisma.transaction.delete({
    where: { id }
  })

  return { message: 'Transaction deleted successfully' }
}