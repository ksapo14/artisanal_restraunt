import { useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import bgImg from "../assets/restraunt_3.png";

const faqItems = [
    {
        q: "What are your restaurant hours?",
        a: "We're open Tuesday through Saturday, 5:00 PM to 9:30 PM. Closed Sundays and Mondays. Reservations are recommended, with walk-ins welcomed based on availability.",
    },
    {
        q: "Do you accommodate dietary restrictions?",
        a: "Yes. We accommodate vegetarian, vegan, gluten-free, and other dietary needs with advance notice whenever possible.",
    },
    {
        q: "Can I make a reservation online?",
        a: "Reservations can be made through OpenTable or by calling us directly at 828-898-5395 for specific requests.",
    },
    {
        q: "Do you offer wine pairings?",
        a: "Yes. Our team curates wine pairings to complement the menu and can guide selections during your visit.",
    },
];

const pageTheme = {
    bg: "#1c170a",
    primary: "#dac464",
    secondary: "#ffe6ac",
};

export default function FAQ() {
    const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({ 0: true });

    const toggleFaq = (index: number) => {
        setFaqOpen((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const themeStyles = {
        "--color-theme-primary": pageTheme.primary,
        "--color-theme-secondary": pageTheme.secondary,
        "--color-theme-bg": pageTheme.bg,
    } as CSSProperties;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-[100svh] lg:h-screen w-screen overflow-x-hidden lg:overflow-hidden flex flex-col relative selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)]"
            style={themeStyles}
        >
            <div
                className="fixed inset-0 -z-30"
                style={{
                    background: `linear-gradient(135deg, ${pageTheme.bg} 0%, ${pageTheme.bg} 68%, #1a0f0f 100%)`,
                }}
            />
            <motion.img
                src={bgImg}
                alt=""
                aria-hidden="true"
                initial={{ scale: 1.14, opacity: 0 }}
                animate={{ scale: 1.08, opacity: 0.36 }}
                transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                className="fixed inset-0 h-full w-full object-cover brightness-50 -z-20 pointer-events-none"
            />
            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.24) 0%, transparent 35%, var(--color-theme-bg) 100%)",
                }}
            />

            <Navbar compactMobile />

            <main className="flex-1 relative overflow-y-auto lg:overflow-hidden">
                <section
                    aria-labelledby="faq-heading"
                    className="min-h-full w-full flex flex-col items-center justify-center px-5 sm:px-8 lg:px-32 pt-24 pb-8 lg:py-0 relative"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
                        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[0.78fr_1fr] gap-9 lg:gap-16 items-start lg:items-center"
                    >
                        <div className="max-w-xl">
                            <p className="font-body text-[10px] sm:text-xs uppercase tracking-[0.32em] sm:tracking-[0.45em] text-[var(--color-theme-primary)] mb-5">
                                Before You Visit
                            </p>
                            <h1
                                id="faq-heading"
                                className="font-display text-5xl sm:text-6xl lg:text-7xl text-white/95 italic tracking-wide leading-none mb-6"
                            >
                                FAQ
                            </h1>
                            <p className="font-body text-xs sm:text-sm md:text-base text-[var(--color-theme-secondary)]/70 leading-relaxed font-light tracking-[0.08em] md:tracking-[0.1em] uppercase italic">
                                Common questions for planning dinner, dietary requests, reservations, and wine service.
                            </p>
                        </div>

                        <div className="w-full space-y-1 lg:justify-self-end">
                            {faqItems.map((item, index) => {
                                const isOpen = Boolean(faqOpen[index]);

                                return (
                                    <article key={item.q} className="border-b border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => toggleFaq(index)}
                                            aria-expanded={isOpen}
                                            className="group flex w-full items-center justify-between gap-5 py-5 text-left cursor-pointer"
                                        >
                                            <span className="font-display text-xl sm:text-2xl text-white/90 italic tracking-wide transition-colors duration-300 group-hover:text-[var(--color-theme-primary)]">
                                                {item.q}
                                            </span>
                                            <motion.span
                                                animate={{ rotate: isOpen ? 45 : 0 }}
                                                className="shrink-0 font-body text-2xl leading-none text-[var(--color-theme-primary)]"
                                                aria-hidden="true"
                                            >
                                                +
                                            </motion.span>
                                        </button>

                                        <motion.div
                                            initial={false}
                                            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                                            transition={{ duration: 0.35, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-5 pr-10 font-body text-xs sm:text-sm text-white/55 leading-relaxed font-light tracking-[0.06em]">
                                                {item.a}
                                            </p>
                                        </motion.div>
                                    </article>
                                );
                            })}
                        </div>
                    </motion.div>

                    <div className="mt-10 w-full z-20 pointer-events-auto lg:absolute lg:bottom-8 lg:left-0">
                        <Footer embedded />
                    </div>
                </section>
            </main>
        </motion.div>
    );
}
