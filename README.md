# Prompt.com

Guía práctica sobre prompts, generador de prompts profesionales y analizador de
prompts con puntuación, todo en el navegador.

## Stack

- React 18 + React Router 7
- TypeScript 6 (`strict`) + Vite 8
- CSS Modules + design tokens (CSS custom properties)
- Vitest 4 + Testing Library (233 tests)
- ESLint 9 (flat config) con `typescript-eslint` y `eslint-plugin-react-hooks`
- Sharp (solo para generar los assets estáticos)

## Puesta en marcha

```bash
npm install     # o: npm ci
npm run dev     # http://localhost:5173/Prompt.com/
```

> El dev server sirve la app bajo `/Prompt.com/` porque así se publica en GitHub
> Pages. Si clonas el repo con otro nombre, el `base` se adapta solo (usa el
> remoto de git en local y `GITHUB_REPOSITORY` en CI).

## Scripts

| Comando               | Descripción                                            |
| --------------------- | ------------------------------------------------------ |
| `npm run dev`         | Servidor de desarrollo con HMR                         |
| `npm run build`       | Build + `sitemap.xml`, `robots.txt` y 404 de fallback  |
| `npm run preview`     | Sirve el build de producción                           |
| `npm run lint`        | ESLint + comprobación de tipos                         |
| `npm run typecheck`   | Solo `tsc --noEmit`                                    |
| `npm test`            | Suite de tests (Vitest, entorno jsdom)                  |
| `npm run test:watch`  | Tests en modo watch                                    |
| `npm run assets`      | Regenera iconos, imagen Open Graph e imágenes WebP     |

## Rutas

| Ruta                | Página                                              |
| ------------------- | --------------------------------------------------- |
| `/`                 | Home con la guía de prompts (los fundamentos)          |
| `/generar-prompt`   | Generador de prompts (flujo de 3 pasos)             |
| `/analizar-prompt`  | Analizador que puntúa y mejora un prompt             |
| `/guia`             | Índice de la guía: los bloques del prompt, uno a uno |
| `/guia/<bloque>`    | Página de un bloque (rol, objetivo, contexto…)      |
| `/blog`             | Artículos sobre prompt engineering en el trabajo real |
| `/blog/<articulo>`  | Un artículo del blog                                 |
| `/blog/etiqueta/<t>` | Artículos de un tema                                |
| `/aviso-legal`      | Aviso legal                                        |
| `/privacidad`       | Política de privacidad                              |
| `/cookies`          | Política de cookies                                 |
| `*`                 | Página 404 con enlaces de retorno                   |

## Estructura

```
src/front/
├── Componente/   Navbar, Footer, PromptGenerator, Analytics, ThemeToggle,
│                 PromptAnatomy, ScrollableCode, RouteStatus
│                 (+ .module.css)
├── data/         taskTypes, guideSections, promptLinter, legalContent, seoData,
│                 criteriaGuide, guidePages, articles, generatorLink, aiTools,
│                 routes.json (catálogo de rutas), routeMeta, paths
├── hooks/        useSeo, usePersistentState
├── page/         Home, GeneratorPage, LinterPage, LegalPage, NotFoundPage,
│                 GuidePage, GuideIndexPage, ArticlePage, BlogIndexPage, TagPage
├── styles/       tokens.css (design tokens) y global.css (reset y utilidades)
├── utils/        siteUrl (URLs absolutas), storage (localStorage),
│                 clipboard (copiar con reserva), analytics (eventos)
├── router.tsx    rutas (las secundarias se cargan bajo demanda)
└── main.tsx
```

### Estilos

- **Design tokens**: todos los colores, radios, sombras y degradados viven en
  `src/front/styles/tokens.css` como variables CSS. Cambiar la marca es editar
  ese fichero, no perseguir literales por los componentes.
