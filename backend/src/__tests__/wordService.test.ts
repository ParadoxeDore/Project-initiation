import { WordPairNotFoundError, DuplicateWordPairError } from '../utils/errors'
import * as wordService from '../services/wordService'
import * as model from '../models/wordPair'
import type { WordPair } from '../../../shared/types/words'

jest.mock('../models/wordPair')

const mockedModel = model as jest.Mocked<typeof model>

const PAIR: WordPair = {
  id: 'uuid-1',
  theme: 'classique',
  civilWord: 'chien',
  impostorWord: 'chat',
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => jest.clearAllMocks())

// ─── drawWordPair ────────────────────────────────────────────────────────────

describe('drawWordPair', () => {
  it('retourne la paire si trouvée', async () => {
    mockedModel.findRandomPairByTheme.mockResolvedValue({
      civilWord: PAIR.civilWord,
      impostorWord: PAIR.impostorWord,
    })
    const result = await wordService.drawWordPair('classique')
    expect(result.pair).toEqual({ civilWord: 'chien', impostorWord: 'chat' })
  })

  it('lève WordPairNotFoundError si aucune paire active', async () => {
    mockedModel.findRandomPairByTheme.mockResolvedValue(null)
    await expect(wordService.drawWordPair('musique')).rejects.toThrow(WordPairNotFoundError)
  })
})

// ─── listWordPairs ───────────────────────────────────────────────────────────

describe('listWordPairs', () => {
  it('retourne la réponse paginée', async () => {
    mockedModel.findAllPairs.mockResolvedValue({ rows: [PAIR], total: 1 })
    const result = await wordService.listWordPairs({ page: 1, pageSize: 10 })
    expect(result.data).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(10)
  })

  it('utilise les valeurs par défaut de pagination', async () => {
    mockedModel.findAllPairs.mockResolvedValue({ rows: [], total: 0 })
    const result = await wordService.listWordPairs({})
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(20)
  })
})

// ─── getWordPair ─────────────────────────────────────────────────────────────

describe('getWordPair', () => {
  it('retourne la paire si trouvée', async () => {
    mockedModel.findPairById.mockResolvedValue(PAIR)
    const result = await wordService.getWordPair('uuid-1')
    expect(result).toEqual(PAIR)
  })

  it('lève WordPairNotFoundError si introuvable', async () => {
    mockedModel.findPairById.mockResolvedValue(null)
    await expect(wordService.getWordPair('bad-id')).rejects.toThrow(WordPairNotFoundError)
  })
})

// ─── createWordPair ──────────────────────────────────────────────────────────

describe('createWordPair', () => {
  it('crée et retourne la paire', async () => {
    mockedModel.createPair.mockResolvedValue(PAIR)
    const result = await wordService.createWordPair({
      theme: 'classique',
      civilWord: 'chien',
      impostorWord: 'chat',
    })
    expect(result).toEqual(PAIR)
  })

  it('lève DuplicateWordPairError sur violation de contrainte unique', async () => {
    const pgErr = Object.assign(new Error('unique violation'), { code: '23505' })
    mockedModel.createPair.mockRejectedValue(pgErr)
    await expect(
      wordService.createWordPair({ theme: 'classique', civilWord: 'chien', impostorWord: 'chat' })
    ).rejects.toThrow(DuplicateWordPairError)
  })

  it('remonte les autres erreurs sans les transformer', async () => {
    mockedModel.createPair.mockRejectedValue(new Error('db connection lost'))
    await expect(
      wordService.createWordPair({ theme: 'classique', civilWord: 'a', impostorWord: 'b' })
    ).rejects.toThrow('db connection lost')
  })
})

// ─── updateWordPair ──────────────────────────────────────────────────────────

describe('updateWordPair', () => {
  it('retourne la paire mise à jour', async () => {
    const updated = { ...PAIR, civilWord: 'loup' }
    mockedModel.updatePair.mockResolvedValue(updated)
    const result = await wordService.updateWordPair('uuid-1', { civilWord: 'loup' })
    expect(result.civilWord).toBe('loup')
  })

  it('lève WordPairNotFoundError si null retourné', async () => {
    mockedModel.updatePair.mockResolvedValue(null)
    await expect(wordService.updateWordPair('bad-id', { civilWord: 'x' })).rejects.toThrow(
      WordPairNotFoundError
    )
  })
})

// ─── deleteWordPair ──────────────────────────────────────────────────────────

describe('deleteWordPair', () => {
  it('se termine sans erreur si la paire existe', async () => {
    mockedModel.deactivatePair.mockResolvedValue(true)
    await expect(wordService.deleteWordPair('uuid-1')).resolves.toBeUndefined()
  })

  it('lève WordPairNotFoundError si la paire est introuvable', async () => {
    mockedModel.deactivatePair.mockResolvedValue(false)
    await expect(wordService.deleteWordPair('bad-id')).rejects.toThrow(WordPairNotFoundError)
  })
})
