// Editable Telegram bot messages. Safe to import from client components (no database access).
// Telegram HTML supports only <b> <i> <u> <s> <code> <pre>. Placeholders look like {site}.

export type BotField = { key: string; label: string; help: string; vars: string[] };

export const BOT_DEFAULTS: Record<string, string> = {
  "welcome_menu": "<b>Welcome to MWD (Musab Web Design)</b>\n\nWe build custom websites, high-performing e-commerce storefronts, and elegant digital restaurant menus for ambitious businesses.\n\nSelect an option below:",
  "welcome_start": "<b>Welcome to MWD (Musab Web Design)</b>\n\nWe build custom websites, high-performing e-commerce storefronts, and elegant digital restaurant menus for ambitious businesses.\n\nUse the menu below or type your inquiry anytime!",
  "services_intro": "<b>MWD Digital Services</b>\n\nChoose a service category below to learn details and feature options:",
  "service_web": "<b>🌐 Custom Website Development</b>\n\nConversion-led, ultra-fast websites built with modern Tech Stack (Next.js, TypeScript, React 19, Tailwind CSS).\n\n<b>Included Features:</b>\n• Custom UI/UX &amp; Responsive Design\n• SEO &amp; Performance Optimization\n• CMS &amp; Admin Dashboard Integration\n• Analytics &amp; Lead Forms\n\n<i>Ready to start? Click below to request a website!</i>",
  "service_ecom": "<b>🛍 E-Commerce &amp; Dropshipping Stores</b>\n\nHigh-converting digital storefronts designed for speed, seamless navigation, and frictionless checkout.\n\n<b>Included Features:</b>\n• Shopify or Custom Next.js + Stripe Integration\n• Catalog &amp; Inventory Setup\n• Mobile-Optimized Shopping Cart\n• Order Tracking &amp; Admin Panel\n\n<i>Ready to start selling? Request your store now!</i>",
  "service_menu": "<b>🍽 Digital Restaurant Menus &amp; QR Solutions</b>\n\nModern interactive menus that make browsing, discovery, and ordering effortless for restaurant guests.\n\n<b>Included Features:</b>\n• Custom QR Code Generation\n• Fast Mobile Web App (no download required)\n• Instant Admin Menu &amp; Pricing Management\n• Multi-Category &amp; Item Photos\n\n<i>Elevate your restaurant experience today!</i>",
  "ask_ai": "<b>🤖 MWD AI Assistant (Coming Soon)</b>\n\nOur AI Assistant is currently in development for Phase 2. Soon you will be able to ask questions about site architectures, request instant project cost estimates, and get automated technical recommendations.\n\nIn the meantime, feel free to submit an inquiry or contact us directly!",
  "contact": "<b>📞 Contact MWD</b>\n\n• <b>Email:</b> musabj1917@gmail.com\n• <b>Phone:</b> +251 924 502 450\n• <b>Telegram Direct:</b> @Ethiofreelancer_m\n• <b>Location:</b> Addis Ababa, Ethiopia\n• <b>Website:</b> {site}/contact\n\n<i>We respond to all inquiries within 1 business day.</i>",
  "request_intro": "<b>🚀 Guided Website Request Flow</b>\n\nStep 1 of 3: Which service are you interested in?",
  "step2": "<b>Service selected:</b> {service}\n\nStep 2 of 3: Please send us your <b>Name</b> and <b>Email or Phone number</b> (e.g. <code>John Doe, john@example.com</code>).",
  "step3": "Step 3 of 3: Please briefly describe your project goals, features needed, or budget timeline.",
  "inquiry_done": "<b>✅ Inquiry Received!</b>\n\nThank you for reaching out to MWD. Your inquiry reference is <code>{reference}</code>.\n\nOur team will review your project details and contact you shortly!\n\nWebsite: {site}",
  "howto_caption": "<b>🎬 How to use the MWD bot</b>\n\nWatch this short video to see how to browse our services and request a website step by step.",
  "fallback": "I received your message. Please choose an option from the menu below or click <b>Request a Website</b> to start an inquiry:"
};

