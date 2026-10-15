# Enmanuel Pirela — Portfolio

Portfolio personal de **Enmanuel Pirela**, desarrollador frontend. Tres casos de estudio, un blog técnico y un formulario de contacto que funciona de verdad.

**Sitio:** https://enmanuelpirela.vercel.app

Bilingüe: inglés por defecto en `/` y español en `/es/`. Tema oscuro por defecto, con conmutador claro/oscuro persistente. Estático salvo el endpoint del formulario.

## Stack

- **Astro 7** (SSG + adaptador `@astrojs/vercel` para la ruta en demanda del formulario)
- **CSS nativo** con tokens propios (sin framework): `src/styles/tokens.css` + `src/styles/base.css`
- **Tipografías:** Fredoka (display), Schibsted Grotesk (texto), JetBrains Mono (código)
- **Contenido:** colecciones de Astro (`projects`, `writing`) en Markdown, un archivo por idioma
- **Formulario:** API route (`src/pages/api/contact.ts`) → [Resend](https://resend.com)
- **SEO/social:** `sitemap.xml` con alternancias `hreflang`, `robots.txt` e imagen Open Graph generada con `sharp`

## Estructura

```
src/
  components/     Header, Footer, cuerpos de página, tarjetas, casos…
  content/
    projects/     los 3 casos, en.md / es.md
    writing/      los 3 artículos, por idioma
  data/           helpers de contenido (proyectos, escritos)
  i18n/           textos de interfaz (ui.ts) y utilidades (utils.ts)
  layouts/        Base.astro (head, tema, idioma, motion)
  pages/          rutas: /, /work, /writing, /about, /es/*, /api/contact, 404
  styles/         tokens y primitivas
scripts/
  og.mjs          genera public/og.png (imagen social)
  check-links.mjs revisa enlaces internos sobre la salida compilada
```

## Uso

```bash
npm install
npm run dev          # desarrollo en http://localhost:4321
npm run build        # compila a .vercel/output (Build Output API)
npm run check        # comprobación de tipos de Astro
npm run check:links  # enlaces internos (requiere haber compilado antes)
npm run og           # regenera public/og.png
```

## Formulario de contacto

La ruta `POST /api/contact` envía el mensaje con [Resend](https://resend.com). Necesita dos variables de entorno (en local, en `.env`; en Vercel, en *Environment Variables*):

| Variable | Valor |
| --- | --- |
| `RESEND_API_KEY` | clave de API de Resend (permiso de envío) |
| `CONTACT_FROM` | remitente verificado, p. ej. `Portfolio <onboarding@resend.dev>` |

Incluye validación, límite de envíos por IP, campo trampa (*honeypot*) y escapado del HTML del correo. Sin `RESEND_API_KEY` la ruta responde con error controlado.

## Estructura del repositorio

La app vive en la **raíz**. El portfolio anterior (*trazo v.03*, inmersivo) sigue en `recorrido/` como referencia y no forma parte del build actual.
