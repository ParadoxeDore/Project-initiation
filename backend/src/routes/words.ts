import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { validateQuery } from '../middleware/validate'
import { themeQuerySchema } from '../middleware/schemas/wordSchemas'
import * as wordService from '../services/wordService'
import type { Theme } from '../../../shared/types/words'

const router = Router()

router.get(
  '/pair',
  validateQuery(themeQuerySchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const theme = req.query['theme'] as Theme
      const result = await wordService.drawWordPair(theme)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
)

export default router
