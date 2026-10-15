// Genera public/og.png (1200x630) para las previsualizaciones sociales.
// Uso: node scripts/og.mjs
import sharp from 'sharp';
import path from 'node:path';

const W = 1200;
const H = 630;
const BG = '#0e1012';
const FG = '#f2f3f1';
const MUTED = '#8b918e';
const FAINT = '#6a706d';
const ACCENT = '#3be27a';
const SANS = 'Noto Sans, DejaVu Sans, Liberation Sans, sans-serif';
const MONO = 'JetBrains Mono, DejaVu Sans Mono, monospace';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" />
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}" />
  <rect width="${W}" height="${H}" fill="url(#grid)" />
  <rect x="0" y="0" width="${W}" height="6" fill="${ACCENT}" />

  <circle cx="1010" cy="316" r="150" fill="none" stroke="${ACCENT}" stroke-opacity="0.30" stroke-width="2" />
  <circle cx="1010" cy="316" r="92" fill="none" stroke="${ACCENT}" stroke-opacity="0.45" stroke-width="2" />
  <circle cx="1010" cy="316" r="16" fill="${ACCENT}" />

  <text x="88" y="176" font-family="${MONO}" font-size="22" letter-spacing="5" fill="${MUTED}">PORTFOLIO &#183; 2026</text>

  <text x="86" y="306" font-family="${SANS}" font-weight="700" font-size="96" letter-spacing="-2" fill="${FG}">Enmanuel Pirela</text>

  <text x="88" y="372" font-family="${SANS}" font-weight="400" font-size="34" fill="#c6cac8">Frontend developer</text>

  <rect x="88" y="424" width="132" height="5" rx="2.5" fill="${ACCENT}" />

  <text x="88" y="520" font-family="${MONO}" font-size="26" fill="${MUTED}">enmanuelpirela.vercel.app</text>
  <text x="88" y="562" font-family="${MONO}" font-size="26" fill="${FAINT}">miso &#183; kata &#183; sysdash</text>
</svg>`;

const out = path.resolve('public/og.png');
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
const meta = await sharp(out).metadata();
console.log(`Escrito ${out} (${meta.width}x${meta.height})`);
