import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

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

  // Sin barra de herramientas de desarrollo (molesta y no aporta aquí).
  devToolbar: {
    enabled: false,
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', es: 'es-ES' },
      },
    }),
  ],

  adapter: vercel(),
});