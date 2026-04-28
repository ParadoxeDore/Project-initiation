import type { Theme } from './words'

export type { Theme }

export type Role = 'civil' | 'imposteur' | 'mister-white'

export interface Player {
  id: string
  name: string
  role?: Role
  isEliminated: boolean
}

export interface GameConfig {
  playerNames: string[]
  theme: Theme
  impostorCount: number | 'auto'
  misterWhiteEnabled: boolean
}
