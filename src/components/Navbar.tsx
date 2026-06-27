import { useState } from 'react';
import { Link } from 'react-router';
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

    return (
        <>
            <nav
                className="fixed inset-x-0 top-0 z-[1000] grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 px-5 py-5 transition-all duration-500 sm:gap-x-4 sm:px-6 sm:py-6 md:gap-x-3 md:px-8 lg:gap-x-5 lg:px-10 lg:py-15"
            >
                <div className="ml-0 flex min-w-0 items-center justify-start sm:ml-5">
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
                                    className="h-5 w-auto object-contain transition-all duration-500 sm:h-8 lg:h-9 xl:h-10"
                                    alt="Artisanal"
                                />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="h-5 sm:h-8 lg:h-9 xl:h-10" aria-hidden="true" />
                    )}
                </div>

                <div
                    className={`hidden min-w-0 items-center justify-center gap-2 transition-opacity duration-300 md:flex lg:gap-3 xl:gap-5 ${
                        isSiteMapOpen ? "pointer-events-none opacity-0" : "opacity-100"
                    }`}
                >
                    {navLinks.map((link, index) => (
                        <div key={link.name} className="flex min-w-0 items-center gap-2 lg:gap-3 xl:gap-5">
                            <motion.div
                                whileHover={!isMobile ? { scale: 1.08 } : undefined}
                                whileTap={{ scale: 0.94 }}
                                transition={{ type: "spring", stiffness: 150, damping: 30 }}
                            >
                                <Link
                                    to={link.url}
                                    onClick={closeSiteMap}
                                    className="inline-block whitespace-nowrap font-display text-lg leading-none text-[var(--color-theme-secondary,#ffe6ac)] transition-colors duration-500 ease-out hover:text-[var(--color-theme-primary,#dac464)] lg:text-2xl xl:text-3xl 2xl:text-4xl"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                            {index < navLinks.length - 1 && (
                                <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-theme-primary,#dac464)] transition-colors duration-500 xl:h-1.5 xl:w-1.5" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex shrink-0 flex-row items-center justify-end gap-3 sm:gap-5 lg:gap-6 xl:gap-8">
                    <motion.div
                        whileTap={isMobile ? { scale: 0.95 } : { scale: 0.98 }}
                    >
                        <a
                            href={RESERVATION_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeSiteMap}
                            className={`inline-block cursor-pointer whitespace-nowrap border border-solid border-white px-3 py-2.5 font-display text-[11px] text-white transition-all duration-300 hover:rounded-4xl hover:border-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary)] hover:text-black sm:px-4 sm:py-3 sm:text-xs lg:px-5 lg:text-sm xl:px-6 xl:py-4 xl:text-base ${
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
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={toggleSiteMap}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                        whileTap={{ scale: 0.9 }}
                    >
                        <motion.span 
                            animate={{ 
                                x: hovering ? -8 : 0,
                                color: hovering ? "var(--color-theme-primary)" : "#ffffff"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="hidden font-display text-2xl uppercase tracking-[0.15em] text-white opacity-100 2xl:block"
                        >
                            {isSiteMapOpen ? "Close" : "Information"}
                        </motion.span>
                        <svg
                            viewBox="0 0 100 100"
                            width="40" height="40"
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
