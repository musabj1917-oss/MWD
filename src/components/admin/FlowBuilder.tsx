'use client';

import { useActionState, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { resetFlow, saveFlow, type BotMessageState } from '@/server/actions/admin';
import { renderTelegramPreview } from '@/lib/bot-fields';
import { MAX_BUTTONS, MAX_NODES, type Flow, type FlowButton, type FlowNode } from '@/lib/bot-flow-types';
import { inputClass } from '@/components/admin/ui';

const TYPE_LABEL: Record<FlowNode['type'], string> = {
  message: 'Message with buttons',
  ask: 'Ask a question',
  save: 'Save the request',
};
const small = 'border border-gray-300 bg-white p-2 text-sm focus:border-red-600';

function Simulator({ flow }: { flow: Flow }) {
  const [cur, setCur] = useState(flow.start);
  const [vars, setVars] = useState<Record<string, string>>({});
  const [reply, setReply] = useState('');
  const node = flow.nodes.find((n) => n.id === cur) ?? flow.nodes.find((n) => n.id === flow.start) ?? flow.nodes[0];
  if (!node) return null;

  function go(target?: string, set?: string) {
    if (!target) return;
    if (set) setVars((v) => ({ ...v, service: set }));
    setCur(target);
  }
  function sendReply() {
    if (!reply.trim()) return;
    setVars((v) => ({ ...v, [node.field ?? 'description']: reply.trim() }));
    setReply('');
    go(node.next);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Try it</p>
        <button type="button" onClick={() => { setCur(flow.start); setVars({}); }} className="text-xs underline" style={{ color: 'inherit' }}>Start over</button>
      </div>
      <div className="min-h-64 bg-[#9bb5c9] p-3">
        <div className="max-w-full whitespace-pre-wrap break-words rounded-lg rounded-tl-none bg-white px-3 py-2 text-sm leading-relaxed text-black shadow"
          dangerouslySetInnerHTML={{ __html: renderTelegramPreview(node.text, { ...vars, reference: 'REF-TG-AB12CD' }) }} />
        <div className="mt-2 space-y-1.5">
          {node.buttons.map((b, i) => (
            <button key={i} type="button"
              onClick={() => (b.kind === 'url' ? window.open(b.url, '_blank', 'noopener') : go(b.target, b.set))}
              className="block w-full rounded bg-[#5e82a1] px-3 py-2 text-center text-sm font-medium" style={{ color: '#fff' }}>
              {b.label || '(no label)'}{b.kind === 'url' ? ' ↗' : ''}
            </button>
          ))}
        </div>
        {node.type === 'ask' && (
          <div className="mt-3 flex gap-2">
            <input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendReply()} placeholder="Type a reply…" className="min-w-0 flex-1 bg-white p-2 text-sm" />
            <button type="button" onClick={sendReply} className="bg-black px-3 text-sm font-semibold" style={{ color: '#fff' }}>Send</button>
          </div>
        )}
        {node.type === 'save' && <p className="mt-3 text-center text-xs text-white/80">(the request is saved at this point)</p>}
      </div>
    </div>
  );
}

