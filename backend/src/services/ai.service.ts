import { buildFinancialContext } from './context.service'

const SYSTEM_PROMPT = `You are PayPath AI Coach — a friendly, knowledgeable personal finance advisor. You speak in a warm, encouraging tone. You use Nigerian Naira (₦) for all currency.

Your job is to:
- Analyze the user's spending patterns and give actionable advice
- Warn about overspending in specific categories
- Suggest ways to save more and reach their goals faster
- Answer questions about budgeting, saving, and financial health
- Stay positive and motivating — never judgmental

Keep responses concise (2-4 paragraphs max). Use bullet points for lists. Be specific with numbers when you have the user's data.`

export const chat = async (userId: string, message: string) => {
  const context = await buildFinancialContext(userId)

  const contextPrompt = `
User Financial Context:
- Name: ${context.userName}
- Monthly Income: ₦${context.monthlyIncome.toLocaleString()}
- Monthly Expenses: ₦${context.monthlyExpense.toLocaleString()}
- Balance: ₦${context.balance.toLocaleString()}
- Top spending categories: ${context.topCategories.map(c => `${c.category}: ₦${c.amount.toLocaleString()}`).join(', ') || 'No data yet'}
- Active goals: ${context.goals.map(g => `${g.name} (${g.progress}% of ₦${g.target.toLocaleString()})`).join(', ') || 'None set'}
- Transactions this month: ${context.transactionCount}
`

  // If ANTHROPIC_API_KEY is available, use Claude API
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: SYSTEM_PROMPT + contextPrompt,
          messages: [{ role: 'user', content: message }],
        }),
      })

      const data = await response.json() as any
      if (data.content && data.content[0]) {
        return { response: data.content[0].text, context }
      }
    } catch (error) {
      console.error('Claude API error:', error)
    }
  }

  // Fallback: smart rule-based responses when no API key
  return { response: generateFallbackResponse(message, context), context }
}

export const getInsights = async (userId: string) => {
  const context = await buildFinancialContext(userId)
  const insights: string[] = []

  if (context.monthlyExpense > context.monthlyIncome * 0.8) {
    insights.push(`You've spent ${Math.round((context.monthlyExpense / context.monthlyIncome) * 100)}% of your income this month. Consider cutting back on non-essentials.`)
  }

  if (context.topCategories.length > 0) {
    const topCategory = context.topCategories[0]
    const pct = context.monthlyIncome > 0
      ? Math.round((topCategory.amount / context.monthlyIncome) * 100)
      : 0
    if (pct > 30) {
      insights.push(`${topCategory.category} is your biggest expense at ${pct}% of income (₦${topCategory.amount.toLocaleString()}). Look for ways to reduce this.`)
    }
  }

  if (context.goals.length > 0) {
    const behindGoals = context.goals.filter((g) => g.progress < 50 && new Date(g.deadline) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    for (const goal of behindGoals) {
      insights.push(`Your "${goal.name}" goal is at ${goal.progress}% with the deadline approaching. Consider increasing your contributions.`)
    }
  }

  if (context.transactionCount === 0) {
    insights.push("You haven't logged any transactions this month. Regular logging helps you understand your spending patterns.")
  }

  if (insights.length === 0) {
    insights.push("You're on track! Keep logging your transactions and contributing to your goals.")
  }

  return { insights, context }
}

function generateFallbackResponse(message: string, context: any): string {
  const lower = message.toLowerCase()

  if (lower.includes('save') || lower.includes('saving')) {
    const savingsRate = context.monthlyIncome > 0
      ? Math.round(((context.monthlyIncome - context.monthlyExpense) / context.monthlyIncome) * 100)
      : 0
    return `Based on your data, you're currently saving about ${savingsRate}% of your income. The recommended target is 20% (₦${Math.round(context.monthlyIncome * 0.2).toLocaleString()}/month). ${savingsRate < 20 ? "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings." : "Great job — you're above the recommended savings rate!"}`
  }

  if (lower.includes('spend') || lower.includes('expense')) {
    if (context.topCategories.length > 0) {
      const cats = context.topCategories.slice(0, 3).map((c: any) => `${c.category}: ₦${c.amount.toLocaleString()}`).join(', ')
      return `Your top spending categories this month: ${cats}. Total expenses: ₦${context.monthlyExpense.toLocaleString()} out of ₦${context.monthlyIncome.toLocaleString()} income.`
    }
    return "Start logging your transactions so I can analyze your spending patterns and give personalized advice!"
  }

  if (lower.includes('goal')) {
    if (context.goals.length > 0) {
      const goalInfo = context.goals.map((g: any) => `${g.name}: ${g.progress}% complete`).join(', ')
      return `Here's your goals progress: ${goalInfo}. Keep contributing regularly to stay on track!`
    }
    return "You haven't set any savings goals yet. Setting goals helps you stay motivated and track your progress."
  }

  if (lower.includes('afford') || lower.includes('can i')) {
    return `Your current balance this month is ₦${context.balance.toLocaleString()}. Consider whether the purchase fits within your budget while still allowing you to save 20% of your income (₦${Math.round(context.monthlyIncome * 0.2).toLocaleString()}).`
  }

  return `I'm your PayPath AI Coach! I can help with budgeting, saving strategies, spending analysis, and reaching your financial goals. Your current monthly balance is ₦${context.balance.toLocaleString()}. What would you like to know?`
}
