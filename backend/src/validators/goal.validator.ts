import { z } from 'zod'

export const createGoalSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  targetAmount: z.number().positive('Target amount must be positive'),
  deadline: z.string().datetime({ message: 'Valid deadline date is required' }),
})

export const updateGoalSchema = createGoalSchema.partial()

export const contributeSchema = z.object({
  amount: z.number().positive('Contribution amount must be positive'),
})