export function FlowBuilder({ initial, custom }: { initial: Flow; custom: boolean }) {
  const [flow, setFlow] = useState<Flow>(initial);
  const [saveState, saveAction, saving] = useActionState<BotMessageState, FormData>(saveFlow, { ok: false, message: '' });
  const [resetState, resetAction, resetting] = useActionState<BotMessageState, FormData>(async (prev) => resetFlow(prev), { ok: false, message: '' });
  const status = resetState.message ? resetState : saveState;
  const names = Object.fromEntries(flow.nodes.map((n) => [n.id, n.name]));

  const patchNode = (id: string, patch: Partial<FlowNode>) =>
    setFlow((f) => ({ ...f, nodes: f.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) }));
  const patchButton = (id: string, i: number, patch: Partial<FlowButton>) =>
    setFlow((f) => ({ ...f, nodes: f.nodes.map((n) => (n.id === id ? { ...n, buttons: n.buttons.map((b, bi) => (bi === i ? { ...b, ...patch } : b)) } : n)) }));

  function addNode() {
    if (flow.nodes.length >= MAX_NODES) return;
    const id = 'b' + Math.random().toString(36).slice(2, 8);
    setFlow((f) => ({ ...f, nodes: [...f.nodes, { id, name: 'New block', type: 'message', text: 'Write your message here.', buttons: [{ label: '« Back to Main Menu', kind: 'goto', target: f.start }] }] }));
  }
  function removeNode(id: string) {
    if (!confirm('Delete this block? Buttons that lead to it will be removed.')) return;
    setFlow((f) => ({
      ...f,
      nodes: f.nodes
        .filter((n) => n.id !== id)
        .map((n) => ({ ...n, buttons: n.buttons.filter((b) => !(b.kind === 'goto' && b.target === id)), next: n.next === id ? undefined : n.next })),
    }));
  }
  function move(id: string, dir: -1 | 1) {
    setFlow((f) => {
      const i = f.nodes.findIndex((n) => n.id === id);
      const j = i + dir;
      if (j < 0 || j >= f.nodes.length) return f;
      const nodes = [...f.nodes];
      [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
      return { ...f, nodes };
    });
  }
  function wrap(id: string, tag: string) {
    const el = document.getElementById(`t-${id}`) as HTMLTextAreaElement | null;
    const node = flow.nodes.find((n) => n.id === id);
    if (!el || !node) return;
    const { selectionStart: s, selectionEnd: e } = el;
    patchNode(id, { text: node.text.slice(0, s) + `<${tag}>` + node.text.slice(s, e) + `</${tag}>` + node.text.slice(e) });
  }

  const tool = 'h-8 px-2.5 border border-gray-300 bg-white text-xs font-semibold hover:border-red-600';
  const blockOptions = flow.nodes.map((n) => <option key={n.id} value={n.id}>{n.name}</option>);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 border border-gray-300 bg-white p-4">
          <label className="text-sm font-medium" htmlFor="start">Conversation starts at</label>
          <select id="start" value={flow.start} onChange={(e) => setFlow({ ...flow, start: e.target.value })} className={small}>{blockOptions}</select>
          <span className="text-xs text-gray-500">{flow.nodes.length}/{MAX_NODES} blocks</span>
        </div>

        {flow.nodes.map((n, idx) => (
          <section key={n.id} className="border border-gray-300 bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
              <input value={n.name} onChange={(e) => patchNode(n.id, { name: e.target.value })} aria-label="Block name" className={`${small} min-w-0 flex-1 font-semibold`} />
              <select value={n.type} onChange={(e) => patchNode(n.id, { type: e.target.value as FlowNode['type'], ...(e.target.value === 'ask' ? { field: n.field ?? 'description', next: n.next ?? flow.start } : {}) })} aria-label="Block type" className={small}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <button type="button" onClick={() => move(n.id, -1)} disabled={idx === 0} aria-label="Move up" className="p-1.5 disabled:opacity-30"><ArrowUp size={16} aria-hidden /></button>
              <button type="button" onClick={() => move(n.id, 1)} disabled={idx === flow.nodes.length - 1} aria-label="Move down" className="p-1.5 disabled:opacity-30"><ArrowDown size={16} aria-hidden /></button>
              <button type="button" onClick={() => removeNode(n.id)} disabled={n.id === flow.start} aria-label="Delete block" title={n.id === flow.start ? 'Pick another start block first' : 'Delete block'} className="p-1.5 text-red-600 disabled:opacity-30"><Trash2 size={16} aria-hidden /></button>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex gap-2">
                <button type="button" className={tool} onClick={() => wrap(n.id, 'b')}>B</button>
                <button type="button" className={`${tool} italic`} onClick={() => wrap(n.id, 'i')}>I</button>
                <button type="button" className={`${tool} font-mono`} onClick={() => wrap(n.id, 'code')}>{'</>'}</button>
              </div>
              <textarea id={`t-${n.id}`} rows={5} value={n.text} onChange={(e) => patchNode(n.id, { text: e.target.value })} className={`${inputClass} font-mono`} />
              <p className="text-xs text-gray-500">Placeholders: {'{site}'} {'{service}'} {'{reference}'}</p>

              {n.type === 'ask' && (
                <div className="grid gap-3 border border-dashed border-gray-300 p-3 sm:grid-cols-2">
                  <label className="text-sm">Keep the reply as
                    <select value={n.field ?? 'description'} onChange={(e) => patchNode(n.id, { field: e.target.value as FlowNode['field'] })} className={`${small} mt-1 w-full`}>
                      <option value="details">Name and email / phone</option>
                      <option value="description">Project description</option>
                    </select>
                  </label>
                  <label className="text-sm">After the reply, go to
                    <select value={n.next ?? ''} onChange={(e) => patchNode(n.id, { next: e.target.value })} className={`${small} mt-1 w-full`}>
                      <option value="" disabled>Choose a block</option>
                      {blockOptions}
                    </select>
                  </label>
                </div>
              )}

              {n.type !== 'ask' && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Buttons</p>
                  {n.buttons.map((b, i) => (
                    <div key={i} className="space-y-2 border border-gray-200 p-2.5">
                      <div className="flex gap-2">
                        <input value={b.label} onChange={(e) => patchButton(n.id, i, { label: e.target.value })} placeholder="Button text" aria-label="Button text" className={`${small} min-w-0 flex-1`} />
                        <button type="button" aria-label="Remove button" onClick={() => setFlow((f) => ({ ...f, nodes: f.nodes.map((x) => (x.id === n.id ? { ...x, buttons: x.buttons.filter((_, bi) => bi !== i) } : x)) }))} className="p-1.5 text-red-600"><Trash2 size={16} aria-hidden /></button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <select value={b.kind} onChange={(e) => patchButton(n.id, i, { kind: e.target.value as FlowButton['kind'] })} aria-label="Button action" className={small}>
                          <option value="goto">Go to block</option>
                          <option value="url">Open link</option>
                        </select>
                        {b.kind === 'goto' ? (
                          <>
                            <select value={b.target ?? ''} onChange={(e) => patchButton(n.id, i, { target: e.target.value })} aria-label="Target block" className={`${small} min-w-0 flex-1`}>
                              <option value="" disabled>Choose a block</option>
                              {blockOptions}
                            </select>
                            <input value={b.set ?? ''} onChange={(e) => patchButton(n.id, i, { set: e.target.value })} placeholder="Save as service (optional)" aria-label="Save as service" className={`${small} min-w-0 flex-1`} />
                          </>
                        ) : (
                          <input value={b.url ?? ''} onChange={(e) => patchButton(n.id, i, { url: e.target.value })} placeholder="https://…" aria-label="Link" className={`${small} min-w-0 flex-1`} />
                        )}
                      </div>
                    </div>
                  ))}
                  {n.buttons.length < MAX_BUTTONS && (
                    <button type="button" onClick={() => patchNode(n.id, { buttons: [...n.buttons, { label: '', kind: 'goto', target: flow.start }] })} className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
                      <Plus size={15} aria-hidden /> Add button
                    </button>
                  )}
                </div>
              )}

              {n.type !== 'ask' && n.buttons.some((b) => b.kind === 'goto' && b.target) && (
                <p className="text-xs text-gray-500">Leads to: {[...new Set(n.buttons.filter((b) => b.kind === 'goto' && b.target).map((b) => names[b.target!] ?? '?'))].join(' · ')}</p>
              )}
              {n.type === 'ask' && n.next && <p className="text-xs text-gray-500">Leads to: {names[n.next] ?? '?'}</p>}
            </div>
          </section>
        ))}

        <button type="button" onClick={addNode} disabled={flow.nodes.length >= MAX_NODES} className="inline-flex items-center gap-2 border-2 border-dashed border-gray-400 px-4 py-3 text-sm font-semibold hover:border-red-600 hover:text-red-600 disabled:opacity-50">
          <Plus size={16} aria-hidden /> Add block
        </button>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="space-y-4 border border-gray-300 bg-white p-4">
          <Simulator flow={flow} />
          <form action={saveAction} className="space-y-3">
            <input type="hidden" name="flow" value={JSON.stringify(flow)} />
            <button type="submit" disabled={saving} className="w-full bg-red-600 px-4 py-3 text-sm font-semibold hover:bg-black disabled:opacity-60" style={{ color: '#fff' }}>
              {saving ? 'Saving…' : 'Save & publish to the bot'}
            </button>
          </form>
          {status.message && <p className={`text-sm ${status.ok ? 'text-green-700' : 'text-red-700'}`}>{status.message}</p>}
          {custom && (
            <form action={resetAction}>
              <button type="submit" disabled={resetting} onClick={(e) => { if (!confirm('Go back to the built-in bot and discard this flow?')) e.preventDefault(); }} className="inline-flex items-center gap-2 text-sm underline" style={{ color: 'inherit' }}>
                <RotateCcw size={14} aria-hidden /> Use the built-in bot again
              </button>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}
