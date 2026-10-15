import type { Lang } from '../site.config';

export const about: Record<
  Lang,
  {
    h1: string;
    intro: string[];
    stack: { label: string; items: string[] }[];
    how: { title: string; items: string[] };
    now: { title: string; items: string[] };
    contact: { title: string; lede: string };
  }
> = {
  en: {
    h1: 'I build interfaces that hold up on the tenth visit.',
    intro: [
      "I'm a frontend developer, self-taught. No degree, no bootcamp — a lot of reading, a lot of broken builds, and a stubborn habit of finishing what I start. The projects on this site I designed and built end to end: interface, logic and the backend behind it.",
      "I care about the part of the work that's easy to skip: the empty state, the first load, the moment something fails. A clean hero is the beginning of the job, not the job. What I want to make is an interface that still feels considered after you've used it for a while.",
    ],
    stack: [
      { label: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Astro'] },
      { label: 'Desktop', items: ['Electron', 'Tauri (Rust)', 'Node/Express'] },
      { label: 'Backend / API', items: ['Python', 'FastAPI'] },
      { label: 'Tooling', items: ['Vite', 'Playwright', 'Chart.js'] },
    ],
    how: {
      title: 'How I work',
      items: [
        'Start from the problem, not the layout.',
        'Build something real early, then refine against it.',
        'Verify instead of assuming: performance, contrast, real devices.',
      ],
    },
    now: {
      title: 'Right now',
      items: [
        'Improving miso and kata, and keeping sysdash sharp.',
        'Open to frontend roles and freelance work.',
      ],
    },
    contact: {
      title: 'Get in touch',
      lede: 'Tell me what you need and I will reply.',
    },
  },
  es: {
    h1: 'Construyo interfaces que aguantan la décima visita.',
    intro: [
      'Soy desarrollador frontend, autodidacta. Sin título, sin bootcamp: mucha lectura, muchas builds rotas y la costumbre terca de terminar lo que empiezo. Los proyectos de este sitio los diseñé y construí de punta a punta: interfaz, lógica y el backend que hay detrás.',
      'Me importa la parte que es fácil saltarse: el estado vacío, la primera carga, el momento en que algo falla. Un hero limpio es el comienzo del trabajo, no el trabajo. Lo que quiero construir es una interfaz que siga pareciendo cuidada después de usarla un rato.',
    ],
    stack: [
      { label: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Astro'] },
      { label: 'Escritorio', items: ['Electron', 'Tauri (Rust)', 'Node/Express'] },
      { label: 'Backend / API', items: ['Python', 'FastAPI'] },
      { label: 'Herramientas', items: ['Vite', 'Playwright', 'Chart.js'] },
    ],
    how: {
      title: 'Cómo trabajo',
      items: [
        'Empiezo por el problema, no por el layout.',
        'Construyo algo real pronto y refino contra eso.',
        'Verifico en vez de suponer: rendimiento, contraste, dispositivos reales.',
      ],
    },
    now: {
      title: 'Ahora mismo',
      items: [
        'Mejorando miso y kata, y manteniendo al día sysdash.',
        'Abierto a puestos frontend y trabajo freelance.',
      ],
    },
    contact: {
      title: 'Hablemos',
      lede: 'Cuéntame qué necesitas y te respondo.',
    },
  },
};
