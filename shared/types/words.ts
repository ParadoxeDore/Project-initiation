export type Theme = 'classique' | 'anime' | 'pop-culture' | 'musique'

export interface WordPair {
  id: string
  theme: Theme
  civilWord: string
  impostorWord: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WordPairSelection {
  civilWord: string
  impostorWord: string
}

export interface CreateWordPairPayload {
  theme: Theme
  civilWord: string
  impostorWord: string
}

export type UpdateWordPairPayload = Partial<
  Pick<CreateWordPairPayload, 'civilWord' | 'impostorWord'> & {
    theme: Theme
    isActive: boolean
  }
>

export interface WordPairListResponse {
  data: WordPair[]
  total: number
  page: number
  pageSize: number
}

export interface WordPairDrawResponse {
  pair: WordPairSelection
}
