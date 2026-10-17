import { db } from '@/db';
import { botMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { siteUrl } from '@/lib/site';
import { BOT_DEFAULTS } from '@/lib/bot-fields';

/** Defaults overlaid with whatever has been customised in /admin/bot. */
export async function getBotContent(): Promise<{ content: Record<string, string>; custom: Set<string> }> {
  const content = { ...BOT_DEFAULTS };
  const custom = new Set<string>();
  try {
    const rows = await db.select().from(botMessages);
    for (const r of rows) {
      if (r.key in BOT_DEFAULTS) {
        content[r.key] = r.value;
        custom.add(r.key);
      }
    }
  } catch (error) {
    // Table missing or database down: the bot keeps working with the built-in text
    console.error('Could not load bot messages, using defaults:', error instanceof Error ? error.message : error);
  }
  return { content, custom };
}

export async function botText(key: string, vars: Record<string, string> = {}): Promise<string> {
  let text = BOT_DEFAULTS[key] ?? '';
  try {
    const [row] = await db.select().from(botMessages).where(eq(botMessages.key, key)).limit(1);
    if (row) text = row.value;
  } catch (error) {
    console.error(`Could not load bot message "${key}", using default:`, error instanceof Error ? error.message : error);
  }
  const all: Record<string, string> = { site: siteUrl, ...vars };
  return text.replace(/\{(\w+)\}/g, (m, name) => (name in all ? all[name] : m));
}
