---
slug: local-servers-are-a-feature
lang: es
title: Los servidores locales son una función
description: "Meter un servidor dentro de una app de escritorio no es sobre-ingeniería. Es como miso esquiva el CORS, se salta los anuncios y mantiene tus datos en tu equipo."
order: 2
---

Ver una película concreta suele significar abrir varios sitios, cerrar los que ya no van, esquivar pop-ups y jugar a "encuentra el botón de play de verdad". El contenido está disperso, cada sitio quiere la pantalla entera y la mitad mienten sobre lo que tienen. Yo quería lo contrario: buscar una vez, verlo todo, darle a play, cerrar la app.

Eso es miso, y la decisión que lo condiciona todo es que miso levanta su propio servidor. No un backend en algún sitio: un proceso Node que arranca dentro de la app, en tu máquina, y se apaga cuando la cierras. Suena a sobre-ingeniería para un buscador. He llegado a pensar que el servidor local *es* la función.

## El muro del CORS

Todo lo que en miso parece obvio choca con el mismo muro. Los resultados vienen de varias fuentes, y los vídeos y los carteles viven en los CDN de esas fuentes. Una página en un navegador no puede pedirle a otro dominio un stream sin más: las peticiones entre dominios están bloqueadas por defecto y, con vídeo, es peor, porque la lista de reproducción tiene que pedir sus propios segmentos.

La salida habitual es un intermediario remoto: un servidor proxy que tengas en algún sitio y que haga las peticiones por la página. Funciona, pero ahora hay infraestructura, un lugar donde se registran tus peticiones y una dependencia que puede caerse. Para una app pequeña, son demasiadas piezas compradas con el ordenador de otro.

miso toma la otra salida. Arranca su propio servidor Node al abrirse y sirve desde ahí las peticiones entre dominios, así que para la página todo viene del mismo origen. El proxy son unas pocas rutas, la app se empaqueta pequeña y no hay nada que alojar.

## Un servidor local te da cosas que se notan

Cuando el servidor ya está ahí, deja de ser un simple parche para el CORS y pasa a ser un sitio donde hacer trabajo real:

- **Esquivar el CORS**, para que el vídeo se reproduzca dentro de la app en vez de echarte a una pestaña del navegador.
- **Saltarse los anuncios**, porque miso nunca renderiza las páginas de origen: extrae el stream y reproduce eso. Sin pop-ups, ni intersticiales, ni laberinto de redirecciones.
- **Mantener los datos en tu equipo.** No hay cuenta ni backend remoto. La app levanta su servidor al abrir y lo apaga al cerrar. Tus datos no tienen adónde ir porque no hay adónde enviarlos.
- **Extracción en cascada.** Para cada fuente prueba en orden: leer el HTML, luego el reproductor incrustado y, si hace falta, un Chromium sin interfaz; se queda con el primer método que da un vídeo válido. Esa es la parte cara, y pertenece al lado de un motor de navegador, no a una página.

El mismo diseño se nota al leer los resultados: una película encontrada en más de una fuente no se repite. Se convierte en una tarjeta con una insignia **`+N`** que abre las alternativas. Cuatro fuentes, una cuadrícula.

## Lo que cuesta

Un servidor dentro de una app de escritorio no es gratis, y fingir lo contrario sería deshonesto:

- **Ciclo de vida.** Tiene que nacer con la app y morir con ella. Un proceso suelto escuchando en un puerto es un fallo que volverás a encontrar más adelante.
- **Puertos y empaquetado.** Hay que elegir un puerto y cubrir el caso de que esté ocupado, y hay que empaquetar un runtime, no solo archivos estáticos. Es más de lo que necesita una web.
- **Una superficie que mantener pequeña.** Un servidor local sigue siendo un servidor. Escucha solo en localhost, acepta solo lo que espera y no habla con la red más de lo necesario.

Nada de eso lo descalifica. Es el precio normal de ejecutar un proceso, y prefiero pagarlo una vez que encargarle el mismo trabajo a un servicio remoto.

## Cuando no es la respuesta

No le pondría un servidor dentro a cualquier app. Si lo que construyes necesita cuentas, estado compartido o sincronización entre dispositivos, el servidor va en el centro, a propósito: es justo para lo que existen. Lo local-first es una decisión sobre quién es dueño de los datos, y solo tiene sentido si va en serio.

También implica renunciar a cosas que la nube regala: sin analítica en servidor, sin SEO renderizado en servidor, sin "entra en cualquier máquina". Para miso, las tres son funciones. La app es una herramienta para una persona en un ordenador, y se comporta como tal.

Ese es el argumento, y es más estrecho que "lo local siempre es mejor". Un servidor local es una función cuando lo que estás combatiendo es el sandbox del navegador, cuando la latencia y la privacidad son el punto y cuando la respuesta honesta a "¿dónde debería correr esto?" es "donde ya está el usuario".
