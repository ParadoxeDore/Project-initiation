# Spec technique — Epic 5 : Base de données de mots

**Epic parent :** [#4](https://github.com/ParadoxeDore/Project-initiation/issues/4)
**US couvertes :** US-18 (#24), US-19 (#25), US-20 (#26)
**Date :** 2026-04-28

---

## Schéma PostgreSQL

```sql
-- Migration : backend/src/db/migrations/001_create_word_pairs.sql

CREATE TYPE theme_enum AS ENUM (
  'classique',
  'anime',
  'pop-culture',
  'musique'
);

CREATE TABLE word_pairs (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  theme          theme_enum  NOT NULL,
  civil_word     TEXT        NOT NULL,
  impostor_word  TEXT        NOT NULL,
  is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE word_pairs
  ADD CONSTRAINT civil_word_not_empty
    CHECK (trim(civil_word) <> ''),
  ADD CONSTRAINT impostor_word_not_empty
    CHECK (trim(impostor_word) <> ''),
  ADD CONSTRAINT civil_impostor_different
    CHECK (lower(trim(civil_word)) <> lower(trim(impostor_word)));

CREATE INDEX idx_word_pairs_theme_active
  ON word_pairs (theme, is_active)
  WHERE is_active = TRUE;

CREATE INDEX idx_word_pairs_theme
  ON word_pairs (theme, created_at DESC);

CREATE UNIQUE INDEX idx_word_pairs_unique_pair
  ON word_pairs (theme, lower(civil_word), lower(impostor_word));

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_word_pairs_updated_at
  BEFORE UPDATE ON word_pairs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Types TypeScript (`shared/`)

### `shared/types/words.ts`

```typescript
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
```

### `shared/constants/themes.ts`

```typescript
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
```

---

## Endpoints REST

### Route publique

```
GET /api/words/pair?theme=<Theme>

200 OK  →  { pair: { civilWord: string, impostorWord: string } }
400     →  thème invalide ou manquant
404     →  aucune paire active pour ce thème
```

### Routes admin (Authorization: Bearer <ADMIN_TOKEN>)

```
GET    /api/admin/words?theme?&page?&pageSize?&activeOnly?
POST   /api/admin/words          body: CreateWordPairPayload
GET    /api/admin/words/:id
PATCH  /api/admin/words/:id      body: UpdateWordPairPayload
DELETE /api/admin/words/:id      → soft delete (is_active = false)

401  → token absent
403  → token invalide
404  → paire introuvable
```

---

## Structure des fichiers produits

```
backend/src/
├── app.ts
├── db/
│   ├── connection.ts
│   ├── migrate.ts
│   ├── migrations/
│   │   └── 001_create_word_pairs.sql
│   └── seeds/
│       ├── index.ts
│       ├── classique.ts      (min. 30 paires)
│       ├── anime.ts          (min. 20 paires)
│       ├── pop-culture.ts    (min. 20 paires)
│       └── musique.ts        (min. 20 paires)
├── models/
│   └── wordPair.ts
├── services/
│   └── wordService.ts
├── middleware/
│   ├── adminAuth.ts
│   ├── validate.ts
│   └── schemas/
│       └── wordSchemas.ts
├── routes/
│   ├── words.ts
│   └── admin/
│       └── words.ts
└── utils/
    └── errors.ts

shared/
├── types/
│   ├── words.ts
│   └── game.ts   (importe Theme depuis words.ts)
└── constants/
    └── themes.ts
```

---

## Seed initial

Runner idempotent via `INSERT ... ON CONFLICT (theme, lower(civil_word), lower(impostor_word)) DO NOTHING`.

Seuil minimum opérationnel : **10 paires actives par thème**.

Scripts npm :
```json
"db:migrate": "node -r ts-node/register src/db/migrate.ts",
"db:seed":    "node -r ts-node/register src/db/seeds/index.ts",
"db:reset":   "npm run db:migrate && npm run db:seed"
```

---

## Ordre d'implémentation

```
Vague 1 (parallèle) : TASK-01, TASK-02
Vague 2             : TASK-03, TASK-05
Vague 3 (parallèle) : TASK-04, TASK-09
Vague 4 (parallèle) : TASK-06, TASK-07
Vague 5             : TASK-08
```
