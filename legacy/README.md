# legacy

Material antiguo del repositorio, conservado por si acaso. **No forma parte del sitio**: no se compila, no se despliega y nada de aquí se importa. El build solo mira `src/`, `public/`, `scripts/` y los archivos de configuración de la raíz.

| Carpeta | Qué es |
| --- | --- |
| `recorrido/` | Portfolio anterior (*trazo v.03*, inmersivo): HTML, CSS y JS del sitio que había antes. |
| `vellum/` | Editor de notas en Electron con Vite y Tailwind. |
| `sysdash/` | Panel de sistema: backend en Python y frontend. |
| `mercium-shop/` | Escaparate de tienda en HTML. |
| `Desktop/` | Interfaz de escritorio para *kata* (prototipo con sus capturas). |
| `content/` | Borradores de los textos del portfolio (`DRAFT-v1`, `DRAFT-v2`). |
| `assets/perfil.jpeg` | Copia: la que usa el sitio es `src/assets/perfil.jpeg` (idéntica). |
| `assets/screenshots/` | Capturas antiguas de recorrido, mercium, sysdash y vellum. |

Todo llegó aquí como un **renombrado registrado en git** (mismo contenido, seguido en el historial), así que se puede rastrear con, por ejemplo:

```bash
git log --follow legacy/recorrido/index.html
```
