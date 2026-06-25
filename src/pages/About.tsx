import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUI } from "../context/UIContext";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import bgImg1 from "../assets/artisanal_full_restraunt_pic.jpg";
import bgImg2 from "../assets/restraunt_2.png";
import bgImg3 from "../assets/restraunt_3.png";
import giving1 from "../assets/giving_1_nobg.png";
import giving2 from "../assets/giving_2_nobg.png";
import giving3 from "../assets/giving_3_nobg.png";

type AboutTheme = {
    bg: string;
    primary: string;
    secondary: string;
};

type Founder = {
    name: string;
    role: string;
    bio: string;
};

type AboutSection = {
    id: string;
    title: string;
    eyebrow: string;
    body: string;
    image: string;
    theme: AboutTheme;
    founders?: Founder[];
    communityImages?: string[];
};

const sections: AboutSection[] = [
    {
        id: "story",
        title: "Artisanal",
        eyebrow: "Since 2014",
        body: "A quiet dining room built around seasonal ingredients, deliberate technique, and a measured evening at the table.",
        image: bgImg1,
        theme: { bg: "#1c170a", primary: "#dac464", secondary: "#ffe6ac" },
    },
    {
        id: "philosophy",
        title: "Philosophy",
        eyebrow: "Ingredient led",
        body: "We believe in the integrity of ingredients and the precision of craft. Age-old techniques meet modern sensibilities to create something timeless.",
        image: bgImg2,
        theme: { bg: "#1b1412", primary: "#a68a7b", secondary: "#f5f0ed" },
    },
    {
        id: "founders",
        title: "Founders",
        eyebrow: "The hosts",
        body: "Chef Marcus Chen and Sophie Durand shape the food, pacing, and service with a shared focus on care and restraint.",
        image: bgImg3,
        theme: { bg: "#1a0f0f", primary: "#d48888", secondary: "#f5f0ed" },
        founders: [
            {
                name: "Chef Bill Greene",
                role: "Head Chef & Sommelier",
                bio: "Chef-owner and wine director Bill Greene brings a lifelong love of food and wine to Artisanal. He began cooking at just 14 in Linville, NC, before training at the Culinary Institute of America and working in renowned kitchens including Le Cirque, Peacock Alley, and Mary Elaine’s. Today, Bill combines thoughtful cuisine, carefully chosen wines, and genuine hospitality to create an experience that feels both refined and welcoming.",
            },
            {
                name: "Anita Greene",
                role: "Co-Owner",
                bio: "Co-owner Anita Greene brings warmth, care, and a thoughtful eye to Artisanal. Raised in Aiken County, South Carolina, she grew up working in her family’s retail business before earning a mechanical engineering degree from the University of South Carolina and building a career in manufacturing and engineering. Today, she helps shape the welcoming spirit of Artisanal while serving on the Appalachian State University Board of Trustees and enjoying time with her family — including puppies Cosmo and KoKo.",
            },
        ],
    },
    {
        id: "community",
        title: "Community",
        eyebrow: "Local roots",
        body: "Artisanal partners with local farmers, supports urban gardens, and contributes to food security initiatives across the region.",
        image: bgImg1,
        theme: { bg: "#1c170a", primary: "#dac464", secondary: "#ffe6ac" },
        communityImages: [giving1, giving2, giving3],
    },
];

const sectionCount = sections.length - 1;
const pageTheme = sections[0].theme;

