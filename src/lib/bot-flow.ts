import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { botMessages } from '@/db/schema';
import { validateFlow, type Flow } from '@/lib/bot-flow-types';

export const FLOW_KEY = 'flow';

/** The saved flow, or null when none was saved (the bot then uses its built-in behaviour). */
export async function getCustomFlow(): Promise<Flow | null> {
  try {
    const [row] = await db.select().from(botMessages).where(eq(botMessages.key, FLOW_KEY)).limit(1);
    if (!row) return null;
    const result = validateFlow(JSON.parse(row.value));
    return 'flow' in result ? result.flow : null;
  } catch (error) {
    console.error('Could not load bot flow, using built-in bot:', error instanceof Error ? error.message : error);
    return null;
  }
}
