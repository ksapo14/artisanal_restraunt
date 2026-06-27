import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileSectionControls from "../components/MobileSectionControls";
import { useUI } from "../context/UIContext";
import { useSwipeNavigation } from "../hooks/useSwipeNavigation";
import { sendContactEmail, isResendConfigured } from "../api/emailService";
import bgImg from "../assets/artisanal_full_restraunt_pic.jpg";
import diningImg from "../assets/restraunt_2.png";

type ContactSection = {
    id: string;
    title: string;
    eyebrow: string;
    body: string;
};

const sections: ContactSection[] = [
    {
        id: "visit",
        title: "Visit Us",
        eyebrow: "Banner Elk",
        body: "A quiet dining room in the Blue Ridge Mountains for seasonal dinners, private celebrations, and measured evenings at the table.",
    },
    {
        id: "message",
        title: "Contact Us",
        eyebrow: "Inquiries",
        body: "Send a note for private dining, special requests, or general questions. Our team will respond as soon as possible.",
    },
];

const pageTheme = {
    bg: "#1c170a",
    primary: "#dac464",
    secondary: "#ffe6ac",
};

function isFormField(target: EventTarget | null) {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
}

export default function Contact() {
    const { isSiteMapOpen, isMobile } = useUI();
    const [activeIndex, setActiveIndex] = useState(0);
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

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
        }, 1000);
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
            if (isSiteMapOpen || isFormField(event.target)) return;

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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isResendConfigured) {
            setErrorMessage("Email service is not configured. Please contact the restaurant directly.");
            setFormStatus("error");
            return;
        }

        setFormStatus("submitting");
        setErrorMessage("");

        try {
            await sendContactEmail(formData);
            setFormStatus("success");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to send message. Please try again later.";
            setErrorMessage(message);
            setFormStatus("error");
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
            transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] },
        },
        active: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.75, ease: [0.65, 0, 0.35, 1] },
        },
    };

    return (
        <motion.div
            ref={pageRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="h-[100svh] md:h-screen w-screen overflow-hidden flex flex-col relative selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)]"
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
                animate={{ scale: activeIndex === 0 ? 1.08 : 1.14, opacity: activeIndex === 0 ? 0.42 : 0.18 }}
                transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1] }}
                className="fixed inset-0 h-full w-full object-cover brightness-50 -z-20 pointer-events-none"
            />
            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 35%, var(--color-theme-bg) 100%)",
                }}
            />

            <div
                className={`relative transition-all duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
                    activeIndex > 0 && !isSiteMapOpen
                        ? "z-[1000] translate-y-0 opacity-100 lg:pointer-events-none lg:z-0 lg:-translate-y-10 lg:opacity-0"
                        : "opacity-100 pointer-events-auto translate-y-0 z-[1000]"
                }`}
            >
                <Navbar compactMobile />
            </div>

            <div className="relative mt-20 min-h-0 flex-1 overflow-hidden sm:mt-24 lg:mt-0">
                <div
                    className="h-full w-full transition-all duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
                    style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                    <section
                        aria-labelledby="visit-heading"
                        data-swipe-scroll
                        className="relative flex h-full w-full items-start justify-center overflow-y-auto px-5 pt-4 pb-8 sm:px-8 sm:pt-6 lg:items-center lg:overflow-hidden lg:px-32 lg:py-0"
                    >
                        <motion.div
                            variants={contentVariants}
                            initial={false}
                            animate={activeIndex === 0 ? "active" : "inactive"}
                            className="my-auto grid h-full w-full max-w-6xl grid-cols-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-8 lg:h-auto lg:grid-cols-[0.82fr_1fr] lg:grid-rows-none lg:gap-16"
                        >
                            <div className="max-w-xl">
                                <p className="mb-3 hidden font-body text-[10px] uppercase tracking-[0.32em] text-[var(--color-theme-primary)] sm:mb-5 sm:block sm:text-xs sm:tracking-[0.45em]">
                                    {sections[0].eyebrow}
                                </p>
                                <h1
                                    id="visit-heading"
                                    className="mb-4 font-display text-5xl leading-none tracking-wide text-white/95 italic sm:mb-6 sm:text-6xl lg:text-7xl"
                                >
                                    {sections[0].title}
                                </h1>
                                <p className="mb-5 font-body text-xs leading-relaxed font-light tracking-[0.08em] text-[var(--color-theme-secondary)]/70 uppercase italic sm:mb-8 sm:text-sm md:text-base md:tracking-[0.1em]">
                                    {sections[0].body}
                                </p>

                                <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:gap-6 sm:pt-6">
                                    <div>
                                        <p className="font-body text-[10px] uppercase tracking-[0.28em] text-[var(--color-theme-primary)] mb-2">Location</p>
                                        <address className="not-italic font-body text-sm text-white/65 leading-relaxed">
                                            1200 Dobbins Rd
                                            <br />
                                            Banner Elk, NC 28604
                                        </address>
                                    </div>
                                    <div>
                                        <p className="font-body text-[10px] uppercase tracking-[0.28em] text-[var(--color-theme-primary)] mb-2">Hours</p>
                                        <p className="font-body text-sm text-white/65 leading-relaxed">
                                            Tuesday - Saturday
                                            <br />
                                            5:00 PM - 10:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-full min-h-40 w-full overflow-hidden border border-white/10 bg-black/20 sm:min-h-64 lg:h-[58vh]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.2762039233075!2d-81.87413692348507!3d36.08670417242882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x885090f777e55555%3A0x6a0c5c4e9c7e0f8!2s1200%20Dobbins%20Rd%2C%20Banner%20Elk%2C%20NC%2028604!5e0!3m2!1sen!2sus!4v1717163829000!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: "grayscale(1) invert(0.88) contrast(1.08)" }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Artisanal location map"
                                />
                            </div>
                        </motion.div>
                    </section>

                    <section
                        aria-labelledby="message-heading"
                        data-swipe-scroll
                        className="relative flex h-full w-full flex-col items-stretch overflow-y-auto px-5 pt-4 sm:px-8 sm:pt-6 lg:flex-row lg:items-center lg:justify-center lg:overflow-hidden lg:px-32 lg:py-0"
                    >
                        <motion.div
                            variants={contentVariants}
                            initial={false}
                            animate={activeIndex === 1 ? "active" : "inactive"}
                            className="my-auto grid w-full max-w-6xl shrink-0 grid-cols-1 items-center gap-8 lg:my-0 lg:grid-cols-[0.82fr_1fr] lg:gap-16"
                        >
                            <div className="w-full max-w-xl">
                                <p className="mb-5 hidden font-body text-[10px] uppercase tracking-[0.32em] text-[var(--color-theme-primary)] sm:block sm:text-xs sm:tracking-[0.45em]">
                                    {sections[1].eyebrow}
                                </p>
                                <h2
                                    id="message-heading"
                                    className="font-display text-4xl sm:text-5xl lg:text-6xl text-white/95 italic tracking-wide leading-none mb-5"
                                >
                                    {sections[1].title}
                                </h2>
                                <p className="font-body text-xs sm:text-sm text-[var(--color-theme-secondary)]/65 leading-relaxed font-light tracking-[0.08em] uppercase italic mb-7">
                                    {sections[1].body}
                                </p>

                                {formStatus === "success" ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                                        className="border-y border-white/10 py-8"
                                    >
                                        <h3 className="font-display text-3xl text-white/95 italic mb-3">Message Received</h3>
                                        <p className="font-body text-sm text-white/55 leading-relaxed mb-6">
                                            Thank you for reaching out. Our team will get back to you shortly.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setFormStatus("idle")}
                                            className="font-body text-[10px] uppercase tracking-[0.28em] text-[var(--color-theme-primary)] hover:text-white transition-colors duration-300 cursor-pointer"
                                        >
                                            Send another message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
                                        <div className="space-y-2">
                                            <label htmlFor="contact-name" className="block font-body text-[10px] uppercase tracking-[0.28em] text-[var(--color-theme-primary)]">
                                                Full Name
                                            </label>
                                            <input
                                                id="contact-name"
                                                required
                                                type="text"
                                                name="name"
                                                autoComplete="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-sm text-white placeholder:text-white/25 outline-none transition-colors duration-300 focus:border-[var(--color-theme-primary)]"
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contact-email" className="block font-body text-[10px] uppercase tracking-[0.28em] text-[var(--color-theme-primary)]">
                                                Email Address
                                            </label>
                                            <input
                                                id="contact-email"
                                                required
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-sm text-white placeholder:text-white/25 outline-none transition-colors duration-300 focus:border-[var(--color-theme-primary)]"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contact-message" className="block font-body text-[10px] uppercase tracking-[0.28em] text-[var(--color-theme-primary)]">
                                                Message
                                            </label>
                                            <textarea
                                                id="contact-message"
                                                required
                                                rows={4}
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full resize-none border-b border-white/15 bg-transparent px-0 py-3 font-body text-sm text-white placeholder:text-white/25 outline-none transition-colors duration-300 focus:border-[var(--color-theme-primary)]"
                                                placeholder="How can we help?"
                                            />
                                        </div>

                                        {formStatus === "error" && (
                                            <p className="font-body text-sm text-red-300" role="alert">
                                                {errorMessage}
                                            </p>
                                        )}

                                        <motion.button
                                            type="submit"
                                            whileHover={!isMobile ? { x: 6 } : undefined}
                                            whileTap={{ scale: 0.96 }}
                                            disabled={formStatus === "submitting"}
                                            className="group mt-3 flex items-center gap-4 font-display text-xl italic tracking-wide text-[var(--color-theme-primary)] transition-colors duration-300 hover:text-white disabled:opacity-50 disabled:hover:text-[var(--color-theme-primary)] cursor-pointer"
                                        >
                                            <span>{formStatus === "submitting" ? "Sending" : "Send Message"}</span>
                                            <span className="h-px w-14 bg-current transition-all duration-300 group-hover:w-20" aria-hidden="true" />
                                        </motion.button>
                                    </form>
                                )}
                            </div>

                            <div className="hidden lg:block w-full h-[58vh] justify-self-end overflow-hidden border border-white/8 bg-black/10">
                                <img
                                    src={diningImg}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-full w-full object-cover brightness-75 grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                                />
                            </div>
                        </motion.div>

                        <div className="relative z-20 w-full shrink-0 pointer-events-auto lg:absolute lg:bottom-8 lg:left-0">
                            <Footer embedded />
                        </div>
                    </section>
                </div>

                <div className="hidden lg:flex absolute right-4 md:right-8 top-0 bottom-0 z-50 flex-col justify-between py-32 pointer-events-none">
                    <button
                        type="button"
                        onClick={() => navigateSection("prev")}
                        disabled={activeIndex === 0}
                        className="group flex items-start justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                        aria-label="Previous contact section"
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
                        aria-label="Next contact section"
                    >
                        <svg viewBox="0 0 24 200" className="h-full w-8 md:w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 0V196M12 196L5 189M12 196L19 189" />
                        </svg>
                    </button>
                </div>

                <MobileSectionControls
                    previousLabel="Previous contact section"
                    nextLabel="Next contact section"
                    previousDisabled={activeIndex === 0}
                    nextDisabled={activeIndex === sections.length - 1}
                    onPrevious={() => navigateSection("prev")}
                    onNext={() => navigateSection("next")}
                />
            </div>
        </motion.div>
    );
}