export default function About() {
    const { isSiteMapOpen } = useUI();
    const [activeIndex, setActiveIndex] = useState(0);
    const [openFounders, setOpenFounders] = useState<Record<string, boolean>>({});
    const pageRef = useRef<HTMLDivElement | null>(null);
    const activeIndexRef = useRef(activeIndex);
    const isNavigating = useRef(false);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigateSection = useCallback((direction: "next" | "prev" | number) => {
        if (isNavigating.current) return;

        const next =
            typeof direction === "number"
                ? direction
                : direction === "next"
                  ? activeIndexRef.current + 1
                  : activeIndexRef.current - 1;

        if (next < 0 || next >= sections.length) return;

        isNavigating.current = true;
        setActiveIndex(next);

        window.setTimeout(() => {
            isNavigating.current = false;
        }, 900);
    }, []);

    const toggleFounder = useCallback((name: string) => {
        setOpenFounders((current) => ({
            ...current,
            [name]: !current[name],
        }));
    }, []);

    useSwipeNavigation({
        enabled: !isSiteMapOpen,
        targetRef: pageRef,
        onSwipeUp: () => navigateSection("next"),
        onSwipeDown: () => navigateSection("prev"),
    });

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (isSiteMapOpen) return;

            event.preventDefault();
            if (Math.abs(event.deltaY) < 30) return;

            navigateSection(event.deltaY > 0 ? "next" : "prev");
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isSiteMapOpen) return;

            if (event.key === "ArrowDown" || event.key === "PageDown") {
                event.preventDefault();
                navigateSection("next");
            }

            if (event.key === "ArrowUp" || event.key === "PageUp") {
                event.preventDefault();
                navigateSection("prev");
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSiteMapOpen, navigateSection]);

    const currentSection = sections[activeIndex];
    const themeStyles = {
        "--color-theme-primary": pageTheme.primary,
        "--color-theme-secondary": pageTheme.secondary,
        "--color-theme-bg": pageTheme.bg,
    } as CSSProperties;

    const contentVariants: Variants = {
        inactive: {
            opacity: 0,
            y: 28,
            filter: "blur(8px)",
            transition: { duration: 0.35, ease: "easeOut" },
        },
        active: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.75, ease: [0.19, 1, 0.22, 1] },
        },
    };

    return (
        <motion.div
            ref={pageRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-[100svh] md:h-screen w-screen overflow-hidden flex flex-col relative selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)]"
            style={themeStyles}
        >
            <div
                className="fixed inset-0 -z-30"
                style={{
                    background: `linear-gradient(135deg, ${pageTheme.bg} 0%, ${pageTheme.bg} 68%, #1a0f0f 100%)`,
                }}
            />

            {sections.map((section, index) => (
                <motion.img
                    key={section.id}
                    src={section.image}
                    alt=""
                    aria-hidden="true"
                    animate={{
                        opacity: activeIndex === index ? 0.42 : 0,
                        scale: activeIndex === index ? 1.08 : 1.14,
                    }}
                    transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                    className="fixed inset-0 h-full w-full object-cover brightness-50 -z-20 pointer-events-none"
                />
            ))}

            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 38%, var(--color-theme-bg) 100%)",
                }}
            />

            <div
                className={`relative transition-all duration-700 ease-out ${
                    activeIndex > 0 && !isSiteMapOpen
                        ? "opacity-0 pointer-events-none -translate-y-10 z-0"
                        : "opacity-100 pointer-events-auto translate-y-0 z-[1000]"
                }`}
            >
                <Navbar compactMobile />
            </div>

            <div className="flex-1 relative overflow-hidden">
                <div
                    className={`hidden lg:flex absolute left-8 md:left-36 lg:left-44 top-0 bottom-0 z-30 items-center pointer-events-none transition-all duration-1000 ${
                        activeIndex === 0 ? "opacity-0 -translate-x-6" : "opacity-100 translate-x-0"
                    }`}
                >
                    <div className="relative h-[52vh] w-px bg-white/8">
                        <div
                            className="absolute top-0 left-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                            style={{
                                height: `${(activeIndex / sectionCount) * 100}%`,
                                backgroundColor: "var(--color-theme-primary)",
                            }}
                        />
                        {sections.map((section, index) => (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => navigateSection(index)}
                                aria-label={`View ${section.title} section`}
                                aria-current={activeIndex === index ? "step" : undefined}
                                className={`absolute left-0 flex items-center group pointer-events-auto cursor-pointer transition-all duration-500 ${
                                    activeIndex === index ? "opacity-100" : "opacity-35 hover:opacity-100"
                                }`}
                                style={{ top: `${(index / sectionCount) * 100}%` }}
                            >
                                <span className="w-2 h-2 -ml-[4px] rounded-full bg-[var(--color-theme-primary)]" />
                                <span className="absolute right-6 font-display text-sm md:text-base lg:text-lg italic uppercase tracking-[0.14em] lg:tracking-[0.2em] whitespace-nowrap text-[var(--color-theme-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {section.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    className="h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                    {sections.map((section, index) => (
                        <section
                            key={section.id}
                            aria-labelledby={`${section.id}-heading`}
                            data-swipe-scroll
                            className={`h-[100svh] lg:h-full w-full flex items-center justify-center px-5 sm:px-8 pt-24 pb-36 lg:py-0 relative overflow-y-auto lg:overflow-hidden ${
                                index === 0
                                    ? "lg:px-32"
                                    : "lg:px-56 xl:px-64"
                            }`}
                        >
                            <motion.div
                                custom={index}
                                variants={contentVariants}
                                initial={false}
                                animate={activeIndex === index ? "active" : "inactive"}
                                className={`w-full max-w-5xl ${
                                    index === 0
                                        ? "text-center flex flex-col items-center"
                                        : "grid grid-cols-1 lg:grid-cols-[0.78fr_1fr] gap-9 lg:gap-16 items-center"
                                }`}
                            >
                                <div className={index === 0 ? "max-w-3xl" : "max-w-xl"}>
                                    <p className="font-body text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.45em] text-[var(--color-theme-primary)] mb-5">
                                        {section.eyebrow}
                                    </p>
                                    {index === 0 ? (
                                        <h1
                                            id={`${section.id}-heading`}
                                            className="font-display text-5xl sm:text-6xl lg:text-7xl text-white/95 italic tracking-wide leading-none mb-6"
                                        >
                                            {section.title}
                                        </h1>
                                    ) : (
                                        <h2
                                            id={`${section.id}-heading`}
                                            className="font-display text-4xl sm:text-5xl lg:text-6xl text-white/95 italic tracking-wide leading-none mb-6"
                                        >
                                            {section.title}
                                        </h2>
                                    )}
                                    <p className="font-body text-xs sm:text-sm md:text-base text-[var(--color-theme-secondary)]/70 leading-relaxed font-light tracking-[0.08em] md:tracking-[0.1em] uppercase italic">
                                        {section.body}
                                    </p>
                                </div>

                                {section.founders ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {section.founders.map((founder) => (
                                            <article
                                                key={founder.name}
                                                className="border-b border-white/10 transition-colors duration-500 hover:border-[var(--color-theme-primary)]/45"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleFounder(founder.name)}
                                                    aria-expanded={openFounders[founder.name] ? "true" : "false"}
                                                    className="group flex w-full items-center justify-between gap-5 py-5 text-left cursor-pointer"
                                                >
                                                    <span>
                                                        <span className="block font-body text-[11px] md:text-xs uppercase tracking-[0.28em] text-[var(--color-theme-primary)] mb-2">
                                                            {founder.role}
                                                        </span>
                                                        <span className="block font-display text-3xl md:text-4xl text-white/90 italic tracking-wide">
                                                            {founder.name}
                                                        </span>
                                                    </span>
                                                    <span
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-[var(--color-theme-primary)] transition-all duration-300 group-hover:border-[var(--color-theme-primary)]/55 ${
                                                            openFounders[founder.name] ? "rotate-180 bg-white/5" : ""
                                                        }`}
                                                        aria-hidden="true"
                                                    >
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                                                        </svg>
                                                    </span>
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {openFounders[founder.name] && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.28, ease: "easeOut" }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="pb-6 font-body text-sm md:text-base text-white/60 leading-relaxed font-light">
                                                                {founder.bio}
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </article>
                                        ))}
                                    </div>
                                ) : section.communityImages ? (
                                    <div className="grid w-full max-w-md grid-cols-3 items-center justify-items-center gap-4 sm:gap-6 lg:max-w-lg lg:gap-8 overflow-hidden lg:justify-self-end">
                                        {section.communityImages.map((image, imageIndex) => (
                                            <img
                                                key={image}
                                                src={image}
                                                alt=""
                                                aria-hidden="true"
                                                className={`h-20 w-full max-w-[6.5rem] object-contain opacity-80 transition-[filter,opacity] duration-500 hover:opacity-100 sm:h-24 sm:max-w-[8rem] lg:h-36 lg:max-w-[10rem] ${
                                                    imageIndex === 1 ? "" : "grayscale hover:grayscale-0"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                ) : index > 0 ? (
                                    <div className="hidden lg:block justify-self-end w-full max-w-sm overflow-hidden border border-white/8 bg-black/10">
                                        <img
                                            src={section.image}
                                            alt=""
                                            aria-hidden="true"
                                            className="aspect-[4/5] w-full object-cover brightness-75 transition-transform duration-700 hover:scale-105"
                                        />
                                    </div>
                                ) : null}
                            </motion.div>

                            {index === sections.length - 1 && (
                                <div className="absolute bottom-32 left-0 w-full z-20 pointer-events-auto lg:bottom-8">
                                    <Footer embedded />
                                </div>
                            )}
                        </section>
                    ))}
                </div>

                <div className="hidden lg:flex absolute right-4 md:right-8 top-0 bottom-0 z-50 flex-col justify-between py-32 pointer-events-none">
                    <button
                        type="button"
                        onClick={() => navigateSection("prev")}
                        disabled={activeIndex === 0}
                        className="group flex items-start justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                        aria-label="Previous about section"
                    >
                        <svg viewBox="0 0 24 200" className="h-full w-8 md:w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 200V4M12 4L5 11M12 4L19 11" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigateSection("next")}
                        disabled={activeIndex === sections.length - 1}
                        className="group flex items-end justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                        aria-label="Next about section"
                    >
                        <svg viewBox="0 0 24 200" className="h-full w-8 md:w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 0V196M12 196L5 189M12 196L19 189" />
                        </svg>
                    </button>
                </div>

                <div className="lg:hidden fixed left-4 right-4 bottom-17 z-50 flex items-center justify-between gap-3 pb-[env(safe-area-inset-bottom)] pointer-events-none">
                    <button
                        type="button"
                        onClick={() => navigateSection("prev")}
                        disabled={activeIndex === 0}
                        className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/70 backdrop-blur-md disabled:opacity-25"
                        aria-label="Previous about section"
                    >
                        <span className="text-2xl leading-none" aria-hidden="true">
                            ↑
                        </span>
                    </button>
                    <div className="pointer-events-auto min-w-0 flex-1 rounded-full border border-white/10 bg-black/45 px-4 py-3 text-center backdrop-blur-md">
                        <p className="truncate font-body text-[10px] uppercase tracking-[0.28em] text-white/55" aria-live="polite">
                            {currentSection.title}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigateSection("next")}
                        disabled={activeIndex === sections.length - 1}
                        className="pointer-events-auto h-12 w-12 flex items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/70 backdrop-blur-md disabled:opacity-25"
                        aria-label="Next about section"
                    >
                        <span className="text-2xl leading-none" aria-hidden="true">
                            ↓
                        </span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
