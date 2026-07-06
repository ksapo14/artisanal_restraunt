import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import '../index.css';
import logoImg from '../assets/artisanal_logo_high_res_nobg.jpeg';
import { motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import SiteMap from './SiteMap';

const RESERVATION_URL = "https://www.opentable.com/booking/restref/availability?rid=44458&searchdatetime=2024-04-05T19%3A00&correlationId=555d2496-d57d-436f-9b78-c125559a78c0&restRef=44458&dateTime=2024-04-05T19%3A00&partySize=2";

type NavbarProps = {
    compactMobile?: boolean;
    showLogo?: boolean;
};

const navLinks = [
    { name: "Home", url: "/" },
    { name: "Menu", url: "/menu" },
    { name: "About", url: "/about" },
    { name: "Contact", url: "/contact" },
];

export default function Navbar({ compactMobile = false, showLogo = true }: NavbarProps) {
    const { isSiteMapOpen, isMobile, toggleSiteMap, closeSiteMap } = useUI();
    const [hovering, setHovering] = useState(false);
    const location = useLocation();

    return (
        <>
            <nav
                className="fixed inset-x-0 top-0 z-[1000] grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 px-4 py-4 transition-all duration-500 sm:px-6 sm:py-5 md:px-8 lg:gap-x-5 lg:px-10 lg:py-6"
            >
                <div className="flex min-w-0 items-center justify-start sm:ml-2">
                    {showLogo ? (
                        <motion.div
                            className="shrink-0"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
                            whileHover={!isMobile ? { scale: 1.06, y: -2 } : undefined}
                            whileTap={{ scale: 0.96 }}
                        >
                            <Link to="/" onClick={closeSiteMap} aria-label="Artisanal home">
                                <img
                                    src={logoImg}
                                    className="h-5 w-auto object-contain transition-all duration-500 sm:h-7 lg:h-8"
                                    alt="Artisanal"
                                />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="h-5 sm:h-7 lg:h-8" aria-hidden="true" />
                    )}
                </div>

                <div
                    className={`hidden min-w-0 items-center justify-center gap-1 rounded-xl border border-white/10 bg-black/10 px-2 py-1.5 backdrop-blur-[2px] transition-opacity duration-300 lg:flex xl:gap-2 ${
                        isSiteMapOpen ? "pointer-events-none opacity-0" : "opacity-100"
                    }`}
                >
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.url;

                        return (
                        <div key={link.name} className="min-w-0">
                            <motion.div
                                whileHover={!isMobile ? { y: -1 } : undefined}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 180, damping: 24 }}
                            >
                                <Link
                                    to={link.url}
                                    onClick={closeSiteMap}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`inline-block whitespace-nowrap border-b px-3 py-2 font-display text-xl leading-none transition-colors duration-300 ease-out xl:text-2xl ${
                                        isActive
                                            ? "border-[var(--color-theme-primary,#dac464)] text-white"
                                            : "border-transparent text-[var(--color-theme-secondary,#ffe6ac)]/80 hover:text-white"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        </div>
                        );
                    })}
                </div>

                <div className="flex shrink-0 flex-row items-center justify-end gap-2 sm:gap-3 lg:gap-4">
                    <motion.div
                        whileTap={isMobile ? { scale: 0.95 } : { scale: 0.98 }}
                    >
                        <a
                            href={RESERVATION_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeSiteMap}
                            className={`inline-block cursor-pointer whitespace-nowrap rounded-sm border border-white/60 bg-black/10 px-3 py-2.5 font-body text-[10px] font-medium tracking-[0.14em] text-white backdrop-blur-[2px] transition-colors duration-300 hover:border-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary)] hover:text-black sm:px-4 sm:text-[11px] lg:px-5 lg:py-3 ${
                                compactMobile ? "hidden sm:block" : ""
                            }`}
                        >
                            RESERVE A TABLE
                        </a>
                    </motion.div>

                    <motion.button
                        type="button"
                        aria-label={isSiteMapOpen ? "Close site map" : "Open site map"}
                        aria-expanded={isSiteMapOpen}
                        className="group flex h-10 w-10 cursor-pointer items-center justify-center"
                        onClick={toggleSiteMap}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg
                            viewBox="0 0 100 100"
                            width="34" height="34"
                        >
                            <line
                                x1="20" y1="35" x2="80" y2="35"
                                stroke={hovering ? "var(--color-theme-primary)" : "white"} 
                                strokeWidth="4" strokeLinecap="round"
                                style={{
                                    transformBox: 'fill-box',
                                    transformOrigin: 'center',
                                    transform: isSiteMapOpen
                                        ? 'translateY(15px) rotate(45deg)'
                                        : hovering ? 'translateY(-3px)' : '',
                                    transition: 'all 0.35s ease',
                                }}
                            />
                            <line
                                x1="20" y1="65" x2="80" y2="65"
                                stroke={hovering ? "var(--color-theme-primary)" : "white"} 
                                strokeWidth="4" strokeLinecap="round"
                                style={{
                                    transformBox: 'fill-box',
                                    transformOrigin: 'center',
                                    transform: isSiteMapOpen
                                        ? 'translateY(-15px) rotate(-45deg)'
                                        : hovering ? 'translateY(3px)' : '',
                                    transition: 'all 0.35s ease',
                                }}
                            />
                        </svg>
                    </motion.button>
                </div>
            </nav>

            <SiteMap open={isSiteMapOpen} />
        </>
    );
}
