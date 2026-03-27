import { z } from 'zod'

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense'], { message: 'Type must be income or expense' }),
  category: z.string().min(1, 'Category is required').max(50),
  date: z.string().datetime().optional(),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
})

export const updateTransactionSchema = createTransactionSchema.partial()
