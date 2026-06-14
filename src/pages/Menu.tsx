import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MenuItemModal, { type MenuItemDetail } from "../components/MenuItemModal";
import { useMenuData } from "../hooks/useMenuData";
import { useUI } from "../context/UIContext";
import { resolveMenuImage } from "../utils/imageResolver";
import bgImg1 from "../assets/artisanal_full_restraunt_pic.jpg";

type SelectedMenuItem = {
    item: MenuItemDetail;
    sectionTitle: string;
    accentColor: string;
};

export default function Menu() {
    const { menuData } = useMenuData();
    const { isSiteMapOpen, isMobile } = useUI();
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState<SelectedMenuItem | null>(null);
    const sectionSpan = Math.max(menuData.length - 1, 1);
    const maxSectionIndex = menuData.length;
    const isNavigating = useRef(false);
    const activeIndexRef = useRef(activeIndex);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const navigateSection = useCallback(
        (direction: "next" | "prev") => {
            if (isNavigating.current || selectedItem) return;

            const prev = activeIndexRef.current;
            const next = direction === "next" ? prev + 1 : prev - 1;
            if (next < 0 || next > maxSectionIndex) return;

            isNavigating.current = true;
            window.setTimeout(() => {
                isNavigating.current = false;
            }, 1000);

            setActiveIndex(next);
        },
        [maxSectionIndex, selectedItem]
    );

    const nextSection = () => navigateSection("next");
    const prevSection = () => navigateSection("prev");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (activeIndex > maxSectionIndex) {
            setActiveIndex(maxSectionIndex);
        }
    }, [maxSectionIndex, activeIndex]);

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            if (selectedItem) return;
            e.preventDefault();

            if (Math.abs(e.deltaY) < 30) return;

            if (e.deltaY > 0) navigateSection("next");
            else navigateSection("prev");
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (selectedItem) return;

            if (e.key === "ArrowDown" || e.key === "PageDown") {
                e.preventDefault();
                navigateSection("next");
            } else if (e.key === "ArrowUp" || e.key === "PageUp") {
                e.preventDefault();
                navigateSection("prev");
            }
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [navigateSection, selectedItem]);

    const currentSection = menuData[Math.min(Math.max(activeIndex - 1, 0), menuData.length - 1)];
    const displayIndex = Math.min(Math.max(activeIndex - 1, 0), menuData.length - 1);
    const nextDisplayIndex = Math.min(displayIndex + 1, menuData.length - 1);
    const isIntroActive = activeIndex === 0;

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
        visible: (index: number) => ({
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.75,
                delay: index * 0.08,
                ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
            },
        }),
        inactive: {
            opacity: 0,
            y: -24,
            filter: "blur(6px)",
            transition: { duration: 0.35, ease: "easeOut" },
        },
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-[100svh] md:h-screen w-screen overflow-hidden flex flex-col relative" 
            style={{ '--color-theme-primary': currentSection.color } as React.CSSProperties}
        >
            {/* Seamless Fixed Background Base */}
            <div 
                className="fixed inset-0 transition-all duration-1000 ease-in-out -z-30"
                style={{ 
                    background: `linear-gradient(135deg, ${currentSection.bg} 0%, ${currentSection.bg} 60%, ${menuData[nextDisplayIndex].bg} 100%)`,
                }}
            />
            
            <div
                className={`relative transition-all duration-700 ease-out ${
                    activeIndex > 0 && !isSiteMapOpen
                        ? 'opacity-0 pointer-events-none -translate-y-10 z-0'
                        : 'opacity-100 pointer-events-auto translate-y-0 z-[1000]'
                }`}
            >
                <Navbar compactMobile />
            </div>
            
            <div className="flex-1 relative overflow-hidden">
                {/* Side nav — fixed between courses */}
                <div
                    className={`hidden lg:flex absolute left-8 md:left-24 top-0 bottom-0 z-30 items-center pointer-events-none transition-all duration-1000 ${
                        isIntroActive ? "opacity-0 -translate-x-6" : "opacity-100 translate-x-0"
                    }`}
                >
                    <div className="relative h-[60vh] w-px bg-white/5">
                        <div 
                            className="absolute top-0 left-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                            style={{ 
                                height: `${displayIndex * (100 / sectionSpan)}%`,
                                backgroundColor: currentSection.color 
                            }}
                        />
                        {menuData.map((section, idx) => (
                            <div 
                                key={section.id} 
                                className={`absolute left-0 flex items-center transition-all duration-500 ease-out ${idx === displayIndex ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-90 pointer-events-none'}`}
                                style={{ top: `${(idx / sectionSpan) * 100}%` }}
                            >
                                <div 
                                    className="w-2 h-2 -ml-[4px] rounded-full"
                                    style={{ backgroundColor: section.color }}
                                />
                                <span 
                                    className="ml-8 font-display text-lg md:text-2xl italic uppercase tracking-[0.4em] whitespace-nowrap" 
                                    style={{ color: section.color }}
                                >
                                    {section.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Sections - Organized Vertically on the Right */}
                <div 
                    className="h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.19, 1, 0.22, 1)]"
                    style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                    <div className="h-[100svh] lg:h-full w-full flex justify-center items-center px-5 sm:px-6 lg:px-16 pt-24 pb-32 lg:py-0 relative overflow-y-auto lg:overflow-hidden">
                        {/* Hero Background Image - Now slides with the section */}
                        <motion.img
                            src={bgImg1}
                            alt=""
                            aria-hidden="true"
                            animate={{
                                scale: isIntroActive ? 1.05 : 1.15,
                            }}
                            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                            className="absolute inset-0 h-full w-full object-cover brightness-50 -z-20 pointer-events-none opacity-60"
                        />
                        {/* Hero Gradient Overlay - Now slides with the section */}
                        <div 
                            className="absolute inset-0 -z-10"
                            style={{ 
                                background: `linear-gradient(to bottom, transparent 40%, ${menuData[0].bg} 95%)`
                            }}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
                            className="max-w-3xl text-center flex flex-col items-center justify-center gap-6"
                        >
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
                                className="font-body text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.32em] sm:tracking-[0.45em] text-[var(--color-theme-primary)]"
                            >
                                Artisanal Dining
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.85, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
                                className="font-display text-5xl sm:text-6xl lg:text-7xl text-white/95 italic tracking-wide leading-none"
                            >
                                Prix Fixe Menu
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.85, delay: 0.35, ease: [0.19, 1, 0.22, 1] }}
                                className="font-body text-xs sm:text-sm lg:text-base text-white/55 leading-relaxed font-light tracking-[0.1em] lg:tracking-[0.12em] uppercase italic max-w-2xl"
                            >
                                Seasonal ingredients, deliberate technique, and composed courses designed for a measured evening at the table.
                            </motion.p>
                        </motion.div>
                    </div>

                    {menuData.map((section, sIdx) => (
                        <div key={section.id} className="h-[100svh] lg:h-full w-full relative">
                            <div className="h-full w-full overflow-y-auto lg:overflow-visible flex flex-col justify-center items-center lg:items-end px-5 sm:px-8 lg:px-32 pt-28 lg:pt-40 pb-36 lg:pb-32">
                                <div className="w-full max-w-xl lg:max-w-none lg:w-1/2 flex flex-col gap-y-6 sm:gap-y-8 lg:gap-y-14">
                                    {section.items.map((item, iIdx) => (
                                        <motion.div 
                                            key={item.id} 
                                            role="button"
                                            tabIndex={activeIndex === sIdx + 1 ? 0 : -1}
                                            onClick={() => setSelectedItem({ item, sectionTitle: section.title, accentColor: section.color })}
                                            onKeyDown={(e) => e.key === "Enter" && setSelectedItem({ item, sectionTitle: section.title, accentColor: section.color })}
                                            custom={iIdx}
                                            variants={itemVariants}
                                            initial={false}
                                            animate={activeIndex === sIdx + 1 ? "visible" : "inactive"}
                                            whileHover={activeIndex === sIdx + 1 && !isMobile ? { scale: 1.04, x: -10 } : undefined}
                                            whileTap={activeIndex === sIdx + 1 ? (isMobile ? { scale: 0.95 } : { scale: 0.99 }) : undefined}
                                            className={`flex gap-4 sm:gap-6 md:gap-14 group cursor-pointer transition-colors duration-500 ease-out relative ${
                                                activeIndex === sIdx + 1 ? 'pointer-events-auto' : 'pointer-events-none'
                                            }`}
                                        >
                                            {/* View Hint */}
                                            <div className="absolute -left-32 top-1/2 -translate-y-1/2 font-display text-[var(--color-theme-primary)] italic text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                                                Click to expand
                                            </div>

                                            <div className="w-18 h-18 sm:w-24 sm:h-24 lg:w-28 lg:h-28 shrink-0 overflow-hidden relative rounded-xs self-center bg-white/5">
                                                <motion.div
                                                    className="absolute inset-0 border border-white/5 z-10 transition-colors duration-500 group-hover:border-white/20"
                                                    animate={{ borderColor: activeIndex === sIdx + 1 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)" }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                                {activeIndex === sIdx + 1 && item.image ? (
                                                    <motion.img
                                                        src={resolveMenuImage(item.image)}
                                                        alt={item.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        initial={{ scale: 1.12, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ duration: 0.8, delay: iIdx * 0.06, ease: [0.19, 1, 0.22, 1] }}
                                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="flex flex-col justify-center border-b border-white/5 pb-6 w-full group-hover:border-white/10 transition-colors">
                                                <div className="flex justify-between items-baseline mb-3">
                                                    <h3 className="font-display text-base sm:text-lg lg:text-2xl text-white/90 group-hover:text-white transition-colors duration-300 tracking-wider leading-tight">{item.name}</h3>
                                                    <span className="font-body text-[10px] lg:text-xs tracking-widest text-white/40 ml-4 font-light italic" style={{ color: sIdx === displayIndex ? section.color : '' }}>{item.price}</span>
                                                </div>
                                                <p className="font-body text-[9px] sm:text-[10px] lg:text-xs text-white/40 leading-relaxed font-light tracking-[0.08em] lg:tracking-[0.1em] uppercase italic group-hover:text-white/60 transition-colors">{item.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            
                            {sIdx === menuData.length - 1 && (
                                <div className="absolute bottom-32 left-0 w-full z-20 pointer-events-auto lg:bottom-8">
                                    <Footer embedded />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation Controls - Spanning Full Page on the Right */}
                <div className="hidden lg:flex absolute right-4 md:right-8 top-0 bottom-0 z-50 flex-col justify-between py-32 pointer-events-none">
                    <button 
                        onClick={prevSection}
                        disabled={activeIndex === 0}
                        className="group flex items-start justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 200" 
                            strokeWidth="1.5" 
                            stroke="currentColor" 
                            className="h-full w-8 md:w-10"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 200V4M12 4L5 11M12 4L19 11" />
                        </svg>
                    </button>
                    <button 
                        onClick={nextSection}
                        disabled={activeIndex === maxSectionIndex}
                        className="group flex items-end justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 200" 
                            strokeWidth="1.5" 
                            stroke="currentColor" 
                            className="h-full w-8 md:w-10"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 0V196M12 196L5 189M12 196L19 189" />
                        </svg>
                    </button>
                </div>

                <div className="lg:hidden fixed left-4 right-4 bottom-17 z-50 flex items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)] pointer-events-none">
                    <button
                        type="button"
                        onClick={prevSection}
                        disabled={activeIndex === 0}
                        className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/70 backdrop-blur-md disabled:opacity-25"
                        aria-label="Previous menu section"
                    >
                        <span className="text-2xl leading-none">↑</span>
                    </button>
                    <div className="pointer-events-auto min-w-0 flex-1 rounded-full border border-white/10 bg-black/45 px-4 py-3 text-center backdrop-blur-md">
                        <p className="truncate font-body text-[10px] uppercase tracking-[0.28em] text-white/55">
                            {isIntroActive ? "Menu" : currentSection.title}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={nextSection}
                        disabled={activeIndex === maxSectionIndex}
                        className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/70 backdrop-blur-md disabled:opacity-25"
                        aria-label="Next menu section"
                    >
                        <span className="text-2xl leading-none">↓</span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <MenuItemModal
                        item={selectedItem.item}
                        sectionTitle={selectedItem.sectionTitle}
                        accentColor={selectedItem.accentColor}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
