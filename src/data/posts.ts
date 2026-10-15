import type { Lang } from '../site.config';

export type Post = { slug: string; title: string; description: string };

export const posts: Record<Lang, Post[]> = {
  en: [
    {
      slug: 'the-states-you-skip',
      title: 'The states you skip',
      description:
        'Empty, loading and error states are what separate a demo from a finished interface. How I handle them in miso and sysdash.',
    },
    {
      slug: 'local-servers-are-a-feature',
      title: 'Local servers are a feature',
      description:
        "Putting a server inside a desktop app isn't over-engineering. How miso sidesteps CORS, skips the ads and keeps your data local.",
    },
    {
      slug: 'a-design-system-for-one-person',
      title: 'A design system for one person',
      description:
        'How a handful of tokens — colour, type, spacing — keep a solo project coherent without turning into bureaucracy.',
    },
  ],
  es: [
    {
      slug: 'the-states-you-skip',
      title: 'Los estados que te saltas',
      description:
        'Los estados vacío, de carga y de error son lo que separa una demo de una interfaz terminada. Cómo los trato en miso y sysdash.',
    },
    {
      slug: 'local-servers-are-a-feature',
      title: 'Los servidores locales son una función',
      description:
        'Meter un servidor dentro de una app de escritorio no es sobre-ingeniería. Cómo miso esquiva el CORS, se salta los anuncios y mantiene tus datos en local.',
    },
    {
      slug: 'a-design-system-for-one-person',
      title: 'Un design system para una persona',
      description:
        'Cómo un puñado de tokens —color, tipo, espacio— mantiene coherente un proyecto en solitario sin convertirse en burocracia.',
    },
  ],
};
