import crypto from 'crypto';
import { db } from '@/db';
import { telegramProcessedUpdates, telegramSessions, inquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

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
type InquiryStep = 'idle' | 'awaiting_service' | 'awaiting_details' | 'awaiting_description';

interface SessionState {
  step: InquiryStep;
  serviceOfInterest?: string;
  name?: string;
  contact?: string;
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

// --- Bot Main Handler ---
export async function processTelegramUpdate(update: TelegramUpdate): Promise<{ status: number; body: string }> {
  if (!update || typeof update.update_id !== 'number') {
    return { status: 400, body: 'Invalid update payload' };
  }

  // Deduplication check
  if (await isDuplicateUpdate(update.update_id)) {
    return { status: 200, body: 'Duplicate update ignored' };
  }

  // Handle Callback Queries
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
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
      '<b>Welcome to MWD (Modern Web Development)</b>\n\nWe build custom websites, high-performing e-commerce storefronts, and elegant digital restaurant menus for ambitious businesses.\n\nSelect an option below:',
      MAIN_MENU_KEYBOARD
    );
    return;
  }

  if (data === 'menu_services') {
    await sendTelegramMessage(
      chatId,
      '<b>MWD Digital Services</b>\n\nChoose a service category below to learn details and feature options:',
      SERVICES_KEYBOARD
    );
    return;
  }

  if (data === 'service_web') {
    await sendTelegramMessage(
      chatId,
      '<b>🌐 Custom Website Development</b>\n\nConversion-led, ultra-fast websites built with modern Tech Stack (Next.js, TypeScript, React 19, Tailwind CSS).\n\n<b>Included Features:</b>\n• Custom UI/UX & Responsive Design\n• SEO & Performance Optimization\n• CMS & Admin Dashboard Integration\n• Analytics & Lead Forms\n\n<i>Ready to start? Click below to request a website!</i>',
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
      '<b>🛍 E-Commerce & Dropshipping Stores</b>\n\nHigh-converting digital storefronts designed for speed, seamless navigation, and frictionless checkout.\n\n<b>Included Features:</b>\n• Shopify or Custom Next.js + Stripe Integration\n• Catalog & Inventory Setup\n• Mobile-Optimized Shopping Cart\n• Order Tracking & Admin Panel\n\n<i>Ready to start selling? Request your store now!</i>',
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
      '<b>🍽 Digital Restaurant Menus & QR Solutions</b>\n\nModern interactive menus that make browsing, discovery, and ordering effortless for restaurant guests.\n\n<b>Included Features:</b>\n• Custom QR Code Generation\n• Fast Mobile Web App (no download required)\n• Instant Admin Menu & Pricing Management\n• Multi-Category & Item Photos\n\n<i>Elevate your restaurant experience today!</i>',
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
      '<b>🤖 MWD AI Assistant (Coming Soon)</b>\n\nOur AI Assistant is currently in development for Phase 2. Soon you will be able to ask questions about site architectures, request instant project cost estimates, and get automated technical recommendations.\n\nIn the meantime, feel free to submit an inquiry or contact us directly!',
      MAIN_MENU_KEYBOARD
    );
    return;
  }

  if (data === 'menu_contact') {
    await sendTelegramMessage(
      chatId,
      '<b>📞 Contact MWD</b>\n\n• <b>Email:</b> musabj1917@gmail.com\n• <b>Phone:</b> +251 924 502 450\n• <b>Telegram Direct:</b> @Ethiofreelancer_m\n• <b>Location:</b> Addis Ababa, Ethiopia\n• <b>Website:</b> https://mwd-xm8f.vercel.app/contact\n\n<i>We respond to all inquiries within 1 business day.</i>',
      MAIN_MENU_KEYBOARD
    );
    return;
  }

  if (data === 'menu_request') {
    await setSession(chatIdStr, { step: 'awaiting_service' });
    await sendTelegramMessage(
      chatId,
      '<b>🚀 Guided Website Request Flow</b>\n\nStep 1 of 3: Which service are you interested in?',
      INQUIRY_SERVICE_KEYBOARD
    );
    return;
  }

  if (data.startsWith('req_service_')) {
    const selectedService = data.replace('req_service_', '');
    await setSession(chatIdStr, { step: 'awaiting_details', serviceOfInterest: selectedService });
    await sendTelegramMessage(
      chatId,
      `<b>Service selected:</b> ${selectedService}\n\nStep 2 of 3: Please send us your <b>Name</b> and <b>Email or Phone number</b> (e.g. <code>John Doe, john@example.com</code>).`
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
      '<b>Welcome to MWD (Modern Web Development)</b>\n\nWe build custom websites, high-performing e-commerce storefronts, and elegant digital restaurant menus for ambitious businesses.\n\nUse the menu below or type your inquiry anytime!',
      MAIN_MENU_KEYBOARD
    );
    return;
  }

  // Guided Inquiry Flow State Machine
  if (session.step === 'awaiting_details' && text) {
    await setSession(chatIdStr, {
      ...session,
      step: 'awaiting_description',
      name: text,
      contact: text,
    });
    await sendTelegramMessage(
      chatId,
      'Step 3 of 3: Please briefly describe your project goals, features needed, or budget timeline.'
    );
    return;
  }

  if (session.step === 'awaiting_description' && text) {
    const reference = `REF-TG-${nanoid(6).toUpperCase()}`;
    const userTelegramHandle = msg.from?.username ? `@${msg.from.username}` : `ChatID:${chatId}`;

    try {
      await db.insert(inquiries).values({
        reference,
        name: session.name || msg.from?.first_name || 'Telegram User',
        email: session.contact?.includes('@') ? session.contact : `${chatId}@telegram.mwd`,
        phone: session.contact,
        telegram: userTelegramHandle,
        serviceOfInterest: session.serviceOfInterest || 'General Inquiry',
        projectDescription: text,
        status: 'new',
      });

      await clearSession(chatIdStr);

      await sendTelegramMessage(
        chatId,
        `<b>✅ Inquiry Received!</b>\n\nThank you for reaching out to MWD. Your inquiry reference is <code>${reference}</code>.\n\nOur team will review your project details and contact you shortly!\n\nWebsite: https://mwd-xm8f.vercel.app`,
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
    'I received your message. Please choose an option from the menu below or click <b>Request a Website</b> to start an inquiry:',
    MAIN_MENU_KEYBOARD
  );
}
