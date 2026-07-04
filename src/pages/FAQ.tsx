import { useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import bgImg from "../assets/restraunt_3.png";

const faqItems = [
    {
        q: "When are you open?",
        a: "We plan to be open for the 2026 season for the dates of June 2nd - October. We provide dinner service from 5 PM - 9:15 PM.",
    },
    {
        q: "What is the allergy policy?",
        a: "Please let us know about any allergies or dietary needs when booking so our team can prepare accordingly. We can accommodate many gluten, dairy, seafood, nut, and vegetarian requests, and our server will guide you through the best menu options. Vegan or more specific allergy requests should contact us in advance. For severe or life-threatening allergies, please note that we cannot guarantee zero cross-contamination in our open kitchen.",
    },
    {
        q: "What is the corkage policy?",
        a: "We unfortunately do not allow outside food or beverages.",
    },
    {
        q: "What is the dress code?",
        a: "We invite guests to dress business casual. For men, collared shirts are required and jackets are welcome but not required. For women, dresses and business casual attire are encouraged. Please avoid shorts, distressed jeans, hoodies, hats, sandals, flip flops, or overly revealing attire. For outdoor dining, dress comfortably for the weather.",
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
            className="flex h-[100svh] w-screen flex-col overflow-hidden relative selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)] lg:h-screen"
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

            <main className="relative mt-20 min-h-0 flex-1 overflow-y-auto overscroll-contain sm:mt-24 lg:mt-0 lg:overflow-hidden">
                <section
                    aria-labelledby="faq-heading"
                    className="relative flex min-h-full w-full flex-col items-center justify-center px-5 pt-4 pb-8 sm:px-8 sm:pt-6 lg:px-32 lg:py-0"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
                        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[0.78fr_1fr] gap-9 lg:gap-16 items-start lg:items-center"
                    >
                        <div className="max-w-xl">
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
