# recorrido — trazo v.03

Portfolio inmersivo: **una sola línea continua** (el trazo) conecta estaciones que cuentan quién es Enmanuel Pirela y qué construye. El sitio anterior (`../Desktop/`, trazo v.02, la experiencia tipo escritorio) vive ahora como **estación 05 del recorrido**.

Demo local:

```bash
python3 -m http.server 8123 --directory recorrido
```

## Estaciones

| # | Estación | Contenido |
| --- | --- | --- |
| 00 | Hero | Enmanuel Pirela — "dibujo productos digitales de punta a punta" |
| 01 | Quién soy | Manifiesto, stack y retrato |
| 02 | El recorrido | Mapa con 6 nodos y el trazo que se dibuja |
| 03 | kata ★ | Navegador privado (Tauri) — capturas reales en pestañas |
| 04 | miso ★ | Buscador federado de streaming — búsqueda simulada funcional + captura real en pestañas |
| 05 | trazo | El portfolio desktop v.02 como proyecto |
| 06 | mercium | Landing comercial |
| 07 | sysdash | Dashboard con gráficas canvas en tiempo real |
| 08 | vellum | Workspace visual |
| 09 | Cierre | Contacto |

★ Kata y miso abren el bloque de proyectos: son los más complejos y mejor acabados.

## Stack

- HTML5, CSS3 (variables, auroras por gradientes radiales, grano SVG, 100svh)
- JavaScript + **GSAP ScrollTrigger/ScrollToPlugin** por CDN (sin build)
- Canvas para las gráficas de Sysdash (solo cuando la estación está en vista)
- Resplandor que sigue al cursor — activado solo con puntero fino, tinte según la estación, desactivado con `prefers-reduced-motion`
- `prefers-reduced-motion` y fallback sin-JS/sin-GSAP soportados

## Identidad

Hereda los tokens de trazo v.02 (`--ink`, `--mint`, `--coral`, `--yellow`, Space Grotesk + DM Mono) y añade `--ice` (color del trazo) y `--violet-quiet` (solo proyectos externos: mercium, miso). La marca —un trazo que termina en un punto— vive en `assets/favicon.svg` y en la barra y el pie. Desplegable en Netlify con solo arrastrar la carpeta.