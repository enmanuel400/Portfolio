import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../site.config';

/** Piezas de escritura de un idioma, ordenadas. */
export async function getPosts(lang: Lang) {
  const all = await getCollection('writing', ({ data }) => data.lang === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Minutos de lectura aproximados (200 palabras por minuto). */
export function readingMinutes(entry: CollectionEntry<'writing'>): number {
  const words = (entry.body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
