import request from 'supertest'
import app from '../app'
import * as wordService from '../services/wordService'
import { WordPairNotFoundError } from '../utils/errors'

jest.mock('../services/wordService')
const mockedService = jest.mocked(wordService)

describe('GET /api/words/pair', () => {
  afterEach(() => jest.resetAllMocks())

  it('retourne 200 avec la paire tirée pour un thème valide', async () => {
    const mockPair = { civilWord: 'chat', impostorWord: 'chien' }
    mockedService.drawWordPair.mockResolvedValueOnce({ pair: mockPair })

    const res = await request(app).get('/api/words/pair?theme=classique')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ pair: mockPair })
    expect(mockedService.drawWordPair).toHaveBeenCalledWith('classique')
  })

  it('retourne 400 si le paramètre theme est absent', async () => {
    const res = await request(app).get('/api/words/pair')
    expect(res.status).toBe(400)
    expect(mockedService.drawWordPair).not.toHaveBeenCalled()
  })

  it('retourne 400 si le thème est invalide', async () => {
    const res = await request(app).get('/api/words/pair?theme=inconnu')
    expect(res.status).toBe(400)
    expect(mockedService.drawWordPair).not.toHaveBeenCalled()
  })

  it('retourne 404 si aucune paire active pour le thème', async () => {
    mockedService.drawWordPair.mockRejectedValueOnce(new WordPairNotFoundError())

    const res = await request(app).get('/api/words/pair?theme=anime')

    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })
})