- **CSS Modules**: cada componente tiene su `*.module.css`. Los estilos
  globales (reset, `.field-input`, `.btn`, `.sr-only`, `.skip-link`,
  `.site-bg`) están en `src/front/styles/global.css`.
- No queda ni un `style={{…}}` en el código: los únicos valores dinámicos
  (color de acento por sección, degradado del gauge) se aplican como
  propiedades CSS personalizadas.
- **Contraste**: los dos temas cumplen WCAG AA (4.5:1 en texto, 3:1 en el
  borde de los controles). Para que siga siendo cierto:
  - el color de acento de cada sección de la guía tiene dos tonos
    (`accent` y `accentText`): el vivo para bordes y sombras, y el oscuro
    para el título, porque en el tema claro el vivo no llega a 4.5:1;
  - la puntuación del analizador usa los tokens `--score-excellent`,
    `--score-good`, `--score-fair` y `--score-poor`, no colores sueltos;
  - el borde de los controles usa `--border-control`, no `--border` (que es
    decorativo).

## Generador de prompts

El generador es específico por tipo de tarea: cada tipo define sus propios
campos de detalle y su propia plantilla de prompt, para que el resultado se
ajuste a la tarea real (un guion de vídeo no produce la estructura de una web).

El catálogo vive en `src/front/data/taskTypes.ts`. Cada entrada tiene:

| Propiedad     | Descripción                                                     |
| ------------- | --------------------------------------------------------------- |
| `id`          | Identificador del tipo de tarea                                 |
| `label`       | Nombre visible en el selector                                  |
| `hint`        | Descripción corta bajo el nombre                                |
| `exampleIdea` | Idea de ejemplo que rellena el botón "Usar un ejemplo"          |
| `fields`      | Campos de detalle del paso 2 (clave, etiqueta y opciones)        |
| `build()`     | Función pura que devuelve el prompt a partir de idea + detalles |

Tipos incluidos: web, contenido/redes sociales, código, análisis de datos,
imagen, vídeo, email, SEO, resumen y traducción.

Para añadir un tipo nuevo basta con añadir un objeto al array: el selector, los
campos del paso 2 y la generación se adaptan solos.

### Herramientas de IA recomendadas

El generador **no llama a ningún modelo**: solo escribe un prompt con una
plantilla. Para cerrar el ciclo, el paso 3 muestra un bloque **"Dónde pegar
este prompt"** con las herramientas de IA que mejor encajan con el tipo de
tarea elegido, enlaces directos y una nota de por qué cada una sirve.

El catálogo vive en `src/front/data/aiTools.ts`:

| Propiedad    | Descripción                                                     |
| ------------ | --------------------------------------------------------------- |
| `name`       | Nombre visible de la herramienta                                |
| `url`        | Enlace oficial                                                  |
| `note`       | Motivo en una línea: por qué encaja con la tarea                |
| `recommended`| Marca la primera de la lista, que es la opción destacada        |

`getAiTools(taskId)` devuelve la lista del tipo de tarea y cae en una lista
generalista (ChatGPT, Claude, Gemini) si el tipo no tiene una propia.

### Alias de rutas

Las URLs escritas a mano o en inglés (`/generator-prompt`, `/linter`…) no
acaban en la 404: `ALIAS_ROUTES` en `src/front/router.tsx` las redirige a su
ruta canónica. La lista está en `src/front/data/routes.json` (junto con las
rutas canónicas) y la usan tanto el router como el post-build, que crea la
carpeta de cada alias para que GitHub Pages las sirva con un 200. Son
redirecciones, así que no se publican en el sitemap.

## Analizador de prompts

`src/front/data/promptLinter.ts` puntúa un prompt de 0 a 100 sobre la misma
rúbrica que usa la guía: rol, objetivo, contexto, datos, restricciones,
formato, ejemplos y criterio de validación. Cada criterio aporta 10 puntos, y
se suman 10 más por usar bloques estructurados y 10 más por una longitud
equilibrada.

