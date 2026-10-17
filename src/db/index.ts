import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === 'production' && !isBuild) {
  throw new Error('DATABASE_URL is not set');
}

// prepare:false keeps this compatible with pooled connections (Neon, pgbouncer)
const client = postgres(
  connectionString || 'postgres://postgres:postgres@localhost:5432/mwd',
  { prepare: false, max: process.env.NODE_ENV === 'production' ? 1 : 10 }
);

export const db = drizzle(client, { schema });
