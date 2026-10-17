'use client';

import { useActionState, useMemo, useRef, useState } from 'react';
import { Bold, Code, Italic, RotateCcw } from 'lucide-react';
import { resetBotMessage, saveBotMessage, type BotMessageState } from '@/server/actions/admin';
import { BOT_DEFAULTS, BOT_MAX_LENGTH, PLACEHOLDER_SAMPLES, type BotField } from '@/lib/bot-fields';
import { inputClass } from '@/components/admin/ui';

// Escape everything, then turn the few tags Telegram supports back into real tags.
function renderPreview(text: string) {
  let html = text.replace(/&(?!(amp|lt|gt|quot);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/&lt;(\/?)(b|i|u|s|code|pre)&gt;/g, '<$1$2>');
  html = html.replace(/\{(\w+)\}/g, (m, name) => PLACEHOLDER_SAMPLES[name] ?? m);
  return html.replace(/<code>/g, '<code style="background:#e8eef3;padding:0 3px;border-radius:3px">');
}

export function BotMessageEditor({ field, initial, custom }: { field: BotField; initial: string; custom: boolean }) {
  const [value, setValue] = useState(initial);
  const [saveState, saveAction, saving] = useActionState<BotMessageState, FormData>(saveBotMessage.bind(null, field.key), { ok: false, message: '' });
  const [resetState, resetAction, resetting] = useActionState<BotMessageState, FormData>(
    async (prev) => {
      const res = await resetBotMessage(field.key, prev);
      if (res.ok) setValue(BOT_DEFAULTS[field.key]);
      return res;
    },
    { ok: false, message: '' },
  );
  const ref = useRef<HTMLTextAreaElement>(null);
  const preview = useMemo(() => renderPreview(value), [value]);
  const changed = value.trim() !== initial.trim();
  const status = resetState.message ? resetState : saveState;

  function wrap(tag: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const next = value.slice(0, s) + `<${tag}>` + value.slice(s, e) + `</${tag}>` + value.slice(e);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + tag.length + 2, e + tag.length + 2);
    });
  }

  const tool = 'flex h-9 w-9 items-center justify-center border border-gray-300 bg-white hover:border-red-600';

  return (
    <section className="border border-gray-300 bg-white">
      <div className="border-b border-gray-200 px-5 py-3">
        <h2 className="text-lg font-semibold">
          {field.label} {custom && <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wider text-red-600">Customised</span>}
        </h2>
        <p className="text-sm text-gray-600">{field.help}</p>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <form action={saveAction} className="space-y-3">
          <div className="flex gap-2">
            <button type="button" className={tool} onClick={() => wrap('b')} aria-label="Bold"><Bold size={16} aria-hidden /></button>
            <button type="button" className={tool} onClick={() => wrap('i')} aria-label="Italic"><Italic size={16} aria-hidden /></button>
            <button type="button" className={tool} onClick={() => wrap('code')} aria-label="Code"><Code size={16} aria-hidden /></button>
          </div>
          <textarea ref={ref} name="value" rows={10} value={value} onChange={(e) => setValue(e.target.value)} className={`${inputClass} font-mono`} />
          <p className="text-xs text-gray-500">
            {value.length}/{BOT_MAX_LENGTH} characters. Placeholders you can use:{' '}
            {['site', ...field.vars].map((v) => `{${v}}`).join(' ')}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving || !changed} className="bg-black px-5 py-2.5 text-sm font-semibold hover:bg-red-600 disabled:opacity-50" style={{ color: '#fff' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            {status.message && <p className={`text-sm ${status.ok ? 'text-green-700' : 'text-red-700'}`}>{status.message}</p>}
          </div>
        </form>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Preview</p>
          <div className="bg-[#9bb5c9] p-4">
            <div className="max-w-sm whitespace-pre-wrap break-words rounded-lg rounded-tl-none bg-white px-3 py-2 text-sm leading-relaxed text-black shadow" dangerouslySetInnerHTML={{ __html: preview }} />
          </div>
          {custom && (
            <form action={resetAction} className="mt-3">
              <button type="submit" disabled={resetting} className="inline-flex items-center gap-2 text-sm underline disabled:opacity-50" style={{ color: 'inherit' }}>
                <RotateCcw size={14} aria-hidden /> Restore original text
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
