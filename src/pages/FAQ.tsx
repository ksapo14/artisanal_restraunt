import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../index.css";

const faqItems = [
    {
        q: "What are your restaurant hours?",
        a: "We're open Tuesday through Saturday, 5:00 PM to 9:30 PM. Closed Sundays and Mondays. Reservations are recommended, walk-ins welcome based on availability."
    },
    {
        q: "Do you accommodate dietary restrictions?",
        a: "Absolutely. We accommodate vegetarian, vegan, gluten-free, and other dietary needs. Please inform your server, and our chefs will create something special for you."
    },
    {
        q: "Can I make a reservation online?",
        a: "You can call us directly at 828-898-5395 or visit our contact page to submit an inquiry. We recommend calling to discuss your preferences and ensure we have the perfect experience ready."
    },
    {
        q: "Do you offer wine pairings?",
        a: "Yes, our sommelier curates wine pairings to complement our tasting menus. Ask your server about our wine selection and pairing options on your visit."
    }
];

export default function FAQ() {
    const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

    const toggleFaq = (index: number) => {
        setFaqOpen((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const themeStyles = {
        "--color-theme-primary": "#dac464",
        "--color-theme-secondary": "#ffe6ac",
        "--color-theme-bg": "#1c170a",
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
                <div className="max-w-3xl w-full">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl font-display text-[var(--color-theme-primary)] mb-12 text-center"
                    >
                        Frequently Asked
                    </motion.h1>
                    <div className="space-y-4">
                        {faqItems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="border border-white/10 rounded-lg overflow-hidden relative group"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full p-5 bg-transparent hover:bg-white/5 transition-colors duration-300 text-left flex justify-between items-center relative z-10"
                                >
                                    <h2 className="text-lg font-display text-[var(--color-theme-secondary)] tracking-wide">{item.q}</h2>
                                    <motion.span
                                        animate={{ rotate: faqOpen[idx] ? 180 : 0 }}
                                        className="text-[var(--color-theme-primary)] text-xl"
                                    >
                                        {faqOpen[idx] ? "-" : "+"}
                                    </motion.span>
                                </button>

                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: faqOpen[idx] ? "auto" : 0,
                                        opacity: faqOpen[idx] ? 1 : 0
                                    }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="overflow-hidden relative z-10"
                                >
                                    <div className="px-5 pb-5 bg-white/5 text-[var(--color-theme-secondary)] border-t border-white/5">
                                        <p className="pt-4 font-body leading-relaxed opacity-80">{item.a}</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </motion.div>
    );
}
