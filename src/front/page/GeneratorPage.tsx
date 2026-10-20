import { lazy, Suspense } from 'react'
import Navbar from '../Componente/Navbar'
import Footer from '../Componente/Footer'
import useSeo from '../hooks/useSeo'
import { GENERATOR_JSON_LD } from '../data/seoData'
import { getRouteSeo } from '../data/routeMeta'
import styles from './GeneratorPage.module.css'
import { PATHS } from '../data/paths'

const PromptGenerator = lazy(() => import('../Componente/PromptGenerator'))

const GeneratorPage = () => {
  useSeo({
    ...getRouteSeo(PATHS.generator),
    jsonLd: GENERATOR_JSON_LD
  })

  return (
    <div className="site-bg">
      <Navbar />
      <main id="contenido" className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Generador de Prompts</h1>
          <p className={styles.subtitle}>
            Elige el tipo de tarea, describe tu idea y obtén un prompt profesional en segundos
          </p>
        </section>

        <Suspense fallback={<div className={styles.lazySpacer} aria-hidden="true" />}>
          <PromptGenerator />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default GeneratorPage
