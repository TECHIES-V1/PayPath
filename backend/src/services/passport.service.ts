import prisma from '../lib/prisma'
import { Prisma } from '@prisma/client'

function getTier(score: number): string {
  if (score >= 80) return 'Trusted'
  if (score >= 60) return 'Stable'
  if (score >= 40) return 'Builder'
  return 'Starter'
}

function getBadges(score: number, savingsStreak: number, transactionCount: number): string[] {
  const badges: string[] = []
  if (transactionCount >= 1) badges.push('First Step')
  if (transactionCount >= 10) badges.push('Logger')
  if (transactionCount >= 50) badges.push('Dedicated Tracker')
  if (savingsStreak >= 3) badges.push('Saver')
  if (savingsStreak >= 7) badges.push('Streak Master')
  if (score >= 40) badges.push('Builder')
  if (score >= 60) badges.push('Financially Stable')
  if (score >= 80) badges.push('Trusted')
  return badges
}

export const calculateScore = async (userId: string) => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [transactions, goals] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'desc' },
    }),
    prisma.goal.findMany({ where: { userId } }),
  ])

  // Savings streak: days with at least one income transaction in last 30 days
  const daysWithSavings = new Set<string>()
  for (const tx of transactions) {
    if (tx.type === 'income') {
      daysWithSavings.add(tx.date.toISOString().split('T')[0])
    }
  }
  const savingsStreak = Math.min(30, daysWithSavings.size)
  const completedGoals = goals.filter((goal) => Number(goal.currentAmount) >= Number(goal.targetAmount))

  // Budget adherence: income > expense ratio (max 100%)
  let totalIncome = 0
  let totalExpense = 0
  for (const tx of transactions) {
    const amount = Number(tx.amount)
    if (tx.type === 'income') totalIncome += amount
    else totalExpense += amount
  }
  const budgetAdherence = totalIncome > 0
    ? Math.min(100, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
    : 0

  // Income consistency: regular income logging
  const incomeConsistency = transactions.length > 0
    ? Math.min(100, Math.round((daysWithSavings.size / 30) * 100))
    : 0

  // Score = weighted average
  const score = Math.round(
    (savingsStreak / 30 * 100) * 0.3 +
    budgetAdherence * 0.4 +
    incomeConsistency * 0.3
  )
  const clampedScore = Math.max(0, Math.min(100, score))
  const tier = getTier(clampedScore)
  const badges = getBadges(clampedScore, savingsStreak, transactions.length)

  // Upsert passport record
  await prisma.passport.upsert({
    where: { id: `${userId}-passport` },
    update: {
      score: clampedScore,
      tier,
      savingsStreak,
      budgetAdherence: new Prisma.Decimal(budgetAdherence),
      incomeConsistency: new Prisma.Decimal(incomeConsistency),
    },
    create: {
      id: `${userId}-passport`,
      userId,
      score: clampedScore,
      tier,
      savingsStreak,
      budgetAdherence: new Prisma.Decimal(budgetAdherence),
      incomeConsistency: new Prisma.Decimal(incomeConsistency),
    },
  })

  return {
    score: clampedScore,
    tier,
    badges,
    savingsStreak,
    budgetAdherence,
    incomeConsistency,
    completedGoalsCount: completedGoals.length,
    hasCompletedGoal: completedGoals.length > 0,
  }
}

export const getPassport = async (userId: string) => {
  const result = await calculateScore(userId)
  return result
}

export const getBreakdown = async (userId: string) => {
  const result = await calculateScore(userId)
  return {
    score: result.score,
    tier: result.tier,
    badges: result.badges,
    factors: [
      { name: 'Savings Streak', weight: 30, value: Math.round(result.savingsStreak / 30 * 100), description: `${result.savingsStreak} days with savings this month` },
      { name: 'Budget Adherence', weight: 40, value: result.budgetAdherence, description: 'Income vs expense ratio' },
      { name: 'Income Consistency', weight: 30, value: result.incomeConsistency, description: 'Regular income logging pattern' },
    ],
  }
}
