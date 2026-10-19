import { createBrowserRouter } from 'react-router-dom'
import Home from './page/Home/Home'
import GeneratorPage from './page/GeneratorPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/generar-prompt',
    element: <GeneratorPage />
  }
])

export default router
