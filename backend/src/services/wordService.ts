import type {
  Theme,
  WordPair,
  CreateWordPairPayload,
  UpdateWordPairPayload,
  WordPairListResponse,
  WordPairDrawResponse,
} from '../../../shared/types/words'
import * as model from '../models/wordPair'
import type { PairFilters } from '../models/wordPair'
import { WordPairNotFoundError, DuplicateWordPairError } from '../utils/errors'

export async function drawWordPair(theme: Theme): Promise<WordPairDrawResponse> {
  const pair = await model.findRandomPairByTheme(theme)
  if (!pair) throw new WordPairNotFoundError(`No active word pair for theme: ${theme}`)
  return { pair }
}

export async function listWordPairs(filters: PairFilters): Promise<WordPairListResponse> {
  const { page = 1, pageSize = 20 } = filters
  const { rows, total } = await model.findAllPairs(filters)
  return { data: rows, total, page, pageSize }
}

export async function getWordPair(id: string): Promise<WordPair> {
  const pair = await model.findPairById(id)
  if (!pair) throw new WordPairNotFoundError(`Word pair not found: ${id}`)
  return pair
}

export async function createWordPair(payload: CreateWordPairPayload): Promise<WordPair> {
  try {
    return await model.createPair(payload)
  } catch (err: unknown) {
    if (isPgUniqueViolation(err)) throw new DuplicateWordPairError()
    throw err
  }
}

export async function updateWordPair(id: string, payload: UpdateWordPairPayload): Promise<WordPair> {
  const pair = await model.updatePair(id, payload)
  if (!pair) throw new WordPairNotFoundError(`Word pair not found: ${id}`)
  return pair
}

export async function deleteWordPair(id: string): Promise<void> {
  const deleted = await model.deactivatePair(id)
  if (!deleted) throw new WordPairNotFoundError(`Word pair not found: ${id}`)
}

function isPgUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === '23505'
  )
}
