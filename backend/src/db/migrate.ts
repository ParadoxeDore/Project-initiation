import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { pool } from './connection'

const MIGRATIONS_DIR = path.join(__dirname, 'migrations')

function getMigrationFiles(): string[] {
  const files = fs.readdirSync(MIGRATIONS_DIR)
  return files
    .filter((f) => f.endsWith('.sql'))
    .sort()
}

async function runMigrations(): Promise<void> {
  const files = getMigrationFiles()

  if (files.length === 0) {
    console.log('Aucun fichier de migration trouvé.')
    return
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file)
      const sql = fs.readFileSync(filePath, 'utf8')

      console.log(`Migration : ${file}`)
      await client.query(sql)
      console.log(`  ✓ ${file} appliqué`)
    }

    await client.query('COMMIT')
    console.log(`\n${files.length} migration(s) appliquée(s) avec succès.`)
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Erreur lors de la migration, rollback effectué.')
    throw error
  } finally {
    client.release()
  }
}

runMigrations()
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => {
    void pool.end()
  })