La función `improvePrompt()` devuelve una versión del prompt con los bloques
que faltan, listos para rellenar. Todo el análisis es local: el texto del
usuario nunca sale del navegador.

## SEO

- `src/front/data/routes.json` es el catálogo de rutas: URL, título,
  descripción y datos de sitemap. Es la fuente única que comparten la
  aplicación (`src/front/data/routeMeta.ts`) y el post-build.
- `src/front/hooks/useSeo.ts` sincroniza por ruta el título, la descripción,
  `canonical`, Open Graph, Twitter Card y `robots` en el navegador.
- `src/front/data/seoData.ts` define los datos estructurados: `WebSite` +
  `Article` en la home (la guía es un artículo), `Article` + `BreadcrumbList`
  en la guía y en el blog, y `WebApplication` en el generador y en el
  analizador. El `Article` **incluye `image`**: sin ella, Google no concede
  el resultado enriquecido.
- `index.html` lleva las etiquetas estáticas con URL absoluta: las sustituye
  `__SITE_URL__` con el origen real, lo hace el plugin `seoTags` de
  `vite.config.js` usando `scripts/site-url.mjs`.
- `scripts/postbuild.mjs` genera `sitemap.xml`, `robots.txt` y `llms.txt` tras
  el build, y **un HTML por ruta** con sus propias etiquetas SEO
  (`scripts/seo-head.mjs`). Es lo que ven los previews de Slack, WhatsApp o X y
  los buscadores que no ejecutan JavaScript: sin eso, todas las rutas se
  presentarían como la home y su `canonical` apuntaría a la home (y se
  descartarían como duplicadas).
- El HTML estático **también lleva los datos estructurados**
  (`scripts/json-ld.mjs`): sin ellos, un buscador que no ejecuta JavaScript no
  ve ningún `Article`. Cuando la aplicación arranca, quita ese bloque y pone
  el suyo (más completo, con las migas de pan): nunca hay dos a la vez.
- Los artículos se anuncian como `og:type=article` (con su fecha de
  publicación) en vez de `website`.
- El bloque SEO del HTML va entre los marcadores `<!-- SEO:START -->` y
  `<!-- SEO:END -->`: si desaparecen, el build falla en lugar de publicar
  etiquetas equivocadas.
- **Títulos y descripciones**: el título de cada ruta, con el sufijo
  " — Prompt.com", no pasa de 60 caracteres (Google corta el *title tag*), y
  las descripciones no pasan de 160 ni se cortan a media frase. Hay tests que
  lo comprueban y que comparan el catálogo con el contenido: si uno de los dos
  cambia, el otro tiene que cambiar también.

La URL del sitio se resuelve en este orden: `SITE_URL` → `GITHUB_REPOSITORY` →
remoto `origin` de git → origen de desarrollo.

## Estado compartido y persistencia

- El generador y el analizador guardan el trabajo del visitante en
  `localStorage` (`src/front/hooks/usePersistentState.ts`): si recarga o
  vuelve atrás, no pierde lo que había escrito. Solo se guarda en su propio
  navegador: no hay cookies ni datos personales.
- Todo lo que se guarda (el prompt, el texto analizado y también el tema)
  lleva su fecha y **caduca a los 30 días**: es lo que dice la política de
  privacidad, y se cumple. El formato es el mismo para todos
  (`src/front/utils/storage.ts`): `{"v":1,"savedAt":…,"value":…}`.
- El pie de página tiene un enlace para **borrarlo**. Al pulsarlo:
  - se vacían las claves `prompt-com:*` del `localStorage`;
  - los componentes que tenían el valor en memoria lo saben y **no lo vuelven
    a escribir** (si lo escribieran, el prompt reaparecería al navegar a otra
    página). Para eso está la lista de suscriptores de `storage.ts`;
  - el estado en pantalla se reinicia y el tema vuelve al oscuro.
