import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useUI } from '../context/UIContext';

export default function LinkBar() {
    const { isMobile } = useUI();
    const links = [
        { name: "Home", url: "/" },
        { name: "Menu", url: "/menu" },
        { name: "About", url: "/about" },
        { name: "Contact", url: "/contact" },
    ];

    return (
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-4 sm:gap-5 lg:gap-8 py-6 lg:py-10 px-4">
            {links.map((link, index) => (
                <div key={link.name} className="flex items-center gap-4 sm:gap-5 lg:gap-8">
                    <motion.div
                        whileHover={!isMobile ? { scale: 1.08 } : undefined}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 150, damping: 30 }}
                    >
                        <Link 
                            to={link.url} 
                            className="inline-block text-4xl sm:text-5xl lg:text-7xl font-display text-[var(--color-theme-secondary)] transition-colors duration-500 ease-out hover:text-[var(--color-theme-primary)] whitespace-nowrap leading-none"
                        >
                            {link.name}
                        </Link>
                    </motion.div>
                    {index < links.length - 1 && (
                        <span className="hidden sm:block w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[var(--color-theme-primary)] rounded-full transition-colors duration-500 shrink-0"></span>
                    )}
                </div>
            ))}
        </div>
    );
}
