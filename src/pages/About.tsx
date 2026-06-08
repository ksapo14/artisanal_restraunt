import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUI } from "../context/UIContext";
import "../index.css";

// Assets
import logoNoBg from '../assets/artisanal_logo_high_res_nobg.jpeg';
import bgImg1 from '../assets/artisanal_full_restraunt_pic.jpg';
import bgImg2 from '../assets/restraunt_2.png';
import bgImg3 from '../assets/restraunt_3.png';
import giving1 from '../assets/giving_1_nobg.png';
import giving2 from '../assets/giving_2_nobg.png';
import giving3 from '../assets/giving_3_nobg.png';

const sections = [
    {
        id: "hero",
        title: "Artisanal",
        subtitle: "Since 2014",
        theme: { bg: "#1c170a", primary: "#dac464", secondary: "#ffe6ac" }
    },
    {
        id: "philosophy",
        title: "Philosophy",
        content: "We believe in the integrity of ingredients and the precision of craft. Our kitchen is a laboratory of tradition, where age-old techniques meet modern sensibilities to create something truly timeless.",
        image: bgImg2,
        theme: { bg: "#1b1412", primary: "#a68a7b", secondary: "#f5f0ed" }
    },
    {
        id: "founders",
        title: "Founders",
        owners: [
            { 
                name: "Chef Marcus Chen", 
                role: "Executive Chef",
                bio: "With over 20 years of culinary expertise, Marcus has trained under Michelin-starred chefs across Europe and Asia. His passion for artisanal techniques drives our vision." 
            },
            { 
                name: "Sophie Durand", 
                role: "Maître d'Hôtel",
                bio: "Sophie ensures every guest experience is thoughtfully curated. A true believer in service excellence and building lasting community partnerships." 
            }
        ],
        theme: { bg: "#1a0f0f", primary: "#d48888", secondary: "#f5f0ed" }
    },
    {
        id: "community",
        title: "Community",
        content: "Artisanal is more than a restaurant; it's a member of the community. We partner with local farmers, support urban gardens, and contribute to food security initiatives across the region.",
        images: [giving1, giving2, giving3],
        theme: { bg: "#1c170a", primary: "#dac464", secondary: "#ffe6ac" }
    }
];

