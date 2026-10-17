export const SITE = {
  name: 'MWD',
  email: 'musabj1917@gmail.com',
  phoneDisplay: '0924 502 450',
  phoneTel: '+251924502450',
  whatsappNumber: '251924502450',
  whatsappMessage: 'Hello MWD, I would like to discuss a project.',
  github: 'https://github.com/musabj1917-oss',
  location: 'Addis Ababa, Ethiopia',
} as const;

export const telHref = `tel:${SITE.phoneTel}`;
export const mailHref = `mailto:${SITE.email}`;
export const whatsappHref = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
