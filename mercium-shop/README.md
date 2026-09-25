# Mercium · Soluciones digitales

Landing page premium para servicios digitales y soluciones comerciales, con identidad visual **«Mercurio»**: superficies cromo/líquidas, fondo oscuro profundo y acento chartreuse.

## Capturas

**Escritorio**

![Mercium escritorio](../assets/screenshots/mercium-desktop.png)

**Móvil**

![Mercium móvil](../assets/screenshots/mercium-mobile.png)

## Descripción

Mercium Shop es una vitrina digital diseñada para mostrar servicios, paquetes y soluciones para negocios que buscan mejorar su presencia online y fortalecer su propuesta comercial. El concepto visual «Mercurio» (superficies cromo/líquidas, fondo oscuro profundo y acento chartreuse `#d7f84a`) le da una identidad propia, alejada del look genérico.

## Características

### Identidad visual
- gota de mercurio animada (CSS puro, sin imágenes) con reflejos metálicos
- texto con acabado cromado en el hero y titular
- spotlight que sigue el cursor y halos de color de fondo
- textura de grano sutil y barra de progreso de scroll en la parte superior

### Catálogo
- 9 soluciones con mockups construidos 100% en CSS por producto
- filtros por categoría con contadores, búsqueda por nombre y orden (menor/mayor precio)
- contador de resultados en tiempo real

### Flujo comercial
- **vista rápida**: modal con features, inversión y CTA sin salir del catálogo
- **carrito interactivo**: drawer con cantidades, eliminar, vaciar y total, persistido en `localStorage`
- **checkout**: modal con resumen detallado, total estimado, formulario de contacto y estado de éxito
- toasts de confirmación al añadir/quitar soluciones

### Confianza y contacto
- sección «Proceso» en tres pasos (descubrir, diseñar, lanzar) y «Feedback» con contadores animados
- copiar email al portapapeles (con fallback) y abrir WhatsApp con mensaje precargado

### Experiencia (UX)
- navbar de cristal fija que reacciona al scroll y menú móvil a pantalla completa
- animaciones reveal al hacer scroll y numeración de ticker en vivo
- cierre de modales con `Esc`, accesible y responsive
- sin overflow horizontal en escritorio ni móvil (verificado)

## Cómo ejecutarlo

Es un solo archivo estático — ábrelo directamente en el navegador:

```bash
# opción A: abrir el archivo
xdg-open index.html        # Linux
open index.html            # macOS

# opción B: servidor local (recomendado)
cd mercium-shop
python3 -m http.server 3000
# → http://localhost:3000
```

El carrito se guarda en `localStorage`, así que persiste entre sesiones.

## Stack

- HTML5
- Tailwind CSS (CDN)
- JavaScript (vanilla)
- Fuentes: Space Grotesk, Manrope, Space Mono, Instrument Serif

## Estructura

```
mercium-shop/
├── index.html    # toda la landing en un solo archivo (markup + estilos + JS)
└── README.md
```

## Demo en vivo

https://portfolio-mercium-shop-enmanuel.netlify.app