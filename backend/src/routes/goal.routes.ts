import { Router } from 'express'
import * as goalController from '../controllers/goal.controller'
import { protect } from '../middlewares/auth.middleware'

const router = Router()

router.use(protect as any)

router.post('/', goalController.create as any)
router.get('/', goalController.getAll as any)
router.get('/:id', goalController.getById as any)
router.put('/:id', goalController.update as any)
router.delete('/:id', goalController.remove as any)
router.post('/:id/contribute', goalController.contribute as any)

export default router
