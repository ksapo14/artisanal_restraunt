import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/Home.tsx'
import Menu from './pages/Menu.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/menu",
    element: <Menu />
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
