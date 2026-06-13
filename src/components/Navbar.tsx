import { useState } from 'react';
import { Link } from 'react-router';
import '../index.css';
import txtWhite from '../assets/artisanal_logo_high_res(2)_txtwhite.jpeg';
import { motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import SiteMap from './SiteMap';

const RESERVATION_URL = "https://www.opentable.com/booking/restref/availability?rid=44458&searchdatetime=2024-04-05T19%3A00&correlationId=555d2496-d57d-436f-9b78-c125559a78c0&restRef=44458&dateTime=2024-04-05T19%3A00&partySize=2";

type NavbarProps = {
    compactMobile?: boolean;
};

export default function Navbar({ compactMobile = false }: NavbarProps) {
    const { isSiteMapOpen, isMobile, toggleSiteMap, closeSiteMap } = useUI();
    const [hovering, setHovering] = useState(false);

    return (
        <>
            <nav
                className="flex justify-between items-center w-screen fixed h-10 px-4 sm:px-5 md:px-10 py-8 sm:py-10 md:py-15 transition-all duration-500 z-[1000] top-0"
            >
                <Link to="/" onClick={closeSiteMap}>
                    <img src={txtWhite} className="transition-all duration-500 object-contain h-8 sm:h-9 md:h-10" />
                </Link>
                <div className='flex flex-row justify-between items-center gap-3 sm:gap-5 md:gap-8'>
                    <motion.div
                        whileTap={isMobile ? { scale: 0.95 } : { scale: 0.98 }}
                    >
                        <a
                            href={RESERVATION_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeSiteMap}
                            className={`inline-block border-solid text-white border-white border px-4 sm:px-5 md:px-6 py-3 md:py-4 font-display text-xs sm:text-sm md:text-base transition-all duration-300 hover:bg-[var(--color-theme-primary)] hover:border-[var(--color-theme-primary)] hover:text-black hover:rounded-4xl cursor-pointer ${
                                compactMobile ? "hidden sm:block" : ""
                            }`}
                        >
                            RESERVE A TABLE
                        </a>
                    </motion.div>

                    <motion.div 
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
                            className="text-white font-display text-2xl tracking-[0.15em] uppercase opacity-100 hidden md:block"
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
                    </motion.div>
                </div>
            </nav>

            <SiteMap open={isSiteMapOpen} />
        </>
    );
}
