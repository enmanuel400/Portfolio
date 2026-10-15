import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

// El sitio es bilingüe: inglés por defecto (sin prefijo) y español bajo /es.
export default defineConfig({
  site: 'https://enmanuelpirela.vercel.app',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  build: {
    inlineStylesheets: 'auto',
  },

  adapter: vercel(),
});