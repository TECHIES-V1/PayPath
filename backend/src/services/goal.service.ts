import prisma from '../lib/prisma'
import { Prisma } from '@prisma/client'

interface CreateGoalData {
  name: string
  targetAmount: number
  deadline: string
}

export const create = async (userId: string, data: CreateGoalData) => {
  const goal = await prisma.goal.create({
    data: {
      userId,
      name: data.name,
      targetAmount: new Prisma.Decimal(data.targetAmount),
      deadline: new Date(data.deadline),
    },
  })
  return goal
}

export const getAll = async (userId: string) => {
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return goals.map((goal) => ({
    ...goal,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
    progress: Number(goal.targetAmount) > 0
      ? Math.min(100, Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100))
      : 0,
  }))
}

export const getById = async (userId: string, id: string) => {
  const goal = await prisma.goal.findFirst({ where: { id, userId } })
  if (!goal) throw new Error('Goal not found')

  return {
    ...goal,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
    progress: Number(goal.targetAmount) > 0
      ? Math.min(100, Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100))
      : 0,
  }
}

export const update = async (userId: string, id: string, data: Partial<CreateGoalData>) => {
  const existing = await prisma.goal.findFirst({ where: { id, userId } })
  if (!existing) throw new Error('Goal not found')

  const goal = await prisma.goal.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.targetAmount !== undefined && { targetAmount: new Prisma.Decimal(data.targetAmount) }),
      ...(data.deadline && { deadline: new Date(data.deadline) }),
    },
  })
  return goal
}

export const remove = async (userId: string, id: string) => {
  const existing = await prisma.goal.findFirst({ where: { id, userId } })
  if (!existing) throw new Error('Goal not found')

  await prisma.goal.delete({ where: { id } })
  return { message: 'Goal deleted' }
}

export const contribute = async (userId: string, id: string, amount: number) => {
  const existing = await prisma.goal.findFirst({ where: { id, userId } })
  if (!existing) throw new Error('Goal not found')

  const newAmount = Number(existing.currentAmount) + amount
  const goal = await prisma.goal.update({
    where: { id },
    data: { currentAmount: new Prisma.Decimal(newAmount) },
  })

  return {
    ...goal,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
    progress: Number(goal.targetAmount) > 0
      ? Math.min(100, Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100))
      : 0,
  }
}
