export const SITE = {
  name: 'Enmanuel Pirela',
  url: 'https://enmanuelpirela.vercel.app',
  email: 'enmanuelpirela400@gmail.com',
  links: {
    github: 'https://github.com/enmanuel400',
    linkedin: 'https://www.linkedin.com/in/enmanuel-pirela-697020437/',
  },
  locales: ['en', 'es'] as const,
  defaultLocale: 'en' as const,
} as const;

export type Lang = (typeof SITE.locales)[number];
