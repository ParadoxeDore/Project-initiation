import { query } from '../db/connection'
import type {
  Theme,
  WordPair,
  WordPairSelection,
  CreateWordPairPayload,
  UpdateWordPairPayload,
} from '../../shared/types/words'

interface WordPairRow {
  id: string
  theme: Theme
  civil_word: string
  impostor_word: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface PairFilters {
  theme?: Theme
  page?: number
  pageSize?: number
  activeOnly?: boolean
}

function mapRow(row: WordPairRow): WordPair {
  return {
    id: row.id,
    theme: row.theme,
    civilWord: row.civil_word,
    impostorWord: row.impostor_word,
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

// ORDER BY RANDOM() fait un seq scan sur les paires filtrées.
// Acceptable pour le volume attendu (quelques centaines de paires par thème).
export async function findRandomPairByTheme(theme: Theme): Promise<WordPairSelection | null> {
  const rows = await query<WordPairRow>(
    `SELECT civil_word, impostor_word
     FROM word_pairs
     WHERE theme = $1 AND is_active = TRUE
     ORDER BY RANDOM()
     LIMIT 1`,
    [theme]
  )
  if (rows.length === 0) return null
  const row = rows[0]
  return { civilWord: row.civil_word, impostorWord: row.impostor_word }
}

export async function findAllPairs(
  filters: PairFilters
): Promise<{ rows: WordPair[]; total: number }> {
  const { theme, page = 1, pageSize = 20, activeOnly = false } = filters
  const conditions: string[] = []
  const params: unknown[] = []
  let idx = 1

  if (theme !== undefined) {
    conditions.push(`theme = $${idx}`)
    params.push(theme)
    idx++
  }
  if (activeOnly) {
    conditions.push('is_active = TRUE')
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const countRows = await query<{ count: string }>(
    `SELECT COUNT(*) AS count FROM word_pairs ${where}`,
    params
  )
  const total = parseInt(countRows[0]?.count ?? '0', 10)

  const offset = (page - 1) * pageSize
  const dataRows = await query<WordPairRow>(
    `SELECT * FROM word_pairs ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...params, pageSize, offset]
  )

  return { rows: dataRows.map(mapRow), total }
}

export async function findPairById(id: string): Promise<WordPair | null> {
  const rows = await query<WordPairRow>(
    'SELECT * FROM word_pairs WHERE id = $1',
    [id]
  )
  return rows.length > 0 ? mapRow(rows[0]) : null
}

export async function createPair(payload: CreateWordPairPayload): Promise<WordPair> {
  const rows = await query<WordPairRow>(
    `INSERT INTO word_pairs (theme, civil_word, impostor_word)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [payload.theme, payload.civilWord, payload.impostorWord]
  )
  return mapRow(rows[0])
}

export async function updatePair(
  id: string,
  payload: UpdateWordPairPayload
): Promise<WordPair | null> {
  const fields: Array<[string, unknown]> = []

  if (payload.civilWord !== undefined) fields.push(['civil_word', payload.civilWord])
  if (payload.impostorWord !== undefined) fields.push(['impostor_word', payload.impostorWord])
  if (payload.theme !== undefined) fields.push(['theme', payload.theme])
  if (payload.isActive !== undefined) fields.push(['is_active', payload.isActive])

  if (fields.length === 0) return findPairById(id)

  const setClauses = fields.map(([col], i) => `${col} = $${i + 1}`)
  const params = [...fields.map(([, val]) => val), id]

  const rows = await query<WordPairRow>(
    `UPDATE word_pairs SET ${setClauses.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
    params
  )
  return rows.length > 0 ? mapRow(rows[0]) : null
}

export async function deactivatePair(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    'UPDATE word_pairs SET is_active = FALSE WHERE id = $1 RETURNING id',
    [id]
  )
  return rows.length > 0
}
