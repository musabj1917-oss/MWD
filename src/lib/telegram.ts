import crypto from 'crypto';
import { db } from '@/db';
import { telegramProcessedUpdates, telegramSessions, inquiries, botMessages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { botText } from '@/lib/bot-content';
import { getCustomFlow } from '@/lib/bot-flow';
import type { Flow, FlowNode } from '@/lib/bot-flow-types';
import { siteUrl } from '@/lib/site';
import { sendEmail } from '@/lib/email';
import { adminQuoteEmail, customerQuoteEmail, type QuoteEmailData } from '@/lib/email-templates';

// --- Telegram API Types ---
export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  first_name?: string;
  last_name?: string;
  username?: string;
  title?: string;
}

export interface TelegramInlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface TelegramInlineKeyboardMarkup {
  inline_keyboard: TelegramInlineKeyboardButton[][];
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  video?: { file_id: string };
  photo?: { file_id: string }[];
  document?: { file_id: string; mime_type?: string };
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

// --- Constant-time Header Verification ---
export function verifyTelegramSecret(headerSecret: string | null | undefined, expectedSecret: string | undefined): boolean {
  if (!headerSecret || !expectedSecret) return false;

  const headerBuffer = Buffer.from(headerSecret);
  const expectedBuffer = Buffer.from(expectedSecret);

  if (headerBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(headerBuffer, expectedBuffer);
}

// --- Telegram API Client ---
async function callTelegramApi(method: string, payload: Record<string, unknown>): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not configured.');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Telegram API error (${method}): ${response.status}`, errorText.slice(0, 200));
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Failed to execute Telegram API method ${method}:`, error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export async function sendTelegramVideo(
  chatId: number | string,
  video: string,
  caption?: string,
  replyMarkup?: TelegramInlineKeyboardMarkup
): Promise<boolean> {
  return callTelegramApi('sendVideo', {
    chat_id: chatId,
    video,
    caption,
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
    supports_streaming: true,
  });
}

export async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  replyMarkup?: TelegramInlineKeyboardMarkup
): Promise<boolean> {
  return callTelegramApi('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
    disable_web_page_preview: true,
  });
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<boolean> {
  return callTelegramApi('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
  });
}

export async function deleteTelegramMessage(chatId: number | string, messageId: number): Promise<boolean> {
  return callTelegramApi('deleteMessage', { chat_id: chatId, message_id: messageId });
}

// Removes the message whose button was just tapped, so only the newest message stays in the chat
export async function removeTappedMessage(cb: TelegramCallbackQuery): Promise<void> {
  if (cb.message && cb.message.chat.type === 'private') {
    await deleteTelegramMessage(cb.message.chat.id, cb.message.message_id);
  }
}

// --- Email notification (same emails the website form sends; best-effort, never breaks the bot) ---
async function notifyAboutTelegramInquiry(i: {
  id: number;
  reference: string;
  name: string;
  contact?: string;
  telegram: string;
  service?: string | null;
  description: string;
}): Promise<void> {
  try {
    const realEmail = i.contact && i.contact.includes('@') ? i.contact : undefined;
    const phone = i.contact && !i.contact.includes('@') ? i.contact : null;
    const data: QuoteEmailData = {
      reference: i.reference,
      inquiryId: i.id,
      name: i.name,
      email: realEmail ?? '(via Telegram)',
      phone,
      telegram: i.telegram,
      serviceOfInterest: i.service ?? null,
      budgetRange: null,
      timeline: null,
      projectDescription: i.description,
      photoCids: [],
      photoCount: 0,
      submittedAt: new Date(),
    };

    const adminTo = process.env.ADMIN_NOTIFY_EMAIL;
    if (adminTo) {
      const admin = adminQuoteEmail(data);
      await sendEmail({ to: adminTo, replyTo: realEmail, subject: admin.subject, html: admin.html, text: admin.text });
    } else {
      console.warn('ADMIN_NOTIFY_EMAIL is not set; skipping Telegram inquiry email.');
    }

    // Telegram users often leave a phone number only: confirm by email when they gave a real address
    if (realEmail) {
      const customer = customerQuoteEmail(data);
      await sendEmail({ to: realEmail, replyTo: adminTo || undefined, subject: customer.subject, html: customer.html, text: customer.text });
    }
  } catch (error) {
    console.error('Failed to send Telegram inquiry emails', error instanceof Error ? error.message : error);
  }
}

// --- Deduplication Helper ---
async function isDuplicateUpdate(updateId: number): Promise<boolean> {
  const idStr = String(updateId);
  try {
    const existing = await db
      .select({ updateId: telegramProcessedUpdates.updateId })
      .from(telegramProcessedUpdates)
      .where(eq(telegramProcessedUpdates.updateId, idStr))
      .limit(1);

    if (existing.length > 0) return true;

    await db.insert(telegramProcessedUpdates).values({ updateId: idStr });
    return false;
  } catch (error) {
    console.error('Database error checking telegram update deduplication:', error);
    // If DB fails, allow processing safely to avoid completely breaking bot
    return false;
  }
}

// --- Session Helper ---
// Built-in bot uses the first four steps; the flow builder uses 'ask:<blockId>'
type InquiryStep = string;

interface SessionState {
  step: InquiryStep;
  serviceOfInterest?: string;
  name?: string;
  contact?: string;
  vars?: Record<string, string>;
}

async function getSession(chatId: string): Promise<SessionState> {
  try {
    const rows = await db
      .select()
      .from(telegramSessions)
      .where(eq(telegramSessions.chatId, chatId))
      .limit(1);

    if (rows.length === 0) {
      return { step: 'idle' };
    }

    const data = rows[0].data ? JSON.parse(rows[0].data) : {};
    return {
      step: (rows[0].step as InquiryStep) || 'idle',
      ...data,
    };
  } catch (error) {
    console.error('Error fetching Telegram session:', error);
    return { step: 'idle' };
  }
}

async function setSession(chatId: string, state: SessionState): Promise<void> {
  const { step, ...rest } = state;
  const dataJson = JSON.stringify(rest);

  try {
    const existing = await db
      .select({ chatId: telegramSessions.chatId })
      .from(telegramSessions)
      .where(eq(telegramSessions.chatId, chatId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(telegramSessions)
        .set({ step, data: dataJson, updatedAt: new Date() })
        .where(eq(telegramSessions.chatId, chatId));
    } else {
      await db.insert(telegramSessions).values({
        chatId,
        step,
        data: dataJson,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error setting Telegram session:', error);
  }
}

async function clearSession(chatId: string): Promise<void> {
  await setSession(chatId, { step: 'idle' });
}

// --- Keyboards & Menus ---
export const MAIN_MENU_KEYBOARD: TelegramInlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: '🛠 Services', callback_data: 'menu_services' },
      { text: '🚀 Request a Website', callback_data: 'menu_request' },
    ],
    [
      { text: '🤖 Ask AI (Coming Soon)', callback_data: 'menu_ask_ai' },
      { text: '📞 Contact MWD', callback_data: 'menu_contact' },
    ],
  ],
};

export const SERVICES_KEYBOARD: TelegramInlineKeyboardMarkup = {
  inline_keyboard: [
    [{ text: '🌐 Custom Website Development', callback_data: 'service_web' }],
    [{ text: '🛍 E-commerce & Dropshipping', callback_data: 'service_ecom' }],
    [{ text: '🍽 Digital Menus & QR Solutions', callback_data: 'service_menu' }],
    [{ text: '« Back to Main Menu', callback_data: 'menu_main' }],
  ],
};

export const INQUIRY_SERVICE_KEYBOARD: TelegramInlineKeyboardMarkup = {
  inline_keyboard: [
    [{ text: 'Custom Website', callback_data: 'req_service_Custom Website' }],
    [{ text: 'E-commerce / Dropshipping', callback_data: 'req_service_E-commerce Store' }],
    [{ text: 'Digital Menu / QR Code', callback_data: 'req_service_Digital Menu' }],
    [{ text: 'Other / Custom Solution', callback_data: 'req_service_Custom Solution' }],
    [{ text: '❌ Cancel Request', callback_data: 'cancel_inquiry' }],
  ],
};

// Splits "John Doe, john@example.com" (or "John Doe 0911 223 344") into a name and a contact.
export function parseNameAndContact(input: string): { name: string; contact: string } {
  const text = input.trim();
  const email = text.match(/[^\s,;<>()]+@[^\s,;<>()]+\.[^\s,;<>()]+/);
  const phone = email ? null : text.match(/\+?\d[\d\s().-]{6,}\d/);
  const found = email?.[0] ?? phone?.[0];
  if (!found) return { name: text.slice(0, 200), contact: '' };
  const name = text.replace(found, '').replace(/[\s,;:|-]+$/g, '').replace(/^[\s,;:|-]+/g, '').trim();
  return { name: (name || 'Telegram User').slice(0, 200), contact: found.trim() };
}

// The how-to video is set in the website admin (/admin/bot) or by the owner inside Telegram (/admin).
// The saved value is a direct video link, another link, or a Telegram file_id.
async function sendHowToVideoPart(chatId: number, video: string): Promise<void> {
  const isUrl = /^https?:\/\//i.test(video);
  const isDirectFile = /\.(mp4|mov|webm)(\?.*)?$/i.test(video);

  // A Telegram file_id or a direct video file plays right inside the chat, with no text
  if (!isUrl || isDirectFile) {
    if (await sendTelegramVideo(chatId, video)) return;
  }

  // Any other link (YouTube, TikTok, ...) goes as the link only; Telegram shows a preview with a play button
  if (isUrl) {
    await callTelegramApi('sendMessage', { chat_id: chatId, text: video });
  }
}

async function sendConfiguredHowToVideo(chatId: number): Promise<void> {
  try {
    const [videoRow] = await db.select().from(botMessages).where(eq(botMessages.key, 'howto_video')).limit(1);
    const [photoRow] = await db.select().from(botMessages).where(eq(botMessages.key, 'howto_photos')).limit(1);
    const video = videoRow?.value?.trim();
    let photos: string[] = [];
    try {
      const parsed: unknown = JSON.parse(photoRow?.value ?? '[]');
      if (Array.isArray(parsed)) photos = parsed.filter((x): x is string => typeof x === 'string').slice(0, 10);
    } catch {
      photos = [];
    }

    if (video) await sendHowToVideoPart(chatId, video);

    if (photos.length === 1) {
      await callTelegramApi('sendPhoto', { chat_id: chatId, photo: photos[0] });
    } else if (photos.length > 1) {
      await callTelegramApi('sendMediaGroup', {
        chat_id: chatId,
        media: photos.map((id) => ({ type: 'photo', media: id })),
      });
    }
  } catch (error) {
    console.error('Could not send configured how-to media:', error);
  }
}

// Hidden admin: /admin <ADMIN_PASSWORD>, then send a video file or a link. Returns true when the update was handled.
async function handleHowToAdmin(msg: TelegramMessage): Promise<boolean> {
  if (msg.chat.type !== 'private') return false;
  const chatId = msg.chat.id;
  const chatIdStr = String(chatId);
  const text = msg.text?.trim();
  const fileId = msg.video?.file_id ?? (msg.document?.mime_type?.startsWith('video/') ? msg.document.file_id : undefined);
  const photoId = msg.photo?.length ? msg.photo[msg.photo.length - 1].file_id : undefined;

  if (text && /^\/admin(\s|$)/.test(text)) {
    // Remove the message so the password does not stay in the chat
    await deleteTelegramMessage(chatId, msg.message_id);
    const password = text.replace(/^\/admin\s*/, '');
    if (!verifyTelegramSecret(password, process.env.ADMIN_PASSWORD)) {
      await sendTelegramMessage(chatId, 'Wrong password.');
      return true;
    }
    try {
      await db
        .insert(botMessages)
        .values({ key: 'admin_chat_id', value: chatIdStr })
        .onConflictDoUpdate({ target: botMessages.key, set: { value: chatIdStr, updatedAt: new Date() } });
    } catch (error) {
      console.error('Could not save admin chat:', error instanceof Error ? error.message : error);
    }
    await setSession(chatIdStr, { step: 'admin_video' });
    await sendTelegramMessage(
      chatId,
      '<b>Admin mode</b>\n\nSend me the how-to video, or photos (up to 10, one by one), or paste a video link (https://...).\n\n/remove - delete the current video and photos\n/cancel - leave admin mode'
    );
    return true;
  }

  if (!text && !fileId && !photoId) return false;
  const session = await getSession(chatIdStr);
  if (session.step !== 'admin_video') return false;

  if (text === '/start' || text === '/help') {
    await clearSession(chatIdStr);
    return false;
  }
  if (text === '/cancel') {
    await clearSession(chatIdStr);
    await sendTelegramMessage(chatId, 'Left admin mode.', MAIN_MENU_KEYBOARD);
    return true;
  }
  if (text === '/remove') {
    await db.delete(botMessages).where(eq(botMessages.key, 'howto_video'));
    await db.delete(botMessages).where(eq(botMessages.key, 'howto_photos'));
    await clearSession(chatIdStr);
    await sendTelegramMessage(chatId, '✅ How-to video and photos removed.', MAIN_MENU_KEYBOARD);
    return true;
  }

  if (photoId) {
    try {
      const [row] = await db.select().from(botMessages).where(eq(botMessages.key, 'howto_photos')).limit(1);
      let list: string[] = [];
      try {
        const parsed: unknown = JSON.parse(row?.value ?? '[]');
        if (Array.isArray(parsed)) list = parsed.filter((x): x is string => typeof x === 'string');
      } catch {
        list = [];
      }
      if (list.length >= 10) {
        await sendTelegramMessage(chatId, 'You can add up to 10 photos. Send /remove to start over.');
        return true;
      }
      list.push(photoId);
      const value = JSON.stringify(list);
      await db
        .insert(botMessages)
        .values({ key: 'howto_photos', value })
        .onConflictDoUpdate({ target: botMessages.key, set: { value, updatedAt: new Date() } });
      await sendTelegramMessage(chatId, `✅ Photo ${list.length} saved. Send more photos, or /cancel when you are done.`);
    } catch (error) {
      console.error('Could not save how-to photo:', error instanceof Error ? error.message : error);
      await sendTelegramMessage(chatId, '⚠️ Could not save the photo. Please try again.');
    }
    return true;
  }

  const value = fileId ?? (text && /^https?:\/\/\S+$/i.test(text) ? text : null);
  if (!value) {
    await sendTelegramMessage(chatId, 'Please send a video, a photo, or a link that starts with https://\n\n/cancel to stop.');
    return true;
  }

  try {
    await db
      .insert(botMessages)
      .values({ key: 'howto_video', value })
      .onConflictDoUpdate({ target: botMessages.key, set: { value, updatedAt: new Date() } });
  } catch (error) {
    console.error('Could not save how-to video:', error instanceof Error ? error.message : error);
    await sendTelegramMessage(chatId, '⚠️ Could not save the video. Please try again.');
    return true;
  }
  await clearSession(chatIdStr);
  await sendTelegramMessage(chatId, '✅ Video saved. It now opens first when someone sends /start.', MAIN_MENU_KEYBOARD);
  return true;
}

// --- Bot Main Handler ---
export async function processTelegramUpdate(update: TelegramUpdate): Promise<{ status: number; body: string }> {
  if (!update || typeof update.update_id !== 'number') {
    return { status: 400, body: 'Invalid update payload' };
  }

  // Deduplication check
  if (await isDuplicateUpdate(update.update_id)) {
    return { status: 200, body: 'Duplicate update ignored' };
  }

  // Hidden admin: /admin <password>, then a video or link sets the how-to video
  if (update.message && (await handleHowToAdmin(update.message))) {
    return { status: 200, body: 'Message processed' };
  }

  // The how-to video opens first on /start, before the welcome message
  if (update.message?.chat.type === 'private' && /^\/start(@\w+)?(\s|$)/.test(update.message.text?.trim() ?? '')) {
    await sendConfiguredHowToVideo(update.message.chat.id);
  }

  // A flow saved in /admin/bot/flow replaces the built-in conversation
  const flow = await getCustomFlow();
  if (flow) {
    if (update.callback_query) {
      const handled = await handleFlowCallback(update.callback_query, flow);
      if (handled) await removeTappedMessage(update.callback_query);
      return { status: 200, body: 'Callback processed' };
    }
    if (update.message) {
      await handleFlowMessage(update.message, flow);
      return { status: 200, body: 'Message processed' };
    }
    return { status: 200, body: 'Update type unhandled' };
  }

  // Handle Callback Queries
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
    await removeTappedMessage(update.callback_query);
    return { status: 200, body: 'Callback processed' };
  }

  // Handle Text Messages
  if (update.message) {
    await handleMessage(update.message);
    return { status: 200, body: 'Message processed' };
  }

  return { status: 200, body: 'Update type unhandled' };
}

async function handleCallbackQuery(cb: TelegramCallbackQuery): Promise<void> {
  const callbackId = cb.id;
  const data = cb.data;
  const chatId = cb.message?.chat.id;
  const chatType = cb.message?.chat.type;

  await answerCallbackQuery(callbackId);

  if (!chatId || chatType !== 'private') {
    return;
  }

  const chatIdStr = String(chatId);

  if (!data) return;

  if (data === 'menu_main') {
    await clearSession(chatIdStr);
    await sendTelegramMessage(
      chatId,
      await botText('welcome_menu'),
      MAIN_MENU_KEYBOARD
    );
    return;
  }

  if (data === 'menu_services') {
    await sendTelegramMessage(
      chatId,
      await botText('services_intro'),
      SERVICES_KEYBOARD
    );
    return;
  }

  if (data === 'service_web') {
    await sendTelegramMessage(
      chatId,
      await botText('service_web'),
      {
        inline_keyboard: [
          [{ text: '🚀 Request Custom Website', callback_data: 'req_service_Custom Website' }],
          [{ text: '« Back to Services', callback_data: 'menu_services' }],
        ],
      }
    );
    return;
  }

  if (data === 'service_ecom') {
    await sendTelegramMessage(
      chatId,
      await botText('service_ecom'),
      {
        inline_keyboard: [
          [{ text: '🚀 Request E-commerce Store', callback_data: 'req_service_E-commerce Store' }],
          [{ text: '« Back to Services', callback_data: 'menu_services' }],
        ],
      }
    );
    return;
  }

  if (data === 'service_menu') {
    await sendTelegramMessage(
      chatId,
      await botText('service_menu'),
      {
        inline_keyboard: [
          [{ text: '🚀 Request Digital Menu', callback_data: 'req_service_Digital Menu' }],
          [{ text: '« Back to Services', callback_data: 'menu_services' }],
        ],
      }
    );
    return;
  }

  if (data === 'menu_ask_ai') {
    await sendTelegramMessage(
      chatId,
      await botText('ask_ai'),
      MAIN_MENU_KEYBOARD
    );
    return;
  }

  if (data === 'menu_contact') {
    await sendTelegramMessage(
      chatId,
      await botText('contact'),
      MAIN_MENU_KEYBOARD
    );
    return;
  }

  if (data === 'menu_request') {
    await setSession(chatIdStr, { step: 'awaiting_service' });
    await sendTelegramMessage(
      chatId,
      await botText('request_intro'),
      INQUIRY_SERVICE_KEYBOARD
    );
    return;
  }

  if (data.startsWith('req_service_')) {
    const selectedService = data.replace('req_service_', '');
    await setSession(chatIdStr, { step: 'awaiting_details', serviceOfInterest: selectedService });
    await sendTelegramMessage(
      chatId,
      await botText('step2', { service: selectedService })
    );
    return;
  }

  if (data === 'cancel_inquiry') {
    await clearSession(chatIdStr);
    await sendTelegramMessage(
      chatId,
      'Inquiry request cancelled.',
      MAIN_MENU_KEYBOARD
    );
    return;
  }
}

async function handleMessage(msg: TelegramMessage): Promise<void> {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  const text = msg.text?.trim();

  // Restrict customer interface to private chats initially
  if (chatType !== 'private') {
    return;
  }

  const chatIdStr = String(chatId);
  const session = await getSession(chatIdStr);

  if (text === '/start' || text === '/help') {
    await clearSession(chatIdStr);
    await sendTelegramMessage(
      chatId,
      await botText('welcome_start'),
      MAIN_MENU_KEYBOARD
    );
    await deleteTelegramMessage(chatId, msg.message_id);
    return;
  }

  // Guided Inquiry Flow State Machine
  if (session.step === 'awaiting_details' && text) {
    const { name, contact } = parseNameAndContact(text);
    await setSession(chatIdStr, {
      ...session,
      step: 'awaiting_description',
      name,
      contact,
    });
    await sendTelegramMessage(
      chatId,
      await botText('step3')
    );
    return;
  }

  if (session.step === 'awaiting_description' && text) {
    const reference = `REF-TG-${nanoid(6).toUpperCase()}`;
    const userTelegramHandle = msg.from?.username ? `@${msg.from.username}` : `ChatID:${chatId}`;

    try {
      const [saved] = await db.insert(inquiries).values({
        reference,
        name: session.name || msg.from?.first_name || 'Telegram User',
        email: session.contact?.includes('@') ? session.contact : `${chatId}@telegram.mwd`,
        phone: session.contact && !session.contact.includes('@') ? session.contact : null,
        telegram: userTelegramHandle,
        serviceOfInterest: session.serviceOfInterest || 'General Inquiry',
        projectDescription: text,
        status: 'new',
      }).returning({ id: inquiries.id });

      await notifyAboutTelegramInquiry({
        id: saved.id,
        reference,
        name: session.name || msg.from?.first_name || 'Telegram User',
        contact: session.contact,
        telegram: userTelegramHandle,
        service: session.serviceOfInterest || 'General Inquiry',
        description: text,
      });

      await clearSession(chatIdStr);

      await sendTelegramMessage(
        chatId,
        await botText('inquiry_done', { reference }),
        MAIN_MENU_KEYBOARD
      );
    } catch (error) {
      console.error('Error saving Telegram inquiry to database:', error);
      await sendTelegramMessage(
        chatId,
        '⚠️ An unexpected error occurred while saving your inquiry. Please try again or contact us directly at musabj1917@gmail.com.',
        MAIN_MENU_KEYBOARD
      );
    }
    return;
  }

  // Default response for unhandled text messages
  await sendTelegramMessage(
    chatId,
    await botText('fallback'),
    MAIN_MENU_KEYBOARD
  );
}

// --- Flow builder runtime ---
const escapeTg = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function fillVars(text: string, vars: Record<string, string>): string {
  const all: Record<string, string> = { site: siteUrl, service: '', reference: '', ...vars };
  return text.replace(/\{(\w+)\}/g, (m, name) => (name in all ? escapeTg(all[name]) : m));
}

async function sendFlowNode(chatId: number, node: FlowNode, vars: Record<string, string>): Promise<void> {
  const keyboard: TelegramInlineKeyboardMarkup | undefined = node.buttons.length
    ? {
        inline_keyboard: node.buttons.map((b, i) => [
          b.kind === 'url' ? { text: b.label, url: b.url } : { text: b.label, callback_data: `b:${node.id}:${i}` },
        ]),
      }
    : undefined;
  await sendTelegramMessage(chatId, fillVars(node.text, vars), keyboard);
}

async function enterFlowNode(chatId: number, flow: Flow, nodeId: string, session: SessionState, from?: TelegramUser): Promise<void> {
  const node = flow.nodes.find((n) => n.id === nodeId) ?? flow.nodes.find((n) => n.id === flow.start);
  if (!node) return;
  const chatIdStr = String(chatId);
  const vars = { ...(session.vars ?? {}) };

  if (node.type === 'ask') {
    await setSession(chatIdStr, { step: `ask:${node.id}`, vars });
    await sendFlowNode(chatId, node, vars);
    return;
  }

  if (node.type === 'save') {
    const reference = `REF-TG-${nanoid(6).toUpperCase()}`;
    const { name, contact } = parseNameAndContact(vars.details ?? '');
    try {
      const [saved] = await db.insert(inquiries).values({
        reference,
        name: name || from?.first_name || 'Telegram User',
        email: contact.includes('@') ? contact : `${chatId}@telegram.mwd`,
        phone: contact && !contact.includes('@') ? contact : null,
        telegram: from?.username ? `@${from.username}` : `ChatID:${chatId}`,
        serviceOfInterest: vars.service || 'General Inquiry',
        projectDescription: vars.description || '(no description)',
        status: 'new',
      }).returning({ id: inquiries.id });

      await notifyAboutTelegramInquiry({
        id: saved.id,
        reference,
        name: name || from?.first_name || 'Telegram User',
        contact,
        telegram: from?.username ? `@${from.username}` : `ChatID:${chatId}`,
        service: vars.service || 'General Inquiry',
        description: vars.description || '(no description)',
      });
    } catch (error) {
      console.error('Error saving Telegram inquiry to database:', error);
      await sendTelegramMessage(chatId, '⚠️ An unexpected error occurred while saving your request. Please try again in a moment.');
      return;
    }
    await clearSession(chatIdStr);
    await sendFlowNode(chatId, node, { ...vars, reference });
    return;
  }

  await setSession(chatIdStr, { step: 'idle', vars });
  await sendFlowNode(chatId, node, vars);
}

async function handleFlowCallback(cb: TelegramCallbackQuery, flow: Flow): Promise<boolean> {
  await answerCallbackQuery(cb.id);
  const chatId = cb.message?.chat.id;
  if (!chatId || cb.message?.chat.type !== 'private' || !cb.data) return false;

  const [kind, nodeId, idx] = cb.data.split(':');
  if (kind !== 'b') return false;
  const node = flow.nodes.find((n) => n.id === nodeId);
  const button = node?.buttons[Number(idx)];
  if (!button || button.kind !== 'goto' || !button.target) return false;

  const session = await getSession(String(chatId));
  const vars = { ...(session.vars ?? {}) };
  if (button.set) vars.service = button.set;
  await enterFlowNode(chatId, flow, button.target, { step: 'idle', vars }, cb.from);
  return true;
}

async function handleFlowMessage(msg: TelegramMessage, flow: Flow): Promise<void> {
  if (msg.chat.type !== 'private') return;
  const chatId = msg.chat.id;
  const chatIdStr = String(chatId);
  const text = msg.text?.trim();
  const session = await getSession(chatIdStr);

  if (text === '/start' || text === '/help') {
    await clearSession(chatIdStr);
    await enterFlowNode(chatId, flow, flow.start, { step: 'idle' }, msg.from);
    await deleteTelegramMessage(chatId, msg.message_id);
    return;
  }

  if (session.step.startsWith('ask:') && text) {
    const node = flow.nodes.find((n) => n.id === session.step.slice(4));
    if (node && node.type === 'ask') {
      const vars = { ...(session.vars ?? {}), [node.field ?? 'description']: text.slice(0, 4000) };
      await enterFlowNode(chatId, flow, node.next ?? flow.start, { step: 'idle', vars }, msg.from);
      return;
    }
  }

  await enterFlowNode(chatId, flow, flow.start, { step: 'idle', vars: session.vars }, msg.from);
}
