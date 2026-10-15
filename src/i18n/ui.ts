import type { Lang } from '../site.config';

export const languages: Record<Lang, string> = {
  en: 'English',
  es: 'Español',
};

export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'brand.role': 'Frontend developer',
    'nav.work': 'Work',
    'nav.writing': 'Writing',
    'nav.about': 'About',
    'nav.menu': 'Menu',
    'nav.skip': 'Skip to content',

    'home.hero.eyebrow': 'Frontend developer',
    'home.hero.title': 'I build interfaces that hold up on the tenth visit.',
    'home.hero.lede':
      'I design and build them end to end: React, Astro and the APIs behind them. The work below is mine, front to back.',
    'home.hero.cta.work': 'See selected work',
    'home.hero.cta.about': 'About me',

    'home.work.eyebrow': 'Selected work',
    'home.work.featured': 'Featured project',
    'home.work.all': 'All work',

    'home.about.eyebrow': 'Who I am',
    'home.about.text':
      'Self-taught frontend developer. No degree, no bootcamp — a lot of reading, a lot of broken builds, and a stubborn habit of finishing what I start.',
    'home.about.more': 'More about me',

    'home.writing.eyebrow': 'Writing',
    'home.writing.all': 'All writing',

    'case.role': 'Role',
    'case.year': 'Year',
    'case.status': 'Status',
    'case.stack': 'Built with',
    'case.repo': 'View the code',
    'case.live': 'Open the live app',
    'case.view': 'View project',
    'case.back': 'All work',
    'case.next': 'Next project',

    'work.title': 'Work',
    'work.lede': 'Three projects, three problems. Each one built end to end.',

    'writing.title': 'Writing',
    'writing.lede': 'Short pieces on the details that decide how an interface feels.',

    'about.title': 'About',
    'about.eyebrow': 'About me',
    'about.stack.title': 'What I work with',
    'about.how.title': 'How I work',
    'about.now.title': 'Right now',
    'about.contact.title': 'Get in touch',
    'about.contact.lede': 'Tell me what you need and I will reply.',
    'form.name': 'Name',
    'form.email': 'Email',
    'form.message': 'Message',
    'form.send': 'Send',
    'form.sending': 'Sending…',
    'form.ok': 'Thanks — your message is on its way.',
    'form.error': 'Something went wrong. Try again, or email me directly.',
    'form.or': 'Or email me directly at',

    'notfound.title': 'Page not found',
    'notfound.text': 'That page does not exist.',
    'notfound.home': 'Back to home',

    'footer.built': 'Built with Astro',
    'footer.rights': '© 2026 Enmanuel Pirela',
    'footer.top': 'Back to top',
  },
  es: {
    'brand.role': 'Desarrollador frontend',
    'nav.work': 'Trabajo',
    'nav.writing': 'Escritos',
    'nav.about': 'Sobre mí',
    'nav.menu': 'Menú',
    'nav.skip': 'Saltar al contenido',

    'home.hero.eyebrow': 'Desarrollador frontend',
    'home.hero.title': 'Construyo interfaces que aguantan la décima visita.',
    'home.hero.lede':
      'Las diseño y las construyo de punta a punta: React, Astro y las APIs que hay detrás. El trabajo de abajo es mío, de principio a fin.',
    'home.hero.cta.work': 'Ver trabajo seleccionado',
    'home.hero.cta.about': 'Sobre mí',

    'home.work.eyebrow': 'Trabajo seleccionado',
    'home.work.featured': 'Proyecto destacado',
    'home.work.all': 'Todo el trabajo',

    'home.about.eyebrow': 'Quién soy',
    'home.about.text':
      'Desarrollador frontend autodidacta. Sin título, sin bootcamp: mucha lectura, muchas builds rotas y la costumbre terca de terminar lo que empiezo.',
    'home.about.more': 'Más sobre mí',

    'home.writing.eyebrow': 'Escritos',
    'home.writing.all': 'Todos los escritos',

    'case.role': 'Rol',
    'case.year': 'Año',
    'case.status': 'Estado',
    'case.stack': 'Construido con',
    'case.repo': 'Ver el código',
    'case.live': 'Abrir la app',
    'case.view': 'Ver proyecto',
    'case.back': 'Todo el trabajo',
    'case.next': 'Proyecto siguiente',

    'work.title': 'Trabajo',
    'work.lede': 'Tres proyectos, tres problemas. Cada uno construido de punta a punta.',

    'writing.title': 'Escritos',
    'writing.lede': 'Piezas cortas sobre los detalles que deciden cómo se siente una interfaz.',

    'about.title': 'Sobre mí',
    'about.eyebrow': 'Sobre mí',
    'about.stack.title': 'Con qué trabajo',
    'about.how.title': 'Cómo trabajo',
    'about.now.title': 'Ahora mismo',
    'about.contact.title': 'Hablemos',
    'about.contact.lede': 'Cuéntame qué necesitas y te respondo.',
    'form.name': 'Nombre',
    'form.email': 'Correo',
    'form.message': 'Mensaje',
    'form.send': 'Enviar',
    'form.sending': 'Enviando…',
    'form.ok': 'Gracias — tu mensaje va en camino.',
    'form.error': 'Algo falló. Inténtalo de nuevo o escríbeme directo.',
    'form.or': 'O escríbeme directo a',

    'notfound.title': 'Página no encontrada',
    'notfound.text': 'Esa página no existe.',
    'notfound.home': 'Volver al inicio',

    'footer.built': 'Hecho con Astro',
    'footer.rights': '© 2026 Enmanuel Pirela',
    'footer.top': 'Volver arriba',
  },
} as const;

export type UIKey = keyof (typeof ui)['en'];
