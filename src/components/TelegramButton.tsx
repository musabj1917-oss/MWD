import { Send } from 'lucide-react';
import { SITE, telegramHref } from '@/lib/site';

export function TelegramButton() {
  return (
    <a
      href={telegramHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on Telegram (@${SITE.telegramUsername})`}
      className="fixed bottom-20 right-5 z-40 flex items-center gap-2 rounded-full bg-[#229ED9] px-4 py-3 text-white shadow-lg hover:opacity-90"
      style={{ color: '#fff' }}
    >
      <Send size={22} aria-hidden />
      <span className="hidden sm:inline font-semibold">Telegram</span>
    </a>
  );
}
