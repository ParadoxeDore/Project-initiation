import * as model from '../models/wordPair'
import { query } from '../db/connection'

jest.mock('../db/connection')
const mockedQuery = query as jest.MockedFunction<typeof query>

const ROW = {
  id: 'uuid-1',
  theme: 'classique' as const,
  civil_word: 'chien',
  impostor_word: 'chat',
  is_active: true,
  created_at: new Date('2026-01-01T00:00:00.000Z'),
  updated_at: new Date('2026-01-01T00:00:00.000Z'),
}

beforeEach(() => jest.clearAllMocks())

// ─── findRandomPairByTheme ───────────────────────────────────────────────────

describe('findRandomPairByTheme', () => {
  it('retourne la paire mappée si trouvée', async () => {
    mockedQuery.mockResolvedValueOnce([ROW])
    const result = await model.findRandomPairByTheme('classique')
    expect(result).toEqual({ civilWord: 'chien', impostorWord: 'chat' })
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining('WHERE theme = $1'),
      ['classique']
    )
  })

  it('retourne null si aucune paire active', async () => {
    mockedQuery.mockResolvedValueOnce([])
    const result = await model.findRandomPairByTheme('musique')
    expect(result).toBeNull()
  })
})

// ─── findAllPairs ────────────────────────────────────────────────────────────

describe('findAllPairs', () => {
  it('retourne les lignes paginées et le total', async () => {
    mockedQuery
      .mockResolvedValueOnce([{ count: '5' }])
      .mockResolvedValueOnce([ROW])
    const result = await model.findAllPairs({ page: 1, pageSize: 10 })
    expect(result.total).toBe(5)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0]?.civilWord).toBe('chien')
  })

  it('filtre par thème quand fourni', async () => {
    mockedQuery
      .mockResolvedValueOnce([{ count: '0' }])
      .mockResolvedValueOnce([])
    await model.findAllPairs({ theme: 'anime' })
    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('theme = $1'),
      ['anime']
    )
  })

  it('filtre sur is_active quand activeOnly = true', async () => {
    mockedQuery
      .mockResolvedValueOnce([{ count: '0' }])
      .mockResolvedValueOnce([])
    await model.findAllPairs({ activeOnly: true })
    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('is_active = TRUE'),
      []
    )
  })
})

// ─── findPairById ────────────────────────────────────────────────────────────

describe('findPairById', () => {
  it('retourne la paire mappée si trouvée', async () => {
    mockedQuery.mockResolvedValueOnce([ROW])
    const result = await model.findPairById('uuid-1')
    expect(result?.id).toBe('uuid-1')
    expect(result?.civilWord).toBe('chien')
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining('WHERE id = $1'),
      ['uuid-1']
    )
  })

  it('retourne null si introuvable', async () => {
    mockedQuery.mockResolvedValueOnce([])
    const result = await model.findPairById('bad-id')
    expect(result).toBeNull()
  })
})

// ─── createPair ──────────────────────────────────────────────────────────────

describe('createPair', () => {
  it('insère et retourne la paire créée', async () => {
    mockedQuery.mockResolvedValueOnce([ROW])
    const result = await model.createPair({
      theme: 'classique',
      civilWord: 'chien',
      impostorWord: 'chat',
    })
    expect(result.civilWord).toBe('chien')
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO word_pairs'),
      ['classique', 'chien', 'chat']
    )
  })

  it('lève une erreur si le INSERT ne retourne aucune ligne', async () => {
    mockedQuery.mockResolvedValueOnce([])
    // Un null guard explicite est présent sur TASK-03 ; sur cette branche mapRow(undefined) lève aussi une erreur
    await expect(
      model.createPair({ theme: 'classique', civilWord: 'a', impostorWord: 'b' })
    ).rejects.toThrow()
  })
})

// ─── updatePair ──────────────────────────────────────────────────────────────

describe('updatePair', () => {
  it('met à jour et retourne la paire', async () => {
    const updated = { ...ROW, civil_word: 'loup' }
    mockedQuery.mockResolvedValueOnce([updated])
    const result = await model.updatePair('uuid-1', { civilWord: 'loup' })
    expect(result?.civilWord).toBe('loup')
  })

  it('retourne null si la paire est introuvable', async () => {
    mockedQuery.mockResolvedValueOnce([])
    const result = await model.updatePair('bad-id', { civilWord: 'x' })
    expect(result).toBeNull()
  })

  it('retourne la paire inchangée si aucun champ fourni', async () => {
    mockedQuery.mockResolvedValueOnce([ROW])
    const result = await model.updatePair('uuid-1', {})
    expect(result?.id).toBe('uuid-1')
  })
})

// ─── deactivatePair ──────────────────────────────────────────────────────────

describe('deactivatePair', () => {
  it('retourne true si la paire a été désactivée', async () => {
    mockedQuery.mockResolvedValueOnce([{ id: 'uuid-1' }])
    const result = await model.deactivatePair('uuid-1')
    expect(result).toBe(true)
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining('is_active = FALSE'),
      ['uuid-1']
    )
  })

  it('retourne false si la paire est introuvable', async () => {
    mockedQuery.mockResolvedValueOnce([])
    const result = await model.deactivatePair('bad-id')
    expect(result).toBe(false)
  })
})
