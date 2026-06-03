import { type CSSProperties } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../index.css";

export default function PrivateEvents() {
    const themeStyles = {
        "--color-theme-primary": "#a68a7b",
        "--color-theme-secondary": "#f5f0ed",
        "--color-theme-bg": "#1b1412",
    } as CSSProperties;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-screen w-screen overflow-x-hidden flex flex-col relative bg-[var(--color-theme-bg)]"
            style={themeStyles}
        >
            <Navbar />

            <main className="flex-1 flex justify-center items-center px-8 md:px-16 pt-32 pb-32">
                <div className="max-w-2xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="text-5xl font-display text-[var(--color-theme-primary)] mb-8"
                        >
                            Private Events
                        </motion.h1>
                        <p className="text-lg text-[var(--color-theme-secondary)] leading-relaxed mb-8">
                            Celebrate your special moments at Artisanal. From intimate gatherings to sophisticated
                            corporate dinners, our private event spaces offer the protect backdrop for unforgettable
                            occasions.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 bg-[var(--color-theme-primary)] text-black font-display text-xl rounded-lg hover:brightness-110 transition-all duration-300 tracking-wider"
                        >
                            Inquire About Events
                        </motion.button>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </motion.div>
    );
}
