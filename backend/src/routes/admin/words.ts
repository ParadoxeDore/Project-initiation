import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { adminAuth } from '../../middleware/adminAuth'
import { validateBody } from '../../middleware/validate'
import { createWordPairSchema, updateWordPairSchema } from '../../middleware/schemas/wordSchemas'
import * as wordService from '../../services/wordService'
import type { PairFilters } from '../../models/wordPair'
import type { Theme } from '../../../../shared/types/words'

const router = Router()

router.use(adminAuth)

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters: PairFilters = {}
    if (req.query['theme']) filters.theme = req.query['theme'] as Theme
    if (req.query['activeOnly'] === 'true') filters.activeOnly = true
    if (req.query['page']) filters.page = parseInt(req.query['page'] as string, 10)
    if (req.query['pageSize']) filters.pageSize = parseInt(req.query['pageSize'] as string, 10)
    const result = await wordService.listWordPairs(filters)
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.post(
  '/',
  validateBody(createWordPairSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pair = await wordService.createWordPair(req.body)
      res.status(201).json(pair)
    } catch (err) {
      next(err)
    }
  }
)

router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pair = await wordService.getWordPair(req.params['id']!)
    res.json(pair)
  } catch (err) {
    next(err)
  }
})

router.patch(
  '/:id',
  validateBody(updateWordPairSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pair = await wordService.updateWordPair(req.params['id']!, req.body)
      res.json(pair)
    } catch (err) {
      next(err)
    }
  }
)

router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await wordService.deleteWordPair(req.params['id']!)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

export default router
