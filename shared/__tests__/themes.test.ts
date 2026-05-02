import { isValidTheme, THEMES } from '../constants/themes'

describe('isValidTheme', () => {
  it('retourne true pour chaque thème valide', () => {
    for (const theme of THEMES) {
      expect(isValidTheme(theme)).toBe(true)
    }
  })

  it('retourne false pour une chaîne invalide', () => {
    expect(isValidTheme('inconnu')).toBe(false)
    expect(isValidTheme('')).toBe(false)
    expect(isValidTheme('CLASSIQUE')).toBe(false)
  })

  it('retourne false pour des types non-string', () => {
    expect(isValidTheme(null)).toBe(false)
    expect(isValidTheme(undefined)).toBe(false)
    expect(isValidTheme(42)).toBe(false)
    expect(isValidTheme(true)).toBe(false)
    expect(isValidTheme({})).toBe(false)
    expect(isValidTheme([])).toBe(false)
  })
})