export default function About() {
    const { isMobile, isSiteMapOpen } = useUI();
    const [activeIndex, setActiveIndex] = useState(0);
    const isNavigating = useRef(false);
    const activeIndexRef = useRef(activeIndex);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const navigateSection = useCallback((direction: "next" | "prev" | number) => {
        if (isNavigating.current) return;

        let next: number;
        if (typeof direction === "number") {
            next = direction;
        } else {
            const prev = activeIndexRef.current;
            next = direction === "next" ? prev + 1 : prev - 1;
        }

        if (next < 0 || next >= sections.length) return;

        isNavigating.current = true;
        setActiveIndex(next);
        setTimeout(() => { isNavigating.current = false; }, 1000);
    }, []);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (isSiteMapOpen) return;
            e.preventDefault();
            if (Math.abs(e.deltaY) < 30) return;
            if (e.deltaY > 0) navigateSection("next");
            else navigateSection("prev");
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isSiteMapOpen) return;
            if (e.key === "ArrowDown" || e.key === "PageDown") {
                e.preventDefault();
                navigateSection("next");
            } else if (e.key === "ArrowUp" || e.key === "PageUp") {
                e.preventDefault();
                navigateSection("prev");
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [navigateSection, isSiteMapOpen]);

    const currentSection = sections[activeIndex];
    const themeStyles = {
        '--color-theme-primary': currentSection.theme.primary,
        '--color-theme-secondary': currentSection.theme.secondary,
        '--color-theme-bg': currentSection.theme.bg,
    } as React.CSSProperties;

    const contentVariants: Variants = {
        hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
        },
        exit: { 
            opacity: 0, 
            y: -30, 
            filter: "blur(10px)",
            transition: { duration: 0.4, ease: "easeIn" }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[100svh] md:h-screen w-screen overflow-hidden flex flex-col relative selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)]"
            style={themeStyles}
        >
            <div className="fixed inset-0 -z-10 bg-[var(--color-theme-bg)] transition-colors duration-1000" />
            
            <div className={`relative transition-all duration-700 ease-out ${activeIndex > 0 && !isSiteMapOpen ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}>
                <Navbar />
            </div>

            <div className="flex-1 relative overflow-hidden">
                {/* Side Navigation Indicator */}
                <div className={`hidden md:flex absolute left-12 md:left-24 top-0 bottom-0 z-30 items-center pointer-events-none transition-all duration-1000 ${activeIndex === 0 ? "opacity-0 -translate-x-6" : "opacity-100 translate-x-0"}`}>
                    <div className="relative h-[40vh] w-px bg-white/10">
                        <div 
                            className="absolute top-0 left-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                            style={{ 
                                height: `${(activeIndex / (sections.length - 1)) * 100}%`,
                                backgroundColor: "var(--color-theme-primary)" 
                            }}
                        />
                        {sections.map((section, idx) => (
                            <button
                                key={section.id}
                                onClick={() => navigateSection(idx)}
                                className={`absolute left-0 group pointer-events-auto cursor-pointer flex items-center transition-all duration-500 ${idx === activeIndex ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                                style={{ top: `${(idx / (sections.length - 1)) * 100}%` }}
                            >
                                <div className="w-2 h-2 -ml-[4px] rounded-full bg-[var(--color-theme-primary)]" />
                                <span className="ml-8 font-display text-sm tracking-[0.3em] uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {section.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Sections */}
                <div 
                    className="h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.19, 1, 0.22, 1)]"
                    style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                    {sections.map((section, idx) => (
                        <div key={section.id} className="h-full w-full flex justify-center items-center px-6 md:px-16 pt-24 pb-32 md:py-0 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {activeIndex === idx && (
                                    <motion.div
                                        variants={contentVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="max-w-5xl w-full flex flex-col items-center"
                                    >
                                        {idx === 0 ? (
                                            <div className="flex flex-col items-center gap-8">
                                                <div className="text-center">
                                                    <h1 className="font-display text-5xl md:text-7xl text-white italic tracking-wide mb-2">{section.title}</h1>
                                                    <p className="font-body text-xs md:text-sm uppercase tracking-[0.4em] text-[var(--color-theme-primary)]">{section.subtitle}</p>
                                                </div>
                                            </div>
                                        ) : idx === 1 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                                <div className="order-2 md:order-1">
                                                    <h2 className="font-display text-4xl md:text-6xl text-[var(--color-theme-primary)] mb-6 italic">{section.title}</h2>
                                                    <p className="font-body text-sm md:text-lg text-[var(--color-theme-secondary)] leading-relaxed font-light">{section.content}</p>
                                                </div>
                                                <div className="order-1 md:order-2 rounded-lg overflow-hidden border border-white/5">
                                                    <img src={section.image} alt="Philosophy" className="w-full h-auto object-cover brightness-75 scale-105" />
                                                </div>
                                            </div>
                                        ) : idx === 2 ? (
                                            <div className="w-full">
                                                <h2 className="font-display text-4xl md:text-6xl text-[var(--color-theme-primary)] mb-12 italic text-center">{section.title}</h2>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                                    {section.owners?.map((owner, i) => (
                                                        <div key={i} className="p-8 border border-[var(--color-theme-primary)]/20 rounded-lg bg-black/20 backdrop-blur-sm group hover:border-[var(--color-theme-primary)]/40 transition-colors">
                                                            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[var(--color-theme-primary)] mb-2">{owner.role}</p>
                                                            <h3 className="font-display text-2xl md:text-3xl text-white mb-4 italic">{owner.name}</h3>
                                                            <p className="font-body text-xs md:text-sm text-[var(--color-theme-secondary)]/80 leading-relaxed font-light">{owner.bio}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center max-w-3xl">
                                                <h2 className="font-display text-4xl md:text-6xl text-[var(--color-theme-primary)] mb-6 italic">{section.title}</h2>
                                                <p className="font-body text-sm md:text-lg text-[var(--color-theme-secondary)] leading-relaxed font-light mb-12">{section.content}</p>
                                                <div className="flex justify-center gap-4 md:gap-12 items-center">
                                                    {section.images?.map((img, i) => (
                                                        <motion.img 
                                                            key={i} 
                                                            src={img} 
                                                            alt="Giving" 
                                                            className="h-24 md:h-40 object-contain grayscale hover:grayscale-0 transition-all duration-500"
                                                            whileHover={{ scale: 1.1 }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {idx === sections.length - 1 && (
                                <div className="absolute bottom-8 left-0 w-full z-20">
                                    <Footer embedded />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation Controls */}
                <div className="hidden md:flex absolute right-8 top-0 bottom-0 z-50 flex-col justify-between py-32 pointer-events-none">
                    <button 
                        onClick={() => navigateSection("prev")}
                        disabled={activeIndex === 0}
                        className="group flex items-start justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                        aria-label="Previous section"
                    >
                        <svg viewBox="0 0 24 200" className="h-full w-8 md:w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 200V4M12 4L5 11M12 4L19 11" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => navigateSection("next")}
                        disabled={activeIndex === sections.length - 1}
                        className="group flex items-end justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                        aria-label="Next section"
                    >
                        <svg viewBox="0 0 24 200" className="h-full w-8 md:w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 0V196M12 196L5 189M12 196L19 189" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden fixed left-4 right-4 bottom-8 z-50 flex items-center justify-between gap-3 pointer-events-none pb-[env(safe-area-inset-bottom)]">
                    <button
                        onClick={() => navigateSection("prev")}
                        disabled={activeIndex === 0}
                        className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/70 backdrop-blur-md disabled:opacity-25"
                    >
                        ↑
                    </button>
                    <div className="pointer-events-auto min-w-0 flex-1 rounded-full border border-white/10 bg-black/45 px-4 py-3 text-center backdrop-blur-md">
                        <p className="truncate font-body text-[10px] uppercase tracking-[0.28em] text-white/55">
                            {currentSection.title}
                        </p>
                    </div>
                    <button
                        onClick={() => navigateSection("next")}
                        disabled={activeIndex === sections.length - 1}
                        className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/70 backdrop-blur-md disabled:opacity-25"
                    >
                        ↓
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