export const BOT_FIELDS: BotField[] = [
  {
    "key": "welcome_menu",
    "label": "Welcome (menu button / Main Menu)",
    "help": "Shown when someone taps \"Back to Main Menu\".",
    "vars": []
  },
  {
    "key": "welcome_start",
    "label": "Welcome (/start)",
    "help": "Shown when someone sends /start or /help.",
    "vars": []
  },
  {
    "key": "services_intro",
    "label": "Services menu intro",
    "help": "Shown above the list of services.",
    "vars": []
  },
  {
    "key": "service_web",
    "label": "Service: Custom Website",
    "help": "Shown when someone opens the website service.",
    "vars": []
  },
  {
    "key": "service_ecom",
    "label": "Service: E-commerce",
    "help": "Shown when someone opens the e-commerce service.",
    "vars": []
  },
  {
    "key": "service_menu",
    "label": "Service: Digital Menus",
    "help": "Shown when someone opens the digital menus service.",
    "vars": []
  },
  {
    "key": "ask_ai",
    "label": "Ask AI (coming soon)",
    "help": "Shown when someone taps the Ask AI button.",
    "vars": []
  },
  {
    "key": "contact",
    "label": "Contact details",
    "help": "Shown when someone taps Contact MWD.",
    "vars": []
  },
  {
    "key": "request_intro",
    "label": "Request flow: step 1",
    "help": "Asks which service they want.",
    "vars": []
  },
  {
    "key": "step2",
    "label": "Request flow: step 2",
    "help": "Asks for name and email or phone.",
    "vars": [
      "service"
    ]
  },
  {
    "key": "step3",
    "label": "Request flow: step 3",
    "help": "Asks for the project description.",
    "vars": []
  },
  {
    "key": "inquiry_done",
    "label": "Request flow: confirmation",
    "help": "Sent after the inquiry is saved.",
    "vars": [
      "reference"
    ]
  },
  {
    "key": "howto_caption",
    "label": "How-to video caption",
    "help": "Text shown with the how-to video (/howto or the How to use button). Max 1000 characters.",
    "vars": []
  },
  {
    "key": "fallback",
    "label": "Unknown message reply",
    "help": "Sent when someone types something unexpected.",
    "vars": []
  }
];

export const BOT_MAX_LENGTH = 3500;

export const PLACEHOLDER_SAMPLES: Record<string, string> = {
  site: 'https://your-site.vercel.app',
  service: 'Custom Website',
  reference: 'REF-TG-AB12CD',
};

const TAGS = ['b', 'i', 'u', 's', 'code', 'pre'];

/** Returns an error message, or null when the text is safe to send with parse_mode HTML. */
export function validateTelegramHtml(text: string, vars: string[]): string | null {
  const t = text.trim();
  if (!t) return 'The message cannot be empty.';
  if (t.length > BOT_MAX_LENGTH) return `Too long (max ${BOT_MAX_LENGTH} characters).`;

  const allowedVars = new Set(vars);
  for (const m of t.matchAll(/\{(\w+)\}/g)) {
    if (!allowedVars.has(m[1])) return `{${m[1]}} is not available here. You can use: ${[...allowedVars].map((v) => `{${v}}`).join(', ')}.`;
  }

  const stack: string[] = [];
  const tagRe = new RegExp(`</?(${TAGS.join('|')})>`, 'g');
  for (const m of t.matchAll(tagRe)) {
    if (m[0].startsWith('</')) {
      if (stack.pop() !== m[1]) return `The <${m[1]}> tags are not closed correctly.`;
    } else stack.push(m[1]);
  }
  if (stack.length) return `The <${stack[stack.length - 1]}> tag is never closed.`;

  const stripped = t.replace(tagRe, '');
  if (/[<>]/.test(stripped)) return 'Use &lt; and &gt; to show the < and > characters. Only b, i, u, s, code and pre tags are allowed.';
  if (/&(?!(amp|lt|gt|quot);)/.test(stripped)) return 'Write & as &amp;.';
  return null;
}

export function validateBotText(key: string, text: string): string | null {
  const field = BOT_FIELDS.find((f) => f.key === key);
  if (!field) return 'Unknown message.';
  return validateTelegramHtml(text, ['site', ...field.vars]);
}

/** Turns Telegram-style HTML into safe HTML for the admin previews. */
export function renderTelegramPreview(text: string, vars: Record<string, string> = {}): string {
  const all = { ...PLACEHOLDER_SAMPLES, ...vars };
  let html = text.replace(/&(?!(amp|lt|gt|quot);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/&lt;(\/?)(b|i|u|s|code|pre)&gt;/g, '<$1$2>');
  html = html.replace(/\{(\w+)\}/g, (m, name) => (name in all ? all[name].replace(/&/g, '&amp;').replace(/</g, '&lt;') : m));
  return html.replace(/<code>/g, '<code style="background:#e8eef3;padding:0 3px;border-radius:3px">');
}
