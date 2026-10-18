import Link from 'next/link';
import { getCustomFlow } from '@/lib/bot-flow';
import { PageHeader } from '@/components/admin/ui';
import { BotMessageEditor } from '@/components/admin/BotMessageEditor';
import { getBotContent } from '@/lib/bot-content';
import { BOT_FIELDS } from '@/lib/bot-fields';
import { db } from '@/db';
import { botMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { HowToVideoEditor } from '@/components/admin/HowToVideoEditor';

export const dynamic = 'force-dynamic';

export default async function BotEditorPage() {
  const { content, custom } = await getBotContent();
  const flowActive = !!(await getCustomFlow());
  let savedVideo = '';
  let uploadedFile = false;
  try {
    const [row] = await db.select().from(botMessages).where(eq(botMessages.key, 'howto_video')).limit(1);
    const v = row?.value?.trim() ?? '';
    savedVideo = /^https?:\/\//i.test(v) ? v : '';
    uploadedFile = !!v && !savedVideo;
  } catch (error) {
    console.error('Could not load Telegram how-to video setting:', error);
  }

  return (
    <div>
      <PageHeader
        kicker="Telegram bot"
        title="Bot messages"
        subtitle="Edit what the bot says. Changes go live as soon as you save. Use the B / I / code buttons for formatting."
        action={<Link href="/admin/bot/flow" className="bg-red-600 px-4 py-2.5 text-sm font-semibold" style={{ color: '#fff' }}>Open flow builder</Link>}
      />
      {flowActive && (
        <p className="mb-6 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          A custom flow is active, so the bot uses the text inside the flow builder. These messages only apply if you switch back to the built-in bot.
        </p>
      )}
      <div className="space-y-6">
        <HowToVideoEditor initialUrl={savedVideo} uploadedFile={uploadedFile} />
        {BOT_FIELDS.map((f) => (
          <BotMessageEditor key={f.key} field={f} initial={content[f.key]} custom={custom.has(f.key)} />
        ))}
      </div>
    </div>
  );
}
