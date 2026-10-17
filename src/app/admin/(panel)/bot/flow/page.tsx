import Link from 'next/link';
import { PageHeader } from '@/components/admin/ui';
import { FlowBuilder } from '@/components/admin/FlowBuilder';
import { getBotContent } from '@/lib/bot-content';
import { getCustomFlow } from '@/lib/bot-flow';
import { buildDefaultFlow } from '@/lib/bot-flow-types';

export const dynamic = 'force-dynamic';

export default async function FlowPage() {
  const saved = await getCustomFlow();
  const { content } = await getBotContent();
  const flow = saved ?? buildDefaultFlow(content);

  return (
    <div>
      <PageHeader
        kicker="Telegram bot"
        title="Flow builder"
        subtitle={saved ? 'The bot is following your saved flow.' : 'This starts as a copy of the built-in bot. Nothing changes until you press Save.'}
        action={<Link href="/admin/bot" className="text-sm underline" style={{ color: 'inherit' }}>Simple message editor</Link>}
      />
      <FlowBuilder key={saved ? 'custom' : 'default'} initial={flow} custom={!!saved} />
    </div>
  );
}
