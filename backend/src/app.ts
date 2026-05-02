import 'dotenv/config'
import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import wordsRouter from './routes/words'
import adminWordsRouter from './routes/admin/words'
import { WordPairNotFoundError, DuplicateWordPairError } from './utils/errors'

const app = express()

app.use(express.json())

app.use('/api/words', wordsRouter)
app.use('/api/admin/words', adminWordsRouter)

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof WordPairNotFoundError) {
    res.status(404).json({ error: err.message })
    return
  }
  if (err instanceof DuplicateWordPairError) {
    res.status(409).json({ error: err.message })
    return
  }
  console.error(err)
  res.status(500).json({ error: 'Erreur interne du serveur' })
})

export default app

if (require.main === module) {
  const PORT = process.env['PORT'] ?? 3000
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`)
  })
}
