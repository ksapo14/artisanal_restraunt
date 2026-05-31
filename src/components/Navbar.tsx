import { useState } from 'react';
import { Link } from 'react-router';
import '../index.css';
import txtWhite from '../assets/artisanal_logo_high_res(2)_txtwhite.jpeg';
import { motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import SiteMap from './SiteMap';

export default function Navbar() {
    const { isSiteMapOpen, toggleSiteMap } = useUI();
    const [hovering, setHovering] = useState(false);

    return (
        <>
            <nav className="flex justify-between items-center w-screen fixed top-0 h-10 px-10 py-15 z-[100]">
                <Link to="/">
                    <img src={txtWhite} className="transition-all duration-500 object-contain h-10" />
                </Link>
                <div className='flex flex-row justify-between items-center gap-8'>
                    <Link to="/contact">
                        <button className="border-solid text-white border-white border px-6 py-4 font-display transition-all duration-300 hover:bg-[var(--color-theme-primary)] hover:border-[var(--color-theme-primary)] hover:text-black hover:rounded-4xl cursor-pointer">RESERVE A TABLE</button>
                    </Link>

                    <div 
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={toggleSiteMap}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
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
                    </div>
                </div>
            </nav>

            <SiteMap open={isSiteMapOpen} />
        </>
    );
}