import request from 'supertest'
import app from '../app'
import * as wordService from '../services/wordService'
import { WordPairNotFoundError, DuplicateWordPairError } from '../utils/errors'

jest.mock('../services/wordService')
const mockedService = jest.mocked(wordService)

const VALID_TOKEN = 'test-admin-token'
const authHeaders = { Authorization: `Bearer ${VALID_TOKEN}` }

const mockPair = {
  id: 'uuid-123',
  theme: 'classique' as const,
  civilWord: 'chat',
  impostorWord: 'chien',
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeAll(() => {
  process.env['ADMIN_TOKEN'] = VALID_TOKEN
})

afterEach(() => jest.resetAllMocks())

describe('Auth admin', () => {
  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/admin/words')
    expect(res.status).toBe(401)
  })

  it('retourne 403 avec un token invalide', async () => {
    const res = await request(app)
      .get('/api/admin/words')
      .set('Authorization', 'Bearer mauvais-token')
    expect(res.status).toBe(403)
  })
})

describe('GET /api/admin/words', () => {
  it('retourne 200 avec la liste paginée', async () => {
    const mockList = { data: [mockPair], total: 1, page: 1, pageSize: 20 }
    mockedService.listWordPairs.mockResolvedValueOnce(mockList)

    const res = await request(app).get('/api/admin/words').set(authHeaders)

    expect(res.status).toBe(200)
    expect(res.body).toEqual(mockList)
  })

  it('retourne 400 si le thème est invalide', async () => {
    const res = await request(app)
      .get('/api/admin/words?theme=inconnu')
      .set(authHeaders)
    expect(res.status).toBe(400)
    expect(mockedService.listWordPairs).not.toHaveBeenCalled()
  })

  it('retourne 400 si page est non numérique', async () => {
    const res = await request(app)
      .get('/api/admin/words?page=abc')
      .set(authHeaders)
    expect(res.status).toBe(400)
    expect(mockedService.listWordPairs).not.toHaveBeenCalled()
  })

  it('retourne 400 si page est négative', async () => {
    const res = await request(app)
      .get('/api/admin/words?page=-1')
      .set(authHeaders)
    expect(res.status).toBe(400)
    expect(mockedService.listWordPairs).not.toHaveBeenCalled()
  })
})

describe('POST /api/admin/words', () => {
  it('retourne 201 avec la paire créée', async () => {
    mockedService.createWordPair.mockResolvedValueOnce(mockPair)

    const res = await request(app)
      .post('/api/admin/words')
      .set(authHeaders)
      .send({ theme: 'classique', civilWord: 'chat', impostorWord: 'chien' })

    expect(res.status).toBe(201)
    expect(res.body).toEqual(mockPair)
  })

  it('retourne 400 si des champs requis sont absents', async () => {
    const res = await request(app)
      .post('/api/admin/words')
      .set(authHeaders)
      .send({ theme: 'classique' })

    expect(res.status).toBe(400)
    expect(mockedService.createWordPair).not.toHaveBeenCalled()
  })

  it('retourne 409 en cas de doublon', async () => {
    mockedService.createWordPair.mockRejectedValueOnce(new DuplicateWordPairError())

    const res = await request(app)
      .post('/api/admin/words')
      .set(authHeaders)
      .send({ theme: 'classique', civilWord: 'chat', impostorWord: 'chien' })

    expect(res.status).toBe(409)
  })
})

describe('GET /api/admin/words/:id', () => {
  it('retourne 200 avec la paire trouvée', async () => {
    mockedService.getWordPair.mockResolvedValueOnce(mockPair)

    const res = await request(app).get('/api/admin/words/uuid-123').set(authHeaders)

    expect(res.status).toBe(200)
    expect(res.body).toEqual(mockPair)
    expect(mockedService.getWordPair).toHaveBeenCalledWith('uuid-123')
  })

  it('retourne 404 si la paire est introuvable', async () => {
    mockedService.getWordPair.mockRejectedValueOnce(new WordPairNotFoundError())

    const res = await request(app).get('/api/admin/words/inexistant').set(authHeaders)

    expect(res.status).toBe(404)
  })
})

describe('PATCH /api/admin/words/:id', () => {
  it('retourne 200 avec la paire mise à jour', async () => {
    const updated = { ...mockPair, civilWord: 'tigre' }
    mockedService.updateWordPair.mockResolvedValueOnce(updated)

    const res = await request(app)
      .patch('/api/admin/words/uuid-123')
      .set(authHeaders)
      .send({ civilWord: 'tigre' })

    expect(res.status).toBe(200)
    expect(res.body.civilWord).toBe('tigre')
    expect(mockedService.updateWordPair).toHaveBeenCalledWith('uuid-123', { civilWord: 'tigre' })
  })

  it('retourne 400 si le corps est vide', async () => {
    const res = await request(app)
      .patch('/api/admin/words/uuid-123')
      .set(authHeaders)
      .send({})

    expect(res.status).toBe(400)
    expect(mockedService.updateWordPair).not.toHaveBeenCalled()
  })

  it('retourne 404 si la paire est introuvable', async () => {
    mockedService.updateWordPair.mockRejectedValueOnce(new WordPairNotFoundError())

    const res = await request(app)
      .patch('/api/admin/words/inexistant')
      .set(authHeaders)
      .send({ civilWord: 'tigre' })

    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/admin/words/:id', () => {
  it('retourne 204 à la suppression', async () => {
    mockedService.deleteWordPair.mockResolvedValueOnce(undefined)

    const res = await request(app).delete('/api/admin/words/uuid-123').set(authHeaders)

    expect(res.status).toBe(204)
    expect(mockedService.deleteWordPair).toHaveBeenCalledWith('uuid-123')
  })

  it('retourne 404 si la paire est introuvable', async () => {
    mockedService.deleteWordPair.mockRejectedValueOnce(new WordPairNotFoundError())

    const res = await request(app).delete('/api/admin/words/inexistant').set(authHeaders)

    expect(res.status).toBe(404)
  })
})
