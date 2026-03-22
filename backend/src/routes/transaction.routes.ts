import { Router } from "express";
import * as transactionController from '../controllers/transaction.controller'
import { protect } from "../middlewares/auth.middleware";

const router = Router()

router.use(protect)

router.post('/', transactionController.createTransaction)
router.get('/', transactionController.getTransactions)
router.put('/:id', transactionController.updateTransaction)
router.delete('/:id', transactionController.deleteTransaction)

export default router