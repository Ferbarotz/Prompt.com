import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getBase, getSiteOrigin } from './scripts/site-url.mjs'

// GitHub Pages sirve el proyecto en /<nombre-del-repo>/. En CI la variable
// GITHUB_REPOSITORY viene definida ("usuario/repo"), así que el sitio sigue
// funcionando si el repositorio se bifurca. En local se usa el remoto de git.
// Con dominio propio (CUSTOM_DOMAIN) el sitio va en la raíz del dominio.
const base = getBase()

/**
 * Sustituye el marcador `__SITE_URL__` de index.html por el origen real del
 * sitio. Las etiquetas Open Graph y canonical necesitan URLs absolutas, y la
 * del dominio depende de quién publique el repositorio.
 */
const seoTags = () => ({
  name: 'promptcom-seo-tags',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      return html.replaceAll('__SITE_URL__', getSiteOrigin())
    }
  }
})

export default defineConfig({
  plugins: [react(), seoTags()],
  base,
  build: {
    rollupOptions: {
      output: {
        /*
         * Sin esto, Rollup llama al chunk compartido como el primer módulo que
         * contiene (usePersistentState), aunque lo que lleva dentro es React y
         * React Router. El nombre no dice nada y confunde al leer el build.
         */
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return 'vendor'
          }
          return undefined
        }
      }
    }
  },
  test: {
    // Entorno de navegador: los componentes se renderizan de verdad.
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx,ts,tsx}', 'scripts/**/*.test.mjs'],
    // Permite desplegar aunque todavía no haya tests escritos.
    passWithNoTests: true,
    // Los runners de CI son más lentos que el portátil: 5 s por test es
    // demasiado ajustado para las interacciones con `user-event`.
    testTimeout: 15000,
    hookTimeout: 15000,
    // Los tests de `useSeo` tocan document.head: se ejecutan en serie para
    // que las aserciones sobre las etiquetas no se pisen entre sí.
    fileParallelism: false
  },
  server: {
    port: 5173,
    host: true,
    // El devcontainer expone el puerto con un hostname dinámico.
    allowedHosts: true
  }
})
