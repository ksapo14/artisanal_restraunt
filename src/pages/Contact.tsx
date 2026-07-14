import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUI } from "../context/UIContext";
import { useLenisScroll } from "../hooks/useLenisScroll";
import { sendContactEmail, isResendConfigured } from "../api/emailService";
import bgImg from "../assets/artisanal_full_restraunt_pic.jpg";
import diningImg from "../assets/restraunt_2.png";

const pageTheme = {
    bg: "#1c170a",
    primary: "#dac464",
    secondary: "#ffe6ac",
};

export default function Contact() {
    const { isMobile } = useUI();
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const pageRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLElement | null>(null);
    useLenisScroll({ wrapperRef: pageRef, contentRef });

    useEffect(() => {
        pageRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, []);

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

    return (
        <motion.div
            ref={pageRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative h-[100svh] w-screen overflow-x-hidden overflow-y-auto overscroll-contain selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)]"
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
                initial={{ scale: 1.12, opacity: 0 }}
                animate={{ scale: 1.08, opacity: 0.34 }}
                transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1] }}
                className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover brightness-50"
            />
            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 35%, var(--color-theme-bg) 100%)",
                }}
            />

            <Navbar compactMobile />

            <main ref={contentRef} className="relative z-10">
                <section
                    aria-labelledby="visit-heading"
                    className="flex min-h-[100svh] w-full items-center justify-center px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 lg:px-32 lg:py-32"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ amount: 0.35, once: true }}
                        transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
                        className="grid w-full max-w-6xl grid-cols-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-8 lg:grid-cols-[0.82fr_1fr] lg:grid-rows-none lg:gap-16"
                    >
                        <div className="max-w-xl">
                            <h1
                                id="visit-heading"
                                className="mb-4 font-display text-5xl leading-none tracking-wide text-white/95 italic sm:mb-6 sm:text-6xl lg:text-7xl"
                            >
                                Visit Us
                            </h1>
                            <p className="mb-5 font-body text-xs font-light leading-relaxed tracking-[0.08em] text-[var(--color-theme-secondary)]/70 uppercase italic sm:mb-8 sm:text-sm md:text-base md:tracking-[0.1em]">
                                A quiet dining room in the Blue Ridge Mountains for seasonal dinners, private celebrations, and measured evenings at the table.
                            </p>

                            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:gap-6 sm:pt-6">
                                <div>
                                    <p className="mb-2 font-body text-[10px] tracking-[0.28em] text-[var(--color-theme-primary)] uppercase">Location</p>
                                    <address className="font-body text-sm leading-relaxed text-white/65 not-italic">
                                        1200 Dobbins Rd
                                        <br />
                                        Banner Elk, NC 28604
                                    </address>
                                </div>
                                <div>
                                    <p className="mb-2 font-body text-[10px] tracking-[0.28em] text-[var(--color-theme-primary)] uppercase">Hours</p>
                                    <p className="font-body text-sm leading-relaxed text-white/65">
                                        Tuesday - Saturday
                                        <br />
                                        5:00 PM - 10:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div data-lenis-prevent className="h-full min-h-56 w-full overflow-hidden border border-white/10 bg-black/20 sm:min-h-72 lg:h-[58vh]">
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
                    className="flex min-h-[100svh] w-full flex-col justify-between px-5 pb-0 pt-20 sm:px-8 sm:pt-24 lg:px-32 lg:pt-32"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ amount: 0.35, once: true }}
                        transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
                        className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-[0.82fr_1fr] lg:gap-16"
                    >
                        <div className="w-full max-w-xl">
                            <h2
                                id="message-heading"
                                className="mb-5 font-display text-4xl leading-none tracking-wide text-white/95 italic sm:text-5xl lg:text-6xl"
                            >
                                Contact Us
                            </h2>
                            <p className="mb-7 font-body text-xs font-light leading-relaxed tracking-[0.08em] text-[var(--color-theme-secondary)]/65 uppercase italic sm:text-sm">
                                Send a note for private dining, special requests, or general questions. Our team will respond as soon as possible.
                            </p>

                            {formStatus === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                                    className="border-y border-white/10 py-8"
                                >
                                    <h3 className="mb-3 font-display text-3xl text-white/95 italic">Message Received</h3>
                                    <p className="mb-6 font-body text-sm leading-relaxed text-white/55">
                                        Thank you for reaching out. Our team will get back to you shortly.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setFormStatus("idle")}
                                        className="cursor-pointer font-body text-[10px] tracking-[0.28em] text-[var(--color-theme-primary)] uppercase transition-colors duration-300 hover:text-white"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
                                    <div className="space-y-2">
                                        <label htmlFor="contact-name" className="block font-body text-[10px] tracking-[0.28em] text-[var(--color-theme-primary)] uppercase">
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
                                            className="w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-sm text-white outline-none transition-colors duration-300 placeholder:text-white/25 focus:border-[var(--color-theme-primary)]"
                                            placeholder="Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="contact-email" className="block font-body text-[10px] tracking-[0.28em] text-[var(--color-theme-primary)] uppercase">
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
                                            className="w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-sm text-white outline-none transition-colors duration-300 placeholder:text-white/25 focus:border-[var(--color-theme-primary)]"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="contact-message" className="block font-body text-[10px] tracking-[0.28em] text-[var(--color-theme-primary)] uppercase">
                                            Message
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            required
                                            rows={4}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full resize-none border-b border-white/15 bg-transparent px-0 py-3 font-body text-sm text-white outline-none transition-colors duration-300 placeholder:text-white/25 focus:border-[var(--color-theme-primary)]"
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
                                        className="group mt-3 flex cursor-pointer items-center gap-4 font-display text-xl tracking-wide text-[var(--color-theme-primary)] transition-colors duration-300 hover:text-white disabled:opacity-50 disabled:hover:text-[var(--color-theme-primary)] italic"
                                    >
                                        <span>{formStatus === "submitting" ? "Sending" : "Send Message"}</span>
                                        <span className="h-px w-14 bg-current transition-all duration-300 group-hover:w-20" aria-hidden="true" />
                                    </motion.button>
                                </form>
                            )}
                        </div>

                        <div className="hidden h-[58vh] w-full justify-self-end overflow-hidden border border-white/8 bg-black/10 lg:block">
                            <img
                                src={diningImg}
                                alt=""
                                aria-hidden="true"
                                className="h-full w-full object-cover brightness-75 grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                            />
                        </div>
                    </motion.div>

                    <div className="relative z-20 mt-16 w-full shrink-0">
                        <Footer embedded />
                    </div>
                </section>
            </main>
        </motion.div>
    );
}
