import { Router } from 'express'
import * as passportController from '../controllers/passport.controller'
import { protect } from '../middlewares/auth.middleware'

const router = Router()

router.use(protect as any)

router.get('/', passportController.getPassport as any)
router.get('/breakdown', passportController.getBreakdown as any)

export default router
