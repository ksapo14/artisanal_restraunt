import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LinkBar from "../components/LinkBar";
import Navbar from "../components/Navbar";
import "../index.css";
import Footer from "../components/Footer";
import bgImg1 from '../assets/artisanal_full_restraunt_pic.jpg';
import bgImg2 from '../assets/restraunt_2.png';
import bgImg3 from '../assets/restraunt_3.png';
import logoNoBg from '../assets/artisanal_logo_high_res_nobg.jpeg';

const themes = [
    {
        // Theme 1: Warm Champagne Gold & Soft Sand
        primary: "#dac464",
        secondary: "#ffe6ac",
        bg: "#1c170a",
        link: "#ffe6ac",
        arrow: "rgba(255, 230, 172, 0.5)"
    },
    {
        // Theme 2: Deep Espresso & Warm Cream
        primary: "#a68a7b",
        secondary: "#f5f0ed",
        bg: "#1b1412",
        link: "#d7ccc8",
        arrow: "rgba(215, 204, 200, 0.6)"
    },
    {
        // Theme 3: Muted Rose Crimson & Soft Blush
        primary: "#d48888",
        secondary: "rgba(238, 192, 192, 1)",
        bg: "#1a0f0f",
        link: "#e5baba", // slight shade of red
        arrow: "rgba(219, 162, 162, 0.6)" // slight shade of red
    }
];

export default function Home() {
    const bgImages = [bgImg1, bgImg2, bgImg3];
    const [bgIndex, setBgIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sliding, setSliding] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        const slideTimeout = setTimeout(() => {
            setSliding(true);
        }, 1500);

        const removeTimeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        // Auto-switch images every 10 seconds
        const autoSwitchInterval = setInterval(() => {
            setBgIndex((prev) => (prev === bgImages.length - 1 ? 0 : prev + 1));
        }, 10000);

        return () => {
            clearTimeout(slideTimeout);
            clearTimeout(removeTimeout);
            clearInterval(autoSwitchInterval);
        };
    }, [bgImages.length]);

    const handlePrev = () => {
        setBgIndex((prev) => (prev === 0 ? bgImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setBgIndex((prev) => (prev === bgImages.length - 1 ? 0 : prev + 1));
    };

    const currentTheme = themes[bgIndex];

    const themeStyles = {
        '--color-theme-primary': currentTheme.primary,
        '--color-theme-secondary': currentTheme.secondary,
        '--color-theme-bg': currentTheme.bg,
        '--color-theme-link': currentTheme.link,
        '--color-theme-arrow': currentTheme.arrow,
    } as React.CSSProperties;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative overflow-hidden min-h-screen" 
            style={themeStyles}
        >
            {/* Solid Theme Background layer */}
            <div className="absolute inset-0 -z-10 bg-[var(--color-theme-bg)] transition-colors duration-1000" />
            
            {loading && (
                <div
                    className={`fixed inset-0 z-[200] flex justify-center items-center bg-[#ffe6ac] transition-transform duration-500 ${sliding ? '-translate-y-full' : 'translate-y-0'
                        }`}
                >
                    <div className="relative flex items-center justify-center">
                        {/* Rectangular progress ring */}
                        <svg className="absolute" width="380" height="380" viewBox="0 0 380 380">
                            {/* Background rectangle */}
                            <rect
                                x="2" y="2" width="376" height="376"
                                fill="none"
                                stroke="#e5c97a"
                                strokeWidth="3"
                            />
                            {/* Animated fill rectangle */}
                            <rect
                                x="2" y="2" width="376" height="376"
                                fill="none"
                                stroke="#a07830"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="1504"
                                strokeDashoffset="1504"
                                style={{
                                    animation: 'fillCircle 1.4s ease-out forwards',
                                }}
                            />
                        </svg>
                        <img src={logoNoBg} className="h-80 w-80 object-contain" />
                    </div>
                </div>
            )}
            
            {/* Dynamic Stacked Background Cross-Fade */}
            {bgImages.map((src, index) => (
                <img
                    key={src}
                    src={src}
                    className={`w-screen scale-130 absolute top-0 -z-4 brightness-50 transition-all duration-1000 ${
                        index === bgIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}

            {/* Adaptive Fade overlay */}
            <div className="absolute top-0 left-0 w-full h-screen -z-4 pointer-events-none transition-all duration-1000"
                style={{
                    background: 'linear-gradient(to bottom, transparent 65%, var(--color-theme-bg) 100%)'
                }}
            />
            <Navbar />
            <div className="flex justify-center items-center h-screen w-full relative">
                <div className="flex items-center justify-between w-full px-4 md:px-8">
                    {/* Left Arrow Button */}
                    <button 
                        onClick={handlePrev}
                        aria-label="Previous Slide"
                        className="group flex items-center justify-center text-[var(--color-theme-arrow)] hover:text-[var(--color-theme-primary)] transition-all duration-300 hover:scale-115 cursor-pointer"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 80 24" 
                            strokeWidth="2" 
                            stroke="currentColor" 
                            className="w-20 h-8"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M76 12H4M4 12L11 5M4 12L11 19" />
                        </svg>
                    </button>

                    {/* Centered LinkBar */}
                    <div className="flex-1 flex justify-center">
                        <LinkBar />
                    </div>

                    {/* Right Arrow Button */}
                    <button 
                        onClick={handleNext}
                        aria-label="Next Slide"
                        className="group flex items-center justify-center text-[var(--color-theme-arrow)] hover:text-[var(--color-theme-primary)] transition-all duration-300 hover:scale-115 cursor-pointer"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 80 24" 
                            strokeWidth="2" 
                            stroke="currentColor" 
                            className="w-20 h-8"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12H76M76 12L69 5M76 12L69 19" />
                        </svg>
                    </button>
                </div>
            </div>
            <Footer />
        </motion.div>
    );
}