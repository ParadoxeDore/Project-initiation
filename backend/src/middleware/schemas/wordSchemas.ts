import { z } from 'zod'
import { THEMES } from '../../../../shared/constants/themes'
import type { CreateWordPairPayload, UpdateWordPairPayload, Theme } from '../../../../shared/types/words'

const themeEnum = z.enum(THEMES as unknown as [Theme, ...Theme[]])

export const themeQuerySchema = z.object({
  theme: themeEnum,
}).strict()

export const createWordPairSchema = z.object({
  theme: themeEnum,
  civilWord: z.string().min(1, 'Le mot civil ne peut pas être vide'),
  impostorWord: z.string().min(1, "Le mot imposteur ne peut pas être vide"),
}).strict()

export const updateWordPairSchema = z.object({
  theme: themeEnum.optional(),
  civilWord: z.string().min(1, 'Le mot civil ne peut pas être vide').optional(),
  impostorWord: z.string().min(1, "Le mot imposteur ne peut pas être vide").optional(),
  isActive: z.boolean().optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Au moins un champ est requis' }
)

// Assertions statiques : erreur de compilation si les schemas divergent des types partagés
const _createCheck: z.infer<typeof createWordPairSchema> extends CreateWordPairPayload ? true : never = true
const _updateCheck: z.infer<typeof updateWordPairSchema> extends UpdateWordPairPayload ? true : never = true

void _createCheck
void _updateCheck
