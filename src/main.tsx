import { StrictMode, cloneElement } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, useLocation, useOutlet } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home.tsx'
import Menu from './pages/Menu.tsx';
import Admin from './pages/Admin.tsx';

function AnimatedLayout() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        {element && (
          <div 
            key={location.pathname} 
            className="absolute inset-0 w-full"
          >
            {cloneElement(element)}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <AnimatedLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/menu",
        element: <Menu />
      },
      {
        path: "/admin",
        element: <Admin />
      },
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
