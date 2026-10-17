import { PageHeader } from '@/components/admin/ui';
import { BotMessageEditor } from '@/components/admin/BotMessageEditor';
import { getBotContent } from '@/lib/bot-content';
import { BOT_FIELDS } from '@/lib/bot-fields';

export const dynamic = 'force-dynamic';

export default async function BotEditorPage() {
  const { content, custom } = await getBotContent();

  return (
    <div>
      <PageHeader
        kicker="Telegram bot"
        title="Bot messages"
        subtitle="Edit what the bot says. Changes go live as soon as you save. Use the B / I / code buttons for formatting."
      />
      <div className="space-y-6">
        {BOT_FIELDS.map((f) => (
          <BotMessageEditor key={f.key} field={f} initial={content[f.key]} custom={custom.has(f.key)} />
        ))}
      </div>
    </div>
  );
}
