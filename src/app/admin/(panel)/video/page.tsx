import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { botMessages } from '@/db/schema';
import { PageHeader } from '@/components/admin/ui';
import { HowToVideoEditor } from '@/components/admin/HowToVideoEditor';

export const dynamic = 'force-dynamic';

export default async function HowToVideoPage() {
  let video = '';
  let chatReady = false;
  try {
    const [v] = await db.select().from(botMessages).where(eq(botMessages.key, 'howto_video')).limit(1);
    const [c] = await db.select().from(botMessages).where(eq(botMessages.key, 'admin_chat_id')).limit(1);
    video = v?.value?.trim() ?? '';
    chatReady = !!c?.value;
  } catch (error) {
    console.error('Could not load how-to video settings:', error);
  }

  return (
    <div>
      <PageHeader
        kicker="Telegram bot"
        title="How-to video"
        subtitle="The video opens first when someone sends /start to the bot."
      />
      <HowToVideoEditor hasVideo={!!video} isLink={/^https?:\/\//i.test(video)} chatReady={chatReady} />
    </div>
  );
}
