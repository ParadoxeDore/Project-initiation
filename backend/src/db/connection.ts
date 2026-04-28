import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg

function createPool(): pg.Pool {
  const connectionString = process.env['DATABASE_URL']

  if (connectionString !== undefined && connectionString !== '') {
    return new Pool({ connectionString })
  }

  return new Pool({
    host: process.env['DB_HOST'] ?? 'localhost',
    port: parseInt(process.env['DB_PORT'] ?? '5432', 10),
    database: process.env['DB_NAME'] ?? 'underword',
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
  })
}

const pool: pg.Pool = createPool()

export async function query<T extends pg.QueryResultRow>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query<T>(sql, params)
  return result.rows
}

export { pool }
