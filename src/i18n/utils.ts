import { ui, defaultLang, type UIKey } from './ui';
import { SITE, type Lang } from '../site.config';

/** Detecta el idioma a partir de la URL (/ y /es). */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first === 'es') return 'es';
  return defaultLang;
}

/** Devuelve una función t() con el idioma ya fijado. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Quita el prefijo /es de una ruta para obtener la ruta neutra. */
export function stripLang(pathname: string): string {
  if (pathname === '/es') return '/';
  if (pathname.startsWith('/es/')) return pathname.slice(3);
  return pathname;
}

/** Convierte una ruta neutra ("/work") en su versión localizada, con barra final. */
export function localizePath(path: string, lang: Lang): string {
  // Normaliza a "/algo/" para coincidir con la URL canónica del build (evita redirecciones).
  let p = path.startsWith('/') ? path : `/${path}`;
  if (p !== '/') p = p.replace(/\/+$/, '') + '/';
  if (lang === defaultLang) return p;
  return p === '/' ? '/es/' : `/es${p}`;
}

/** Devuelve el otro idioma. */
export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'es' : 'en';
}

export { SITE };
