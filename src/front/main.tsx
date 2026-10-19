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
