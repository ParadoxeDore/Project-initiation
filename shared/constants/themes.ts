import type { Theme } from '../types/words'

export const THEMES: readonly Theme[] = [
  'classique',
  'anime',
  'pop-culture',
  'musique',
] as const

export function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}
