import { MessageCircle } from 'lucide-react';
import { whatsappHref } from '@/lib/site';

export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg hover:opacity-90"
      style={{ color: '#fff' }}
    >
      <MessageCircle size={22} aria-hidden />
      <span className="hidden sm:inline font-semibold">WhatsApp</span>
    </a>
  );
}
