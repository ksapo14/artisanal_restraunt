import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUI } from "../context/UIContext";
import { sendContactEmail, isResendConfigured } from "../api/emailService";
import "../index.css";
import bgImg from '../assets/artisanal_full_restraunt_pic.jpg';

const MAX_SECTION_INDEX = 1;

const sectionConfig = [
    { bg: "#1a0f0f", primary: "#dac464", secondary: "#f5f0ed" }, // Map (Visit)
    { bg: "#1c170a", primary: "#dac464", secondary: "#f5f0ed" }, // Form (Contact)
];

export default function Contact() {
    const { isSiteMapOpen, isMobile } = useUI();
    const [activeIndex, setActiveIndex] = useState(0);
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const isNavigating = useRef(false);
    const activeIndexRef = useRef(activeIndex);

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

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

    useEffect(() => {
        window.scrollTo(0, 0);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isResendConfigured) {
            setErrorMessage("Email service is not configured. Please contact the administrator.");
            setFormStatus("error");
            return;
        }

        setFormStatus("submitting");
        setErrorMessage("");

        try {
            await sendContactEmail(formData);
            setFormStatus("success");
            setFormData({ name: "", email: "", message: "" });
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to send message. Please try again later.");
            setFormStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const currentTheme = sectionConfig[activeIndex];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
                opacity: 1,
                '--color-theme-primary': currentTheme.primary,
                '--color-theme-secondary': currentTheme.secondary,
            } as any}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-[100svh] md:h-screen w-screen overflow-hidden flex flex-col relative"
        >
            {/* Seamless Static Gradient Background */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    background: `linear-gradient(135deg, #1a0f0f 0%, #1a0f0f 40%, #1c170a 100%)`,
                    filter: 'brightness(1.2)'
                }}
            />

            <div
                className={`relative transition-all duration-700 ease-out ${activeIndex > 0 && !isSiteMapOpen
                        ? "opacity-0 pointer-events-none -translate-y-10 z-0"
                        : "opacity-100 pointer-events-auto translate-y-0 z-[1000]"
                    }`}
            >
                <Navbar compactMobile />
            </div>

            <div className="flex-1 relative overflow-hidden">
                <div
                    className="h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.19, 1, 0.22, 1)]"
                    style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                    {/* Section 0: Google Maps (Visit) */}
                    <div className="h-[100svh] md:h-screen w-screen shrink-0 relative overflow-y-auto md:overflow-visible bg-transparent">
                        <div className="min-h-full md:h-full w-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-16 pt-24 md:pt-0 pb-12 md:pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl w-full items-center">
                                {/* Address Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-4xl sm:text-5xl font-display text-[var(--color-theme-primary)] italic">Visit Us</h2>
                                    <div className="space-y-4">
                                        <p className="text-lg md:text-xl text-white/90 font-body leading-relaxed tracking-wide">
                                            Nestled in the heart of the Blue Ridge Mountains, Artisanal offers an escape into a world of refined taste and natural beauty.
                                        </p>
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-[var(--color-theme-primary)] font-body uppercase tracking-[0.2em] text-xs mb-2">Location</p>
                                            <p className="text-white/80 font-body text-base md:text-lg leading-relaxed tracking-widest">
                                                1200 Dobbins Rd<br />
                                                Banner Elk, NC 28604
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-[var(--color-theme-primary)] font-body uppercase tracking-[0.2em] text-xs mb-2">Hours</p>
                                            <p className="text-white/80 font-body text-base md:text-lg leading-relaxed tracking-widest">
                                                Tuesday — Saturday<br />
                                                5:00 PM — 10:00 PM
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Map Side */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="w-full h-[40svh] md:h-[60vh] rounded-lg overflow-hidden border border-white/10 relative group shadow-2xl"
                                >
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.2762039233075!2d-81.87413692348507!3d36.08670417242882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x885090f777e55555%3A0x6a0c5c4e9c7e0f8!2s1200%20Dobbins%20Rd%2C%20Banner%20Elk%2C%20NC%2028604!5e0!3m2!1sen!2sus!4v1717163829000!5m2!1sen!2sus"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Artisanal Location"
                                    ></iframe>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Contact Form & Image (Contact) */}
                    <div className="h-[100svh] md:h-screen w-screen shrink-0 relative overflow-y-auto md:overflow-visible bg-transparent">
                        <div className="min-h-full md:h-full w-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-16 pt-24 md:pt-0 pb-32 md:pb-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-6xl w-full items-center">
                                {/* Form Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <h1 className="text-4xl sm:text-5xl font-display text-[var(--color-theme-primary)] mb-3 md:mb-4">Contact Us</h1>
                                    <p className="text-sm sm:text-base md:text-lg text-white/60 mb-6 md:mb-8 font-body italic">We'd love to hear from you. Please reach out with any inquiries.</p>

                                    {formStatus === "success" ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white/5 border border-[var(--color-theme-primary)] p-6 md:p-8 rounded-lg text-center"
                                        >
                                            <h3 className="text-2xl font-display text-[var(--color-theme-primary)] mb-2">Message Received</h3>
                                            <p className="text-white/60 font-body mb-6">Thank you for reaching out. Our team will get back to you shortly.</p>
                                            <button
                                                onClick={() => setFormStatus("idle")}
                                                className="text-xs uppercase tracking-widest text-[var(--color-theme-primary)] hover:underline"
                                            >
                                                Send another message
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                            <div className="space-y-2">
                                                <label className="block text-xs md:text-sm font-body uppercase tracking-widest text-[var(--color-theme-primary)] opacity-80">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-theme-primary)] transition-colors font-body text-sm md:text-base"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs md:text-sm font-body uppercase tracking-widest text-[var(--color-theme-primary)] opacity-80">Email Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-theme-primary)] transition-colors font-body text-sm md:text-base"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs md:text-sm font-body uppercase tracking-widest text-[var(--color-theme-primary)] opacity-80">Message</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-theme-primary)] transition-colors font-body resize-none text-sm md:text-base"
                                                    placeholder="How can we help you?"
                                                />
                                            </div>

                                            {formStatus === "error" && (
                                                <p className="text-red-400 text-sm font-body">{errorMessage}</p>
                                            )}

                                            <motion.button
                                                whileHover={!isMobile ? { scale: 1.02 } : undefined}
                                                whileTap={{ scale: 0.96 }}
                                                disabled={formStatus === "submitting"}
                                                className="w-full py-3 md:py-4 bg-[var(--color-theme-primary)] text-black font-display text-lg md:text-xl rounded-lg hover:brightness-110 transition-all duration-300 tracking-wider uppercase disabled:opacity-50 flex items-center justify-center gap-3"
                                            >
                                                {formStatus === "submitting" ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : "Send Message"}
                                            </motion.button>
                                        </form>
                                    )}
                                </motion.div>

                                {/* Image Side */}
                                <motion.div
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="relative rounded-lg overflow-hidden border border-white/5 aspect-[4/5] hidden md:block"
                                >
                                    <img
                                        src={bgImg}
                                        alt="Artisanal Atmosphere"
                                        className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Footer at the very bottom of the last section */}
                        <div className="absolute bottom-8 left-0 w-full z-20 pointer-events-auto">
                            <Footer embedded />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}