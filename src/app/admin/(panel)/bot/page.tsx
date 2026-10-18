import Link from 'next/link';
import { getCustomFlow } from '@/lib/bot-flow';
import { PageHeader } from '@/components/admin/ui';
import { BotMessageEditor } from '@/components/admin/BotMessageEditor';
import { getBotContent } from '@/lib/bot-content';
import { BOT_FIELDS } from '@/lib/bot-fields';

export const dynamic = 'force-dynamic';

export default async function BotEditorPage() {
  const { content, custom } = await getBotContent();
  const flowActive = !!(await getCustomFlow());

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
        {BOT_FIELDS.map((f) => (
          <BotMessageEditor key={f.key} field={f} initial={content[f.key]} custom={custom.has(f.key)} />
        ))}
      </div>
    </div>
  );
}
