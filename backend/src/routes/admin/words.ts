import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { adminAuth } from '../../middleware/adminAuth'
import { validateBody } from '../../middleware/validate'
import { createWordPairSchema, updateWordPairSchema, listWordPairsQuerySchema } from '../../middleware/schemas/wordSchemas'
import * as wordService from '../../services/wordService'
import type { PairFilters } from '../../models/wordPair'

const router = Router()

router.use(adminAuth)

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const queryParsed = listWordPairsQuerySchema.safeParse(req.query)
  if (!queryParsed.success) {
    res.status(400).json({ error: 'Validation échouée', details: queryParsed.error.issues })
    return
  }
  try {
    const { theme, activeOnly, page, pageSize } = queryParsed.data
    const filters: PairFilters = {}
    if (theme !== undefined) filters.theme = theme
    if (activeOnly !== undefined) filters.activeOnly = activeOnly === 'true'
    if (page !== undefined) filters.page = page
    if (pageSize !== undefined) filters.pageSize = pageSize
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
