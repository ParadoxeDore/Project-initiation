import 'dotenv/config'
import { query } from '../connection'
import { classiquePairs } from './classique'
import { animePairs } from './anime'
import { popCulturePairs } from './pop-culture'
import { musiquePairs } from './musique'
import type { CreateWordPairPayload } from '../../../../shared/types/words'

async function seedPairs(pairs: CreateWordPairPayload[]): Promise<number> {
  let inserted = 0
  for (const pair of pairs) {
    const rows = await query<{ id: string }>(
      `INSERT INTO word_pairs (theme, civil_word, impostor_word)
       VALUES ($1, $2, $3)
       ON CONFLICT (theme, lower(civil_word), lower(impostor_word)) DO NOTHING
       RETURNING id`,
      [pair.theme, pair.civilWord, pair.impostorWord]
    )
    if (rows.length > 0) inserted++
  }
  return inserted
}

async function run(): Promise<void> {
  const allPairs = [...classiquePairs, ...animePairs, ...popCulturePairs, ...musiquePairs]
  console.log(`Seed démarré — ${allPairs.length} paires à traiter`)

  const inserted = await seedPairs(allPairs)
  const skipped = allPairs.length - inserted

  console.log(`Seed terminé — ${inserted} insérées, ${skipped} ignorées (doublons)`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Seed échoué :', err)
  process.exit(1)
})
