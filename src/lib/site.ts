export const SITE = {
  name: 'MWD',
  email: 'musabj1917@gmail.com',
  phoneDisplay: '0924 502 450',
  phoneTel: '+251924502450',
  whatsappNumber: '251924502450',
  whatsappMessage: 'Hello MWD, I would like to discuss a project.',
  telegramUsername: 'Ethiofreelancer_m',
  github: 'https://github.com/musabj1917-oss',
  responseTime: 'within 1 business day',
  location: 'Addis Ababa, Ethiopia',
} as const;

// Single source of truth for the public base URL (always has https://, never a trailing slash)
const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mwd-xm8f.vercel.app').trim().replace(/\/+$/, '');
export const siteUrl = /^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`;

export const telHref = `tel:${SITE.phoneTel}`;
export const mailHref = `mailto:${SITE.email}`;
export const whatsappHref = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

export const telegramHref = `https://t.me/${SITE.telegramUsername}`;
