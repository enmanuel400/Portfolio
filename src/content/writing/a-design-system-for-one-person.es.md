---
slug: a-design-system-for-one-person
lang: es
title: Un design system para una persona
description: "Cómo un puñado de tokens —color, tipo, espacio— mantiene coherente un proyecto en solitario sin convertirse en burocracia. Con este mismo sitio como ejemplo."
order: 3
---

Los design systems suelen venderse a equipos. Existen porque cincuenta personas necesitan sacar un producto coherente, así que escribes las reglas y las repartes. Si eres una persona construyendo un sitio, el argumento no parece aplicarte: tú eres todo el equipo, te acuerdas de las reglas, ¿para qué escribirlas?

Porque no te acuerdas. Nadie se acuerda. Tres semanas después eliges un espaciado a ojo y un gris que no has usado en ningún otro sitio. La deriva es invisible día a día y evidente en una captura.

Así que mantengo un design system, pero uno pequeño. No una librería de componentes, no una web de documentación. Un archivo de tokens y un puñado de reglas. Este sitio es el ejemplo.

## Los tokens son toda la idea

Un token es solo un valor con nombre: `--space-4`, `--text-sm`, `--accent`. Lo importante no es el nombre, es que el valor tiene un único sitio. Cuando cambio de idea sobre el color de acento, lo cambio una vez.

El mío cubre cuatro familias:

- **Color.** Un fondo, un primer plano, un primer plano atenuado, dos niveles de superficie, un color de línea y el acento. El oscuro es por defecto; el claro es una variante de los mismos nombres. Así el tema sale gratis: el conmutador cambia valores, no layouts.
- **Tipo.** Dos familias y una escala. La tipografía de titulares es una fuente; el cuerpo, otra; el código, monoespaciada y solo para código. Un juego pequeño de tamaños, de `--text-sm` a `--display-l`, cubre todos los encabezados del sitio.
- **Espacio.** Una escala basada en una unidad, así los huecos son `--space-2` o `--space-6` y nunca `17px`.
- **Radio.** Los controles llevan un valor, las superficies otro, las etiquetas van en píldora. Tres decisiones, aplicadas en todas partes.

Eso es todo. Si no puedo justificar un token porque lo necesito en más de un sitio, no lo creo.

## Una regla vale por diez

Los tokens hacen el trabajo de coherencia. Encima de ellos mantengo muy pocas reglas, casi todas sobre contención.

La que más me importa aquí: el color de acento es solo para tipos grandes y gráficos, no para texto de cuerpo sobre fondo claro. Verde lima sobre blanco es ilegible, y fingir lo contrario es como un acento decidido se convierte en un error. Por eso hay un segundo token —el mismo tono, más oscuro— para todo lo textual: enlaces, viñetas, énfasis pequeño. El acento se queda fuerte donde puede permitírselo, y la versión oscura hace los trabajos discretos. Es una regla, y evita la mayoría de los resultados feos.

Más allá de eso: el espaciado sale de la escala, el contraste se comprueba en vez de mirarse a ojo, y el movimiento se mantiene sutil salvo que haya una razón para lo contrario.

## Lo que cuesta, y cuándo parar

El coste es un archivo pequeño y la disciplina de usarlo. No construí una librería de componentes y, para un proyecto en solitario, probablemente no debería. Un `Button.astro` con seis variantes es un sistema hecho para un equipo de desconocidos; aquí yo sería el único consumidor, y pasaría más tiempo manteniendo su API que usándolo.

La prueba para cualquier añadido es si elimina una decisión que, si no, tomaría mal y una y otra vez. Los tokens pasan. Un proveedor de tema pasa, por poco. Un motor de temas completo con tokens-de-tokens, no.

La recompensa es aburrida y real: todo encaja sin que yo lo busque, el conmutador claro/oscuro fue casi gratis, y añadir una página nueva es componer valores que ya existen en vez de inventar otros. Cuando el sitio crece, crece con la misma forma.

## El punto

No necesito un design system para coordinar un equipo. Lo necesito para ser coherente con la única persona a la que no puedo ver: yo mismo, el mes que viene. Una página de tokens es una nota para esa persona. Es la forma más barata que he encontrado de que un proyecto en solitario parezca hecho a propósito.
