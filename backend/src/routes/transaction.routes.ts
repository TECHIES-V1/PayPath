import { Router } from 'express'
import * as transactionController from '../controllers/transaction.controller'
import { protect } from '../middlewares/auth.middleware'

const router = Router()

router.use(protect as any)

router.post('/', transactionController.create as any)
router.get('/', transactionController.getAll as any)
router.get('/summary', transactionController.getSummary as any)
router.get('/:id', transactionController.getById as any)
router.put('/:id', transactionController.update as any)
router.delete('/:id', transactionController.remove as any)

export default router
