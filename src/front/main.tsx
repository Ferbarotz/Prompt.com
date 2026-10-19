import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import Analytics from './Componente/Analytics'
import './styles/global.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('No se encontró el elemento #root en index.html')
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <>
      <RouterProvider router={router} />
      <Analytics />
    </>
  </React.StrictMode>
)

// Marca que el código de la aplicación se ha ejecutado. El aviso de carga
// fallida del index.html solo se muestra si esta marca no existe: mientras la
// app está viva puede haber un instante sin contenido (por ejemplo, mientras
// se descarga el módulo de una ruta), y eso no es un fallo.
document.documentElement.dataset.appMounted = 'true'
