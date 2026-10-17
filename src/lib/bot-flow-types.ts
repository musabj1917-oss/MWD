// Flow builder data model. Safe to import from client components (no database access).
import { BOT_DEFAULTS, validateTelegramHtml } from '@/lib/bot-fields';

export type FlowButton = { label: string; kind: 'goto' | 'url'; target?: string; url?: string; set?: string };
export type FlowNode = {
  id: string;
  name: string;
  /** message: shows text + buttons. ask: waits for a typed reply. save: stores the request as an inquiry. */
  type: 'message' | 'ask' | 'save';
  text: string;
  buttons: FlowButton[];
  field?: 'details' | 'description'; // ask blocks: where the reply is kept
  next?: string; // ask blocks: block to go to after the reply
};
export type Flow = { start: string; nodes: FlowNode[] };

export const FLOW_VARS = ['site', 'service', 'reference'];
export const MAX_NODES = 40;
export const MAX_BUTTONS = 8;

/** The flow equal to the built-in bot, using any message edits already made. */
export function buildDefaultFlow(c: Record<string, string> = BOT_DEFAULTS): Flow {
  const t = (k: string) => c[k] ?? BOT_DEFAULTS[k];
  const go = (label: string, target: string, set?: string): FlowButton => ({ label, kind: 'goto', target, ...(set ? { set } : {}) });
  const mainButtons = [go('🛠 Services', 'services'), go('🚀 Request a Website', 'request'), go('🤖 Ask AI (Coming Soon)', 'ask_ai'), go('📞 Contact MWD', 'contact')];
  return {
    start: 'main',
    nodes: [
      { id: 'main', name: 'Main menu', type: 'message', text: t('welcome_menu'), buttons: mainButtons },
      {
        id: 'services', name: 'Services', type: 'message', text: t('services_intro'),
        buttons: [go('🌐 Custom Website Development', 'svc_web'), go('🛍 E-commerce & Dropshipping', 'svc_ecom'), go('🍽 Digital Menus & QR Solutions', 'svc_menu'), go('« Back to Main Menu', 'main')],
      },
      { id: 'svc_web', name: 'Service: Website', type: 'message', text: t('service_web'), buttons: [go('🚀 Request Custom Website', 'ask_details', 'Custom Website'), go('« Back to Services', 'services')] },
      { id: 'svc_ecom', name: 'Service: E-commerce', type: 'message', text: t('service_ecom'), buttons: [go('🚀 Request E-commerce Store', 'ask_details', 'E-commerce Store'), go('« Back to Services', 'services')] },
      { id: 'svc_menu', name: 'Service: Digital menus', type: 'message', text: t('service_menu'), buttons: [go('🚀 Request Digital Menu', 'ask_details', 'Digital Menu'), go('« Back to Services', 'services')] },
      {
        id: 'request', name: 'Request: pick a service', type: 'message', text: t('request_intro'),
        buttons: [go('Custom Website', 'ask_details', 'Custom Website'), go('E-commerce / Dropshipping', 'ask_details', 'E-commerce Store'), go('Digital Menu / QR Code', 'ask_details', 'Digital Menu'), go('Other / Custom Solution', 'ask_details', 'Custom Solution'), go('❌ Cancel Request', 'main')],
      },
      { id: 'ask_details', name: 'Request: name & contact', type: 'ask', text: t('step2'), buttons: [], field: 'details', next: 'ask_desc' },
      { id: 'ask_desc', name: 'Request: project details', type: 'ask', text: t('step3'), buttons: [], field: 'description', next: 'done' },
      { id: 'done', name: 'Request: saved', type: 'save', text: t('inquiry_done'), buttons: mainButtons },
      { id: 'ask_ai', name: 'Ask AI', type: 'message', text: t('ask_ai'), buttons: mainButtons },
      { id: 'contact', name: 'Contact', type: 'message', text: t('contact'), buttons: mainButtons },
    ],
  };
}

export function validateFlow(input: unknown): { flow: Flow } | { error: string } {
  const f = input as Flow;
  if (!f || typeof f !== 'object' || !Array.isArray(f.nodes) || typeof f.start !== 'string') return { error: 'The flow is malformed.' };
  if (f.nodes.length < 1 || f.nodes.length > MAX_NODES) return { error: `A flow needs between 1 and ${MAX_NODES} blocks.` };

  const ids = new Set<string>();
  for (const n of f.nodes) {
    if (typeof n?.id !== 'string' || !/^[A-Za-z0-9_]{1,24}$/.test(n.id)) return { error: 'A block has an invalid id.' };
    if (ids.has(n.id)) return { error: 'Two blocks share the same id.' };
    ids.add(n.id);
  }
  if (!ids.has(f.start)) return { error: 'Pick a start block.' };

  const nodes: FlowNode[] = [];
  for (const n of f.nodes) {
    const label = String(n.name || '').trim().slice(0, 60) || n.id;
    if (!['message', 'ask', 'save'].includes(n.type)) return { error: `"${label}" has an unknown type.` };
    const err = validateTelegramHtml(String(n.text ?? ''), FLOW_VARS);
    if (err) return { error: `"${label}": ${err}` };

    const buttons = Array.isArray(n.buttons) ? n.buttons : [];
    if (buttons.length > MAX_BUTTONS) return { error: `"${label}" has more than ${MAX_BUTTONS} buttons.` };
    const cleanButtons: FlowButton[] = [];
    for (const b of buttons) {
      const bl = String(b?.label ?? '').trim();
      if (!bl || bl.length > 60) return { error: `A button in "${label}" needs a label (max 60 characters).` };
      if (b.kind === 'url') {
        if (!/^https?:\/\/\S+$/i.test(String(b.url ?? ''))) return { error: `Button "${bl}" in "${label}" needs a link starting with http:// or https://.` };
        cleanButtons.push({ label: bl, kind: 'url', url: String(b.url).trim() });
      } else {
        if (!b.target || !ids.has(b.target)) return { error: `Button "${bl}" in "${label}" must lead to a block.` };
        const set = String(b.set ?? '').trim().slice(0, 100);
        cleanButtons.push({ label: bl, kind: 'goto', target: b.target, ...(set ? { set } : {}) });
      }
    }

    const node: FlowNode = { id: n.id, name: label, type: n.type, text: String(n.text).trim(), buttons: cleanButtons };
    if (n.type === 'ask') {
      if (!n.next || !ids.has(n.next)) return { error: `"${label}" must say which block comes after the reply.` };
      node.field = n.field === 'details' ? 'details' : 'description';
      node.next = n.next;
    }
    nodes.push(node);
  }
  return { flow: { start: f.start, nodes } };
}
