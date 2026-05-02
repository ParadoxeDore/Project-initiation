-- Migration 001 : création de la table word_pairs
-- Idempotente : sûre à rejouer

-- Création du type enum (idempotente via DO block car CREATE TYPE IF NOT EXISTS n'existe pas en PG <14)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'theme_enum') THEN
    CREATE TYPE theme_enum AS ENUM (
      'classique',
      'anime',
      'pop-culture',
      'musique'
    );
  END IF;
END;
$$;

-- Création de la table
CREATE TABLE IF NOT EXISTS word_pairs (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  theme          theme_enum  NOT NULL,
  civil_word     TEXT        NOT NULL,
  impostor_word  TEXT        NOT NULL,
  is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contraintes CHECK (ADD CONSTRAINT IF NOT EXISTS n'existe pas — vérification via pg_constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'civil_word_not_empty'
      AND conrelid = 'word_pairs'::regclass
  ) THEN
    ALTER TABLE word_pairs
      ADD CONSTRAINT civil_word_not_empty
        CHECK (trim(civil_word) <> '');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'impostor_word_not_empty'
      AND conrelid = 'word_pairs'::regclass
  ) THEN
    ALTER TABLE word_pairs
      ADD CONSTRAINT impostor_word_not_empty
        CHECK (trim(impostor_word) <> '');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'civil_impostor_different'
      AND conrelid = 'word_pairs'::regclass
  ) THEN
    ALTER TABLE word_pairs
      ADD CONSTRAINT civil_impostor_different
        CHECK (lower(trim(civil_word)) <> lower(trim(impostor_word)));
  END IF;
END;
$$;

-- Index
CREATE INDEX IF NOT EXISTS idx_word_pairs_theme_active
  ON word_pairs (theme, is_active)
  WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_word_pairs_theme
  ON word_pairs (theme, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_word_pairs_unique_pair
  ON word_pairs (theme, lower(civil_word), lower(impostor_word));

-- Fonction trigger updated_at (CREATE OR REPLACE est idempotente)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger (DROP IF EXISTS + CREATE pour idempotence)
DROP TRIGGER IF EXISTS trg_word_pairs_updated_at ON word_pairs;

CREATE TRIGGER trg_word_pairs_updated_at
  BEFORE UPDATE ON word_pairs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
