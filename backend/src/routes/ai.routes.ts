import { Router } from 'express'
import * as aiController from '../controllers/ai.controller'
import { protect } from '../middlewares/auth.middleware'
import { aiLimiter } from '../middlewares/rateLimit.middleware'

const router = Router()

router.use(protect as any)

router.post('/chat', aiLimiter, aiController.chat as any)
router.get('/insights', aiController.getInsights as any)

export default router