- El prompt del generador viaja en la URL (`src/front/data/generatorLink.ts`):
  `?t=` tipo de tarea, `?i=` idea, `?d=` detalles, `?x=` extra. En la página
  del generador la URL se actualiza sola, así que se puede compartir el
  prompt copiando la barra de direcciones; el botón **Copiar enlace** hace lo
  mismo con un clic. Un enlace compartido manda sobre lo guardado en el
  navegador y abre el resultado directamente en el paso 3.
- El enlace se recorta si es demasiado largo (1200 caracteres): primero se
  caen los detalles y, si sigue largo, la idea.
- **El prompt viaja en la URL**: eso significa que, al recargar o abrir un
  enlace compartido, el texto llega al servidor que sirve la página (queda en
  sus registros). La política de privacidad lo dice con todas sus letras.

## Contenido: guía por bloques y blog

- La guía de la home resume los fundamentos, pero cada bloque del prompt tiene
  su propia página (`src/front/data/guidePages.ts` y `criteriaGuide.ts`): las
  tres secciones de la guía y los ocho bloques de la rúbrica (rol, objetivo,
  contexto, datos, restricciones, formato, ejemplos y validación). Cada página
  explica qué hace el bloque, cómo se escribe, qué falla cuando falta y
  enlaza con el generador y el analizador.
- Las páginas de bloque llevan el **diagrama de la anatomía del prompt**
  (`PromptAnatomy`): los ocho bloques con el de la página resaltado, para
  saber de dónde sale cada pieza. Es HTML y CSS (no una imagen), así que
  sigue al tema y no pesa nada.
- La home **no repite el texto** de esas páginas: muestra el resumen de cada
  sección y enlaza a su página. Una URL, un contenido.
- El blog (`src/front/data/articles.ts`) cubre lo que no cabe en la guía:
  casos concretos, flujos de trabajo y errores reales. Cada artículo es una
  página con su URL, sus datos estructurados y su entrada en el sitemap.
- Cada artículo tiene su **etiqueta** y hay una página por etiqueta
  (`/blog/etiqueta/<etiqueta>/`). Mientras una etiqueta solo tenga un
  artículo, su página se marca como `noindex` y no entra en el sitemap: no
  tiene contenido para merecer un puesto. En cuanto haya dos, se publica
  sola (lo decide el catálogo de rutas y hay un test que lo comprueba).
- **La guía y el blog se apuntan el uno al otro**: cada artículo declara los
  bloques de los que habla (`blocks`) y cada bloque declara el artículo que lo
  explica (`post`). Así el reparto de autoridad no se queda en dos silos.
- El contenido viaja en los chunks perezosos de sus rutas: el catálogo de
  rutas (`routes.json`) solo lleva las URLs y los metadatos, así que el bundle
  inicial no crece con el texto.

## Imágenes Open Graph

Cada ruta con contenido tiene su propia tarjeta de 1200×630, con el título de
la página: si no, todos los enlaces se ven iguales en Slack, WhatsApp o X.

- `scripts/og-images.mjs` las dibuja con SVG y las convierte a PNG con sharp.
- Se dibujan con la **Inter del proyecto** (`scripts/fonts/`, licencia SIL
  OFL): librsvg no lee el `.woff2` de la web, así que el build apunta
  fontconfig a una copia en TTF. Sin ella, se usa la fuente del sistema.
- Van con paleta PNG: pesan la mitad (unos 60 kB en vez de 140 kB).

## Tema claro

La marca es oscura, pero leer la guía entera en fondo oscuro cansa. El botón
☀/☾ de la barra de navegación alterna al tema claro:

- Los dos temas se definen **solo con tokens** (`src/front/styles/tokens.css`):
  el tema claro redefine las variables del oscuro, así que los componentes no
  cambian.
- La elección se guarda en `localStorage` (con su fecha, como el resto de lo
  guardado) y se aplica **antes de pintar** (script en `index.html`), así que
  al recargar no hay destello.
