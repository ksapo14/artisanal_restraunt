import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUI } from "../context/UIContext";
import "../index.css";
import logoNoBg from '../assets/artisanal_logo_high_res_nobg.jpeg';
import bgImg from '../assets/artisanal_full_restraunt_pic.jpg';
import giving1 from '../assets/giving_1_nobg.png';
import giving2 from '../assets/giving_2_nobg.png';
import giving3 from '../assets/giving_3_nobg.png';

const MAX_SECTION_INDEX = 3;

const SECTION_MAP: Record<string, number> = {
    "#hero": 0,
    "#about": 1,
    "#founders": 2,
    "#community": 3,
};

const sectionConfig = [
    { bg: "#1c170a", primary: "#dac464", secondary: "#ffe6ac" }, // Hero
    { bg: "#1c170a", primary: "#dac464", secondary: "#ffe6ac" }, // About
    { bg: "#1b1412", primary: "#a68a7b", secondary: "#f5f0ed" }, // Owners
    { bg: "#1a0f0f", primary: "#d48888", secondary: "#f5f0ed" }, // Community
];

export default function About() {
    const location = useLocation();
    const { isSiteMapOpen, isMobile } = useUI();
    const [activeIndex, setActiveIndex] = useState(0);
    const [ownerOpen, setOwnerOpen] = useState<number | null>(0); // Default first one open

    const isNavigating = useRef(false);
    const activeIndexRef = useRef(activeIndex);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    // Handle hash routing
    useEffect(() => {
        if (location.hash && SECTION_MAP[location.hash] !== undefined) {
            setActiveIndex(SECTION_MAP[location.hash]);
        }
    }, [location.hash]);

    const navigateSection = useCallback(
        (direction: "next" | "prev") => {
            if (isNavigating.current) return;

            const prev = activeIndexRef.current;
            const next = direction === "next" ? prev + 1 : prev - 1;
            if (next < 0 || next > MAX_SECTION_INDEX) return;

            isNavigating.current = true;
            window.setTimeout(() => {
                isNavigating.current = false;
            }, 1000);

            setActiveIndex(next);
        },
        []
    );

    const toggleOwner = (index: number) => {
        setOwnerOpen(ownerOpen === index ? null : index);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (Math.abs(e.deltaY) < 30) return;
            if (e.deltaY > 0) navigateSection("next");
            else navigateSection("prev");
        };

        const onKeyDown = (e: KeyboardEvent) => {
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
    }, [navigateSection]);

    const owners = [
        {
            name: "Chef Marcus Chen",
            image: logoNoBg,
            bio: "With over 20 years of culinary expertise, Marcus has trained under Michelin-starred chefs across Europe and Asia. His passion for artisanal techniques and sustainable sourcing drives Artisanal's philosophy and vision."
        },
        {
            name: "Sophie Durand",
            image: logoNoBg,
            bio: "Bringing keen eye for hospitality and deep wine expertise, Sophie ensures every guest experience is thoughtfully curated. A true believer in service excellence and building lasting community partnerships."
        }
    ];

    const currentTheme = sectionConfig[activeIndex];

    const themeStyles = {
        '--color-theme-primary': currentTheme.primary,
        '--color-theme-secondary': currentTheme.secondary,
        '--color-theme-bg': currentTheme.bg,
    } as React.CSSProperties;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-screen w-screen overflow-hidden flex flex-col relative"
            style={themeStyles}
        >
            {/* Ambient Background Elements — Minimalistic approach, no glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute border border-[var(--color-theme-primary)]/10 rounded-full"
                        style={{
                            width: `${200 + i * 100}px`,
                            height: `${200 + i * 100}px`,
                            left: `${(i * 30) % 100}%`,
                            top: `${(i * 25) % 100}%`,
                        }}
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, -50, 50, 0],
                            scale: [1, 1.2, 0.8, 1],
                        }}
                        transition={{
                            duration: 15 + i * 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            <div
                className="fixed inset-0 -z-10 transition-all duration-1000 ease-in-out"
                style={{
                    background: currentTheme.bg,
                    filter: 'brightness(1.2)'
                }}
            />

            <div
                className={`relative transition-all duration-700 ease-out ${
                    activeIndex > 0 && !isSiteMapOpen
                        ? "opacity-0 pointer-events-none -translate-y-10 z-0"
                        : "opacity-100 pointer-events-auto translate-y-0 z-[1000]"
                }`}
            >
                <Navbar />
            </div>

            <div className="flex-1 relative overflow-hidden">
                <div
                    className="h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.19, 1, 0.22, 1)]"
                    style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                    {/* Section 0: Hero */}
                    <div className="h-screen w-screen flex justify-center items-center relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="relative"
                        >
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10"
                            >
                                <img src={logoNoBg} alt="Artisanal" className="h-64 w-64 object-contain" />
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className="text-center text-[var(--color-theme-primary)] font-display text-lg mt-8 tracking-widest"
                            >
                                scroll to explore
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Section 1: About */}
                    <div className="h-screen w-screen flex justify-center items-center px-8 md:px-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="rounded-lg overflow-hidden relative group"
                            >
                                <motion.img
                                    src={bgImg}
                                    alt="Restaurant"
                                    className="w-full h-auto rounded-lg relative z-10 border border-white/5"
                                    whileHover={!isMobile ? { scale: 1.05 } : undefined}
                                    whileTap={isMobile ? { scale: 0.98 } : undefined}
                                    transition={{ duration: 0.6 }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <motion.h2
                                    className="text-5xl font-display text-[var(--color-theme-primary)] mb-6"
                                >
                                    About Artisanal
                                </motion.h2>
                                <p className="text-lg text-[var(--color-theme-secondary)] leading-relaxed">
                                    Artisanal represents a commitment to culinary excellence and authentic hospitality.
                                    Since our founding, we've dedicated ourselves to sourcing the finest ingredients and
                                    employing time-honored techniques that elevate every dish. Our chefs work with passion
                                    and precision, creating not just meals, but memorable experiences that celebrate the
                                    art of fine dining. We believe exceptional food brings people together.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Section 2: Owners */}
                    <div className="h-screen w-screen flex justify-center items-center px-8 md:px-16">
                        <div className="max-w-4xl w-full">
                            <motion.h2
                                className="text-5xl font-display text-[var(--color-theme-primary)] mb-12 text-center"
                            >
                                Our Founders
                            </motion.h2>
                            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                                {owners.map((owner, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: idx * 0.2 }}
                                        viewport={{ once: true }}
                                        className="border border-[var(--color-theme-primary)]/20 rounded-lg overflow-hidden relative group"
                                    >
                                        <motion.button
                                            onClick={() => toggleOwner(idx)}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full p-6 bg-transparent hover:bg-white/5 transition-colors duration-300 text-left relative z-10"
                                        >
                                            <div className="flex items-center gap-6">
                                                <motion.img
                                                    src={owner.image}
                                                    alt={owner.name}
                                                    className="h-20 w-20 rounded-full object-cover border border-[var(--color-theme-primary)]/30"
                                                    animate={{
                                                        scale: ownerOpen === idx ? 1.05 : 1
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-display text-[var(--color-theme-secondary)]">{owner.name}</h3>
                                                    <p className="text-sm text-[var(--color-theme-primary)] font-body tracking-wider uppercase opacity-60">
                                                        {ownerOpen === idx ? "Founding Partner" : "Click to learn more"}
                                                    </p>
                                                </div>
                                                <motion.span
                                                    animate={{ rotate: ownerOpen === idx ? 45 : 0 }}
                                                    className="text-[var(--color-theme-primary)] text-2xl"
                                                >
                                                    +
                                                </motion.span>
                                            </div>
                                        </motion.button>

                                        <motion.div
                                            initial={false}
                                            animate={{
                                                height: ownerOpen === idx ? "auto" : 0,
                                                opacity: ownerOpen === idx ? 1 : 0
                                            }}
                                            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                            className="overflow-hidden relative z-10"
                                        >
                                            <div className="px-8 pb-8 bg-white/5 text-[var(--color-theme-secondary)] border-t border-[var(--color-theme-primary)]/10">
                                                <motion.p
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-lg leading-relaxed font-body pt-6"
                                                >
                                                    {owner.bio}
                                                </motion.p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Community */}
                    <div className="h-screen w-screen relative flex justify-center items-center px-8 md:px-16 pb-40 md:pb-20">
                        <div className="max-w-5xl w-full">
                            <motion.h2
                                className="text-5xl font-display text-[var(--color-theme-primary)] mb-6 text-center"
                            >
                                Local Giving
                            </motion.h2>
                            <p className="text-center text-[var(--color-theme-secondary)] mb-16 text-lg max-w-2xl mx-auto">
                                We believe in giving back to the community that supports us. A portion of our proceeds
                                goes to local nonprofits dedicated to food security and education.
                            </p>

                            <div className="relative h-96 max-w-3xl mx-auto flex items-center justify-center">
                                {/* Left image */}
                                <motion.div
                                    initial={{ opacity: 0, x: -60, y: 40 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                                    viewport={{ once: true }}
                                    className="absolute left-0 bottom-12 w-64 h-64 flex items-center justify-center z-10"
                                >
                                    <motion.img
                                        src={giving1}
                                        alt="Local Partner 1"
                                        className="max-w-full max-h-full object-contain brightness-90 hover:brightness-100 transition-all duration-700"
                                        whileHover={!isMobile ? { scale: 1.1 } : undefined}
                                        whileTap={isMobile ? { scale: 0.95 } : undefined}
                                    />
                                </motion.div>

                                {/* Center image (Offset vertically and overlaps others) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                                    viewport={{ once: true }}
                                    className="absolute left-1/2 top-0 -translate-x-1/2 w-72 h-72 flex items-center justify-center z-20"
                                >
                                    <motion.img
                                        src={giving2}
                                        alt="Local Partner 2"
                                        className="max-w-full max-h-full object-contain"
                                        whileHover={!isMobile ? { scale: 1.1 } : undefined}
                                        whileTap={isMobile ? { scale: 0.95 } : undefined}
                                    />
                                </motion.div>

                                {/* Right image */}
                                <motion.div
                                    initial={{ opacity: 0, x: 60, y: 40 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                                    viewport={{ once: true }}
                                    className="absolute right-0 bottom-12 w-64 h-64 flex items-center justify-center z-10"
                                >
                                    <motion.img
                                        src={giving3}
                                        alt="Local Partner 3"
                                        className="max-w-full max-h-full object-contain brightness-90 hover:brightness-100 transition-all duration-700"
                                        whileHover={!isMobile ? { scale: 1.1 } : undefined}
                                        whileTap={isMobile ? { scale: 0.95 } : undefined}
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-0 w-full z-20 pointer-events-auto">
                            <Footer embedded />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
                {[...Array(MAX_SECTION_INDEX + 1)].map((_, i) => (
                    <motion.button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        whileTap={{ scale: 0.8 }}
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            activeIndex === i ? "bg-[var(--color-theme-primary)] scale-150" : "bg-white/20 hover:bg-white/40"
                        }`}
                        title={`Go to section ${i}`}
                    />
                ))}
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-40">
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`${activeIndex === MAX_SECTION_INDEX ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}
                >
                    <svg
                        className="w-6 h-6 text-[var(--color-theme-primary)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </div>
        </motion.div>
    );
}
