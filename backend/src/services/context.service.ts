import prisma from '../lib/prisma'

export const buildFinancialContext = async (userId: string) => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [transactions, goals, user] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId, date: { gte: startOfMonth } },
      orderBy: { date: 'desc' },
      take: 50,
    }),
    prisma.goal.findMany({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ])

  let monthlyIncome = 0
  let monthlyExpense = 0
  const categoryBreakdown: Record<string, number> = {}

  for (const tx of transactions) {
    const amount = Number(tx.amount)
    if (tx.type === 'income') {
      monthlyIncome += amount
    } else {
      monthlyExpense += amount
      categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + amount
    }
  }

  const goalsContext = goals.map((g) => ({
    name: g.name,
    target: Number(g.targetAmount),
    current: Number(g.currentAmount),
    progress: Number(g.targetAmount) > 0
      ? Math.round((Number(g.currentAmount) / Number(g.targetAmount)) * 100)
      : 0,
    deadline: g.deadline.toISOString().split('T')[0],
  }))

  return {
    userName: user?.name || 'User',
    monthlyIncome,
    monthlyExpense,
    balance: monthlyIncome - monthlyExpense,
    topCategories: Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount })),
    goals: goalsContext,
    transactionCount: transactions.length,
  }
}
