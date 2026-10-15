---
slug: the-states-you-skip
lang: es
title: Los estados que te saltas
description: Los estados vacío, de carga y de error son lo que separa una demo de una interfaz terminada. Recorro cómo los trato en miso y sysdash.
order: 1
---

Toda demo de un proyecto enseña los mismos tres segundos: los datos ya cargados, todo funcionando, el cursor moviéndose con seguridad. Ese es el camino feliz, y es la parte más barata de una interfaz. La parte cara es todo lo de alrededor: antes de que lleguen los datos, cuando no hay datos y cuando algo se rompe. Esos son los estados que casi todos se saltan, y son los primeros con los que se encuentra el usuario.

He estado construyendo miso y sysdash, y la mayor parte de lo que de verdad diseñé ahí no es la cuadrícula ni las gráficas. Son los estados.

## Vacío no es un solo estado

El "vacío" se trata como una sola pantalla con una ilustración y una línea de texto. En la práctica son al menos tres situaciones distintas que piden respuestas distintas.

La primera es *todavía nada*: abres la app y no has hecho nada. miso muestra un buscador y nada más. Nada de una cuadrícula falsa de carteles para rellenar el hueco. Poner contenido de ejemplo ahí sería una mentira que el usuario tiene que desaprender.

La segunda es *nada coincide*: buscaste y no hubo resultados. Eso no es lo mismo que lo anterior, y el texto tampoco puede ser el mismo. El usuario hizo algo y no recibió nada, así que la pantalla debería reconocer la búsqueda y sugerir una salida: otra ortografía, un término más amplio, otra fuente.

La tercera es *nada porque falló*. Eso no es vacío, es un error, y llamarlo "sin resultados" esconde el problema. Merece su propio estado, su propio texto y, normalmente, un reintento.

Fusionar las tres en una pantalla bonita es como una interfaz acaba pareciendo tonta. Son tres mensajes distintos.

## La carga debería decir la verdad

Un solo spinner es la respuesta vaga, y empeora cuanto más fuentes tienes. miso consulta cuatro sitios a la vez, y no responden al mismo tiempo. Uno vuelve en 200 ms, otro tarda unos segundos, un tercero puede agotar el tiempo.

Con un solo spinner, toda la cuadrícula parecería igual de rota y luego igual de fina, cuando la realidad es desigual. En vez de eso el progreso se muestra por fuente: la rápida se rellena al momento y ya se puede clicar mientras la lenta sigue trabajando. La espera deja de ser un muro y pasa a ser una cola que puedes ver.

sysdash tiene el problema contrario, y el arreglo está en el backend. La API muestrea el sistema cada segundo en un bucle de fondo, así que cuando el panel pregunta, la respuesta ya está. Las tasas de red y disco son correctas en el primer render en lugar de empezar en cero y calentarse. La carga no se esconde; simplemente termina antes de que mires.

Un spinner es una confesión de que no sabes qué está pasando. Si lo sabes —qué fuente, qué petición, cuánto falta—, muestra eso.

## Los errores son un problema de diseño

El instinto es tratar un error como una excepción: capturarlo, registrarlo, mostrar un aviso y seguir. Pero el estado de error es una pantalla que el usuario va a ver de verdad, y debería diseñarse como tal.

En miso, que una fuente falle no es que falle toda la app. La cuadrícula conserva las fuentes que respondieron y descarta en silencio la que no. Un resultado parcial casi siempre es más útil que una página de error. Lo importante es que la interfaz no finja: la fuente que falta *falta*, no está vacía.

En sysdash, cuando la API se cae, hay un sello `● LIVE` / `○ OFFLINE` que cambia, un aviso de desconexión que explica qué estás viendo y un reintento automático que sigue intentándolo en segundo plano. Nunca te quedas leyendo un número congelado preguntándote si sigue vigente. Un número viejo mostrado como en vivo es peor que ningún número.

Lo único que intento evitar en todas partes es el error genérico. "Algo falló" no dice nada que el usuario no supiera ya. Di qué falló, si sus datos están a salvo y qué hacer.

## La décima visita

Una demo está pensada para la primera visita: los datos cargados, todo funcionando, alguien mirando. Los estados que te saltas son los que aparecen en la décima visita, cuando la red va lenta y una fuente se cae. Ahí es donde una interfaz gana o pierde confianza.

No son un añadido de última hora. En miso y sysdash dieron más trabajo que el camino feliz, y son la parte que defendería primero. Una cuadrícula limpia es el comienzo del trabajo. Los estados vacío, de carga y de error son el resto.
