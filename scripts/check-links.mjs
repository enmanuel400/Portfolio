// Comprueba que todos los href internos del build resuelven a un fichero.
import fs from 'node:fs';
import path from 'node:path';

const root = '.vercel/output/static';
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(root);

const exists = (urlPath) => {
  const p = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const full = path.join(root, p);
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return true;
  return fs.existsSync(path.join(full, 'index.html'));
};

const bad = new Set();
for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const re = /(?:href|src)="(\/[^"]*)"/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (url.startsWith('//') || url.startsWith('/_astro/') || url.startsWith('/api/')) continue;
    if (!exists(url)) bad.add(`${url}  (en ${page.replace(root, '')})`);
  }
}
console.log(
  bad.size
    ? 'ENLACES ROTOS:\n' + [...bad].sort().join('\n')
    : `Sin enlaces internos rotos (revisadas ${pages.length} páginas) ✓`
);
