import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MenuImageOverlay from "../components/MenuImageOverlay";
import type { MenuCategoryId } from "../lib/menuAssets";
import bgImg from "../assets/artisanal_full_restraunt_pic.jpg";

const pageTheme = {
    bg: "#1c170a",
    primary: "#dac464",
    secondary: "#ffe6ac",
};

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState<MenuCategoryId | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
            className="relative flex h-[100svh] w-screen flex-col overflow-hidden selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)] lg:h-screen"
            style={themeStyles}
        >
            <div className="fixed inset-0 -z-30 bg-[var(--color-theme-bg)]" />
            <motion.img
                src={bgImg}
                alt=""
                aria-hidden="true"
                initial={{ scale: 1.12, opacity: 0 }}
                animate={{ scale: 1.06, opacity: 0.52 }}
                transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover brightness-50"
            />
            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(28,23,10,0.35) 48%, var(--color-theme-bg) 100%)",
                }}
            />

            <Navbar compactMobile />

            <main className="mt-20 flex min-h-0 flex-1 items-start justify-center overflow-y-auto overscroll-contain px-5 py-4 sm:mt-24 sm:px-8 sm:py-6 lg:mt-0 lg:px-16 lg:pb-16 lg:pt-44">
                <motion.section
                    aria-labelledby="menu-heading"
                    initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.85, ease: [0.19, 1, 0.22, 1] }}
                    className="my-auto w-full max-w-4xl text-center"
                >
                    <h1
                        id="menu-heading"
                        className="font-display text-6xl leading-none text-white/95 sm:text-7xl lg:text-8xl"
                    >
                        Prix Fixe Menu
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl font-body text-xs uppercase leading-relaxed tracking-[0.12em] text-white/60 sm:text-sm">
                        Join us at Artisanal for a refined three-course prix fixe experience, offered at $110 per guest plus tax and service. Guests can enjoy a thoughtfully curated menu with multiple selections each course, with allergy accommodations available when possible. Reservations require a credit card and may be canceled up to 48 hours in advance; late cancellations are $65 per guest. We invite you to dress business casual and enjoy an elegant, relaxed evening with us.
                    </p>

                    <div className="mt-12 flex flex-col items-center justify-center gap-7 sm:flex-row sm:gap-14">
                        <MenuLink label="View Dinner Menu" onClick={() => setActiveCategory("dinner")} />
                        <span className="hidden h-8 w-px bg-[var(--color-theme-primary)]/35 sm:block" />
                        <MenuLink label="View Dessert Menu" onClick={() => setActiveCategory("dessert")} />
                    </div>
                </motion.section>
            </main>

            <Footer />

            <AnimatePresence>
                {activeCategory && (
                    <MenuImageOverlay
                        key={activeCategory}
                        categoryId={activeCategory}
                        onClose={() => setActiveCategory(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function MenuLink({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group cursor-pointer font-display text-2xl text-[var(--color-theme-secondary)] transition-colors hover:text-white sm:text-3xl"
        >
            <span className="border-b border-[var(--color-theme-primary)]/55 pb-2 transition-colors group-hover:border-[var(--color-theme-primary)]">
                {label}
            </span>
        </motion.button>
    );
}
