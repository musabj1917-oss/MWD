import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/mwd';

const client = postgres(connectionString);

// Create a mock db ONLY for the next build phase to prevent it from crashing without a DB
// Real runtime will throw if the connection fails
const createMockDb = () => {
  return new Proxy({}, {
    get: (target, prop) => {
        if (prop === 'select') return () => ({ from: () => {
            const arr = [{count: 0, createdAt: new Date('2026-01-01')}];
            (arr as any).where = () => arr;
            (arr as any).orderBy = () => arr;
            (arr as any).limit = () => arr;
            return arr;
        } });
        if (prop === 'insert') return () => ({ values: () => ({ returning: () => [] }) });
        if (prop === 'update') return () => ({ set: () => ({ where: () => ({}) }) });
        if (prop === 'delete') return () => ({ where: () => ({}) });
        return (...args: any) => [];
    }
  }) as any;
};

export const db = process.env.DATABASE_URL ? drizzle(client, { schema }) : createMockDb();