- `prefers-reduced-motion` se respeta en toda la aplicación: quien pide menos
  movimiento no lo tiene.
- El tema claro se ha **revisado con un navegador real** (capturas en los dos
  temas): así se detectaron las tarjetas de la home que se quedaban oscuras.
- **El contraste está medido**: los dos temas cumplen WCAG AA. Antes de
  cambiar un color de acento o un degradado, comprueba el contraste del
  color nuevo sobre el fondo del tema (hay un test que lo hace para los
  títulos de la guía).

## Accesibilidad

- **Enlace para saltar al contenido** (`Saltar al contenido`): la navegación
  se repite en todas las páginas, así que quien navega con teclado necesita
  poder saltarla. Aparece al recibir el foco.
- **Un nombre accesible por enlace**: los enlaces repetidos ("Leer el bloque
  completo →", "Ver la guía del bloque →") dicen a dónde llevan, y las
  tarjetas de la guía y del blog usan `aria-labelledby` para que el lector de
  pantalla anuncie el título y no la tarjeta entera.
- **Los bloques de código con scroll son enfocables** (`ScrollableCode`): si
  no, el prompt largo es inalcanzable con el teclado.
- **Los campos obligatorios se explican**: el botón no se deshabilita, al
  pulsarlo avisa de qué falta (`role="alert"` y `aria-invalid`).
- La barra de navegación y el pie están también en la 404 y en la pantalla de
  error de carga.
- Durante una navegación a una ruta que se carga bajo demanda, la barra
  superior muestra el progreso.

## Rendimiento

- Las imágenes de la guía se sirven en **WebP** con `srcset` (1x y 2x),
  `width`/`height` para evitar CLS y `loading="lazy"`.
- El fondo de la aplicación se compone con **gradientes CSS**: sin peticiones
  a servidores de terceros (ni problemas de consentimiento) y sin el coste de
  repintado de `background-attachment: fixed` en móvil.
- Inter se sirve **autoalojada** en `public/fonts/` con `font-display: swap` y
  un respaldo con métricas ajustadas para no desplazar el contenido.
- Las rutas secundarias y el generador se cargan con `lazy`: no forman parte
  del bundle inicial. También el contenido de la guía, el blog y el texto de
  las páginas legales: el bundle inicial solo lleva el catálogo de rutas.
- El chunk compartido con React y React Router se llama `vendor`
  (`manualChunks` en `vite.config.js`), no como el primer módulo que
  contiene.
- La **home** pesa ~94 kB gzip, de los cuales ~90 kB son React y React Router.
  El código de la aplicación en sí ocupa ~4 kB: no hay nada más que quitar
  sin cambiar de framework.

### Regenerar los assets

`npm run assets` convierte las PNG que aparezcan en
`src/front/assets/home/` a WebP (y borra el PNG original), y regenera los
iconos PWA y la imagen Open Graph. Los ficheros resultantes se versionan en
git: el script solo hace falta al añadir imágenes nuevas.

## Configuración opcional

Copia `.env.example` a `.env.local` para activar las integraciones opcionales:

| Variable                    | Para qué sirve                                          |
| --------------------------- | ------------------------------------------------------- |
| `VITE_ANALYTICS_URL`        | Script de analítica sin cookies (Plausible o compatible) |
| `VITE_ANALYTICS_DOMAIN`     | Dominio que se reporta a la analítica                   |
| `VITE_SITE_OWNER_NAME`      | Nombre del sitio en los textos legales                  |
| `VITE_SITE_OWNER_LEGAL_NAME`| Nombre legal o razón social del titular                |
| `VITE_SITE_OWNER_TAX_ID`    | NIF, NIE o CIF del titular                              |
| `VITE_SITE_OWNER_ADDRESS`   | Dirección fiscal del titular                            |
| `VITE_SITE_OWNER_EMAIL`     | Correo de contacto                                      |

Sin estas variables el sitio funciona igual: no se carga ningún script de
terceros.

En producción (GitHub Pages) las variables se definen en **Settings →
Secrets and variables → Actions → Variables**: el workflow las pasa al build y
quedan en el bundle. Con Plausible, el dominio es el del sitio y el script
`https://plausible.io/js/script.js`; con Umami o cualquier servicio que use
el mismo esquema, la URL es la de su script.

### Poner la analítica en marcha

1. Crear el sitio en Plausible (o Umami) y apuntarlo al dominio del sitio.
   Si la web no vive en la raíz de un dominio (hoy es
   `ferbarotz.github.io/Prompt.com/`), lo habitual es servir el script desde
   un proxy propio: así el visitante no hace peticiones a un tercero y las
   rutas se registran sin el prefijo.
2. Definir las dos variables en *Settings → Secrets and variables → Actions →
   Variables*.
3. Volver a desplegar: las variables se incrustan en el bundle durante el
   build, así que no basta con definirlas (en *Actions → Deploy to GitHub
   Pages → Run workflow*).
4. El build dice en su salida si la analítica ha quedado activada:
   `· analítica activada — dominio: prompt.com`.

Mientras no se active, el sitio no carga ningún script de terceros y las
páginas legales no mencionan ninguna analítica: el texto legal describe lo
que la web hace de verdad. Al activarla, la política de privacidad y la de
cookies añaden solas el apartado «Analítica sin cookies».

### Eventos que se miden

Además de las visitas, `src/front/utils/analytics.ts` permite enviar eventos
(`trackEvent`). Los que hay ahora:

| Evento | Cuándo |
| --- | --- |
| `Copiar prompt` | Se copia el prompt del generador o del analizador |
| `Copiar enlace` | Se copia el enlace del prompt |
| `Copiar prompt mejorado` | Se copia la versión mejorada del analizador |
| `Usar un ejemplo` | Se rellena el generador con un ejemplo |
| `Probar con un ejemplo` | Se carga el ejemplo del analizador |
| `Navegación` | Se pulsa un enlace de la barra de navegación |

Si no hay analítica configurada, `trackEvent` no hace nada: se puede llamar
sin miedo y no rompe nada si el visitante bloquea el script.

## ⚠️ Antes de publicar

- **Define los datos del titular** en las variables del repositorio
  (`VITE_SITE_OWNER_LEGAL_NAME`, `VITE_SITE_OWNER_TAX_ID`,
  `VITE_SITE_OWNER_ADDRESS` y `VITE_SITE_OWNER_EMAIL`). Sin ellos, el aviso
  legal y la política de privacidad se publican con un **aviso de datos
  incompletos** (y el build lo dice por pantalla). El artículo 10 de la Ley
  34/2002 y el artículo 13 del RGPD obligan a identificar al responsable: es
  lo primero que hay que resolver antes de publicar en un dominio propio.
- Las páginas legales son una base de trabajo y deben ser validadas por un
  profesional.
- Revisa la imagen Open Graph (`npm run assets`) si cambia la marca.

## Despliegue en GitHub Pages

El workflow `.github/workflows/deploy.yml` comprueba los tipos, los tests,
compila y publica en cada `push` a `main`. Requisitos:

1. En **Settings → Pages**, la fuente debe ser **GitHub Actions**.
2. El repositorio debe tener Pages habilitadas.

GitHub Pages no tiene rewrite de rutas, así que las URLs internas (por ejemplo
`/Prompt.com/generar-prompt`) se sirven con `404.html`. Tras el build, ese
fichero es una **copia de `index.html`**: la SPA arranca directamente en la URL
solicitada y el router resuelve la ruta, sin redirecciones ni recargas.

## Dónde se publica el sitio

El repositorio se puede publicar en tres sitios, y el build se adapts solo a
cada uno (no hay que tocar el código):

| Publicación        | URL resultante                       | Cómo se detecta                    |
| ------------------ | ------------------------------------ | ---------------------------------- |
| GitHub Pages       | `https://<usuario>.github.io/<repo>/` | valor por defecto                  |
| Cloudflare Pages   | `https://<proyecto>.pages.dev`       | variable `CF_PAGES`                |
| Vercel             | `https://<proyecto>.vercel.app`      | variable `VERCEL`                  |

En Cloudflare Pages y Vercel el sitio se sirve en la **raíz** del subdominio,
así que el `base` de Vite pasa a ser `/` y el sitemap, el `robots.txt` y las
etiquetas `canonical` y Open Graph apuntan al subdominio correcto.

Los ficheros de configuración ya están:

- `public/_redirects` → fallback de la SPA en Cloudflare Pages.
- `vercel.json` → build, carpeta de salida y reescritura de rutas en Vercel.

### Publicar en Cloudflare Pages (gratis, subdominio `*.pages.dev`)

1. Crea una cuenta en Cloudflare (gratis) y entra en **Workers & Pages**.
2. **Create → Pages → Conectar un repositorio** y elige `Ferbarotz/Prompt.com`.
3. Configuración de build:
   - *Framework preset*: `None`
   - *Build command*: `npm run build`
   - *Build output directory*: `dist`
   - *Root directory*: `/`
4. Variables de entorno: ninguna (el build se autodetecta).
5. **Save and Deploy**. La web queda en `https://<nombre>.pages.dev`.

Para que el subdominio sea bonito, el proyecto se puede llamar `prompt` o
`prompt-com`. Más adelante se puede añadir un dominio propio desde el panel de
Pages, sin cambios en el código.

### Publicar en Vercel (gratis, subdominio `*.vercel.app`)

1. Crea una cuenta en Vercel e importa el repositorio.
2. Vercel lee `vercel.json`: build `npm run build`, salida `dist`.
3. **Deploy**. La web queda en `https://<proyecto>.vercel.app`.

## Dominio propio (opcional)

Por defecto el sitio se publica en `https://<usuario>.github.io/<repositorio>/`.
Con la variable de entorno `CUSTOM_DOMAIN` se publica en la raíz de un dominio
propio (`https://prompt.com/`):

| Variable        | Efecto                                                               |
| --------------- | -------------------------------------------------------------------- |
| `CUSTOM_DOMAIN` | Dominio propio. Cambia el `base` de Vite a `/` y añade `dist/CNAME` |

Con el dominio propio el sitio se sirve en la **raíz** del dominio (no en
`/Prompt.com/`), y el `base` de Vite pasa a ser `/`: los assets, el sitemap, el
`robots.txt` y las etiquetas `canonical` y Open Graph apuntan al dominio.

**No actives la variable hasta que el dominio apunte a GitHub Pages.** Publicar
un `CNAME` de un dominio sin verificar hace que Pages no sirva el sitio.

### Puesta en marcha (en este orden)

1. **Compra el dominio** y configura sus DNS en el registrador:
   - `CNAME` de `www` → `ferbarotz.github.io`
   - `A` de `@` (apex) → las IP de GitHub Pages: `185.199.108.153`,
     `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
2. **Define la variable** en el repositorio: *Settings → Secrets and variables
   → Actions → Variables → New variable* → nombre `CUSTOM_DOMAIN`, valor
   `prompt.com`.
3. **Sube un cambio** (cualquier commit). El build genera el `CNAME` y el
   sitio se publica en la raíz del dominio.
4. En **Settings → Pages**, confirma el dominio personalizado y activa
   **Enforce HTTPS** (GitHub emite el certificado automáticamente).

Mientras `CUSTOM_DOMAIN` no esté definida todo sigue igual: se publica en la
URL de GitHub Pages y no se genera ningún `CNAME`.
