# Prompt.com

Guía práctica sobre prompts, generador de prompts profesionales y analizador de
prompts con puntuación, todo en el navegador.

## Stack

- React 18 + React Router 7
- TypeScript 6 (`strict`) + Vite 8
- CSS Modules + design tokens (CSS custom properties)
- Vitest 4 + Testing Library (105 tests)
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
| `/`                 | Home con la guía de prompts y el generador          |
| `/generar-prompt`   | Generador de prompts (flujo de 3 pasos)             |
| `/analizar-prompt`  | Analizador que puntúa y mejora un prompt             |
| `/aviso-legal`      | Aviso legal                                        |
| `/privacidad`       | Política de privacidad                              |
| `/cookies`          | Política de cookies                                 |
| `*`                 | Página 404 con enlaces de retorno                   |

## Estructura

```
src/front/
├── Componente/   Navbar, Footer, PromptGenerator, Analytics (+ .module.css)
├── data/         taskTypes, guideSections, promptLinter, legalContent, seoData
├── hooks/        useSeo
├── page/         Home, GeneratorPage, LinterPage, LegalPage, NotFoundPage
├── styles/       tokens.css (design tokens) y global.css (reset y utilidades)
├── router.tsx    rutas (las secundarias se cargan bajo demanda)
└── main.tsx
```

### Estilos

- **Design tokens**: todos los colores, radios, sombras y degradados viven en
  `src/front/styles/tokens.css` como variables CSS. Cambiar la marca es editar
  ese fichero, no perseguir literales por los componentes.
- **CSS Modules**: cada componente tiene su `*.module.css`. Los estilos
  globales (reset, `.field-input`, `.btn`, `.sr-only`, `.site-bg`) están en
  `src/front/styles/global.css`.
- No queda ni un `style={{…}}` en el código: los únicos valores dinámicos
  (color de acento por sección, degradado del gauge) se aplican como
  propiedades CSS personalizadas.

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
ruta canónica. Son redirecciones, así que no se publican en el sitemap.

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

- `src/front/hooks/useSeo.ts` sincroniza por ruta el título, la descripción,
  `canonical`, Open Graph, Twitter Card y `robots`.
- `src/front/data/seoData.ts` define los datos estructurados: `FAQPage` +
  `WebSite` en la home (la guía es un formato de pregunta y respuesta, que
  encaja con el tipo de schema.org) y `WebApplication` en el generador y en el
  analizador.
- `index.html` lleva las etiquetas estáticas con URL absoluta: las sustituye
  `__SITE_URL__` con el origen real, lo hace el plugin `seoTags` de
  `vite.config.js` usando `scripts/site-url.mjs`.
- `scripts/postbuild.mjs` genera `sitemap.xml` y `robots.txt` tras el build.

La URL del sitio se resuelve en este orden: `SITE_URL` → `GITHUB_REPOSITORY` →
remoto `origin` de git → origen de desarrollo.

## Rendimiento

- Las imágenes de la guía se sirven en **WebP** con `srcset` (1x y 2x),
  `width`/`height` para evitar CLS y `loading="lazy"`.
- El fondo de la aplicación se compone con **gradientes CSS**: sin peticiones
  a servidores de terceros (ni problemas de consentimiento) y sin el coste de
  repintado de `background-attachment: fixed` en móvil.
- Inter se sirve **autoalojada** en `public/fonts/` con `font-display: swap` y
  un respaldo con métricas ajustadas para no desplazar el contenido.
- Las rutas secundarias y el generador se cargan con `lazy`: no forman parte
  del bundle inicial.

### Regenerar los assets

`npm run assets` convierte las PNG que aparezcan en
`src/front/assets/home/` a WebP (y borra el PNG original), y regenera los
iconos PWA y la imagen Open Graph. Los ficheros resultantes se versionan en
git: el script solo hace falta al añadir imágenes nuevas.

## Configuración opcional

Copia `.env.example` a `.env.local` para activar las integraciones opcionales:

| Variable                    | Para qué sirve                                          |
| --------------------------- | ------------------------------------------------------- |
| `VITE_NEWSLETTER_ENDPOINT`  | Endpoint del formulario del boletín                     |
| `VITE_ANALYTICS_URL`        | Script de analítica sin cookies (Plausible o compatible) |
| `VITE_ANALYTICS_DOMAIN`     | Dominio que se reporta a la analítica                   |

Sin estas variables el sitio funciona igual: no se carga ningún script de
terceros y el boletín avisa de que no está disponible.

## ⚠️ Antes de publicar

- Completa los datos del titular en `src/front/data/legalContent.ts`
  (`siteOwner`): nombre legal, dirección fiscal y correo de contacto. Las
  páginas legales son una base de trabajo y deben ser validadas por un
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
