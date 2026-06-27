import { StrictMode, cloneElement, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, useLocation, useOutlet, isRouteErrorResponse, useRouteError, Link, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home.tsx'
import Menu from './pages/Menu.tsx';
import Admin from './pages/Admin.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import FAQ from './pages/FAQ.tsx';
import PrivateEvents from './pages/PrivateEvents.tsx';
import { UIProvider } from './context/UIContext.tsx';
import { useUI } from './context/UIContext.tsx';
import { useSwipeNavigation } from './hooks/useSwipeNavigation.ts';

const swipeRoutes = ["/", "/menu", "/about", "/private-events", "/faq", "/contact"];

function ErrorPage() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="h-screen w-screen bg-[#1c170a] flex flex-col items-center justify-center text-[#dac464] px-6 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-8xl font-display mb-4"
      >
        {is404 ? "404" : "Oops"}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-display italic mb-12 opacity-80"
      >
        {is404 ? "This page has wandered off the menu." : "Something went wrong in the kitchen."}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link 
          to="/" 
          className="border border-[#dac464] px-8 py-3 font-display text-xl hover:bg-[#dac464] hover:text-black transition-all duration-300 rounded-lg"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}

function AnimatedLayout() {
  const location = useLocation();
  const element = useOutlet();
  const navigate = useNavigate();
  const { isSiteMapOpen, closeSiteMap } = useUI();

  const navigateSwipeRoute = useCallback((direction: "next" | "prev") => {
    const currentIndex = swipeRoutes.indexOf(location.pathname);
    if (currentIndex === -1) return;

    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= swipeRoutes.length) return;

    closeSiteMap();
    navigate(swipeRoutes[nextIndex]);
  }, [closeSiteMap, location.pathname, navigate]);

  useSwipeNavigation({
    enabled: !isSiteMapOpen && location.pathname !== "/admin",
    minDistance: 86,
    ignoreSelector: "[data-local-horizontal-swipe]",
    onSwipeLeft: () => navigateSwipeRoute("next"),
    onSwipeRight: () => navigateSwipeRoute("prev"),
  });

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        {element && (
          <motion.div 
            key={location.pathname} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 isolate w-full"
          >
            {cloneElement(element)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <AnimatedLayout />,
    errorElement: <ErrorPage />,
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
        path: "/about",
        element: <About />
      },
      {
        path: "/private-events",
        element: <PrivateEvents />
      },
      {
        path: "/faq",
        element: <FAQ />
      },
      {
        path: "/admin",
        element: <Admin />
      },
      {
        path: "/contact",
        element: <Contact />
      },
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UIProvider>
      <RouterProvider router={router} />
    </UIProvider>
  </StrictMode>,
)
