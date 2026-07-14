import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLenisScroll } from "../hooks/useLenisScroll";
import bgImg1 from "../assets/artisanal_full_restraunt_pic.jpg";
import bgImg2 from "../assets/restraunt_2.png";
import bgImg3 from "../assets/restraunt_3.png";
import giving1 from "../assets/giving_1_nobg.png";
import giving2 from "../assets/giving_2_nobg.png";
import giving3 from "../assets/giving_3_nobg.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
    body: string;
    image: string;
    imageAlt: string;
    theme: AboutTheme;
    founders?: Founder[];
    communityImages?: string[];
};

const sections: AboutSection[] = [
    {
        id: "story",
        title: "Artisanal",
        body: "A quiet dining room built around seasonal ingredients, deliberate technique, and a measured evening at the table.",
        image: bgImg1,
        imageAlt: "The timber dining room at Artisanal",
        theme: { bg: "#1c170a", primary: "#dac464", secondary: "#ffe6ac" },
    },
    {
        id: "philosophy",
        title: "Philosophy",
        body: "We believe in the integrity of ingredients and the precision of craft. Age-old techniques meet modern sensibilities to create something timeless.",
        image: bgImg2,
        imageAlt: "The bar and dining room at Artisanal",
        theme: { bg: "#1b1412", primary: "#a68a7b", secondary: "#f5f0ed" },
    },
    {
        id: "founders",
        title: "Founders",
        body: "Chef Marcus Chen and Sophie Durand shape the food, pacing, and service with a shared focus on care and restraint.",
        image: bgImg3,
        imageAlt: "Artisanal in the Blue Ridge Mountains",
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
        body: "Artisanal partners with local farmers, supports urban gardens, and contributes to food security initiatives across the region.",
        image: bgImg1,
        imageAlt: "The Artisanal dining room prepared for service",
        theme: { bg: "#1c170a", primary: "#dac464", secondary: "#ffe6ac" },
        communityImages: [giving1, giving2, giving3],
    },
];

const sectionCount = sections.length - 1;
const pageTheme = sections[0].theme;

export default function About() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [openFounders, setOpenFounders] = useState<Record<string, boolean>>({});
    const pageRef = useRef<HTMLDivElement | null>(null);
    const sectionsRef = useRef<HTMLDivElement | null>(null);
    const progressFillRef = useRef<HTMLDivElement | null>(null);
    const reduceMotion = useReducedMotion();
    const lenisRef = useLenisScroll({
        wrapperRef: pageRef,
        contentRef: sectionsRef,
        enabled: !reduceMotion,
        onScroll: () => ScrollTrigger.update(),
    });

    useEffect(() => {
        pageRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const toggleFounder = useCallback((name: string) => {
        setOpenFounders((current) => ({
            ...current,
            [name]: !current[name],
        }));
    }, []);

    const scrollToSection = useCallback((index: number) => {
        const section = pageRef.current?.querySelector<HTMLElement>(`[data-about-index="${index}"]`);
        if (!section) return;

        if (!reduceMotion && lenisRef.current) {
            lenisRef.current.scrollTo(section, {
                duration: 1,
                lock: true,
            });
            return;
        }

        section?.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start",
        });
    }, [lenisRef, reduceMotion]);

    useGSAP(() => {
        const scroller = pageRef.current;
        const sectionTrack = sectionsRef.current;
        if (!scroller || !sectionTrack) return;

        const sectionElements = gsap.utils.toArray<HTMLElement>("[data-about-index]", scroller);
        const backgrounds = gsap.utils.toArray<HTMLElement>("[data-about-background]", scroller);
        const progressFill = progressFillRef.current;

        gsap.set(backgrounds, { autoAlpha: 0, scale: 1.08, yPercent: 0 });
        gsap.set(backgrounds[0], { autoAlpha: 0.42 });
        if (progressFill) gsap.set(progressFill, { scaleY: 0, transformOrigin: "top center" });

        const activateSection = (index: number) => {
            setActiveIndex(index);
            backgrounds.forEach((background, backgroundIndex) => {
                gsap.to(background, {
                    autoAlpha: backgroundIndex === index ? 0.42 : 0,
                    duration: reduceMotion ? 0 : 0.55,
                    overwrite: "auto",
                    ease: "power2.out",
                });
            });
        };

        sectionElements.forEach((section, index) => {
            const background = backgrounds[index];
            const content = section.querySelector<HTMLElement>("[data-about-content]");
            const media = section.querySelector<HTMLElement>("[data-about-media]");

            ScrollTrigger.create({
                trigger: section,
                scroller,
                start: "top 52%",
                end: "bottom 48%",
                onEnter: () => activateSection(index),
                onEnterBack: () => activateSection(index),
            });

            if (reduceMotion) return;

            if (background) {
                gsap.fromTo(
                    background,
                    { yPercent: -5, scale: 1.12 },
                    {
                        yPercent: 5,
                        scale: 1.04,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            scroller,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 0.8,
                            invalidateOnRefresh: true,
                        },
                    },
                );
            }

            if (content) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        scroller,
                        start: "top 86%",
                        end: "bottom 14%",
                        scrub: 0.65,
                        invalidateOnRefresh: true,
                    },
                })
                    .fromTo(
                        content,
                        { y: 48, autoAlpha: 0.28 },
                        { y: 0, autoAlpha: 1, duration: 0.44, ease: "none" },
                    )
                    .to(content, { y: -30, autoAlpha: 0.5, duration: 0.56, ease: "none" });
            }

            if (media) {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        scroller,
                        start: "top 90%",
                        end: "bottom 10%",
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    },
                })
                    .fromTo(
                        media,
                        { scale: 0.88, y: 36, autoAlpha: 0.35 },
                        { scale: 1, y: 0, autoAlpha: 1, duration: 0.48, ease: "none" },
                    )
                    .to(media, { scale: 0.96, y: -24, autoAlpha: 0.4, duration: 0.52, ease: "none" });
            }
        });

        if (progressFill) {
            ScrollTrigger.create({
                trigger: sectionTrack,
                scroller,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    gsap.set(progressFill, { scaleY: self.progress });
                },
                invalidateOnRefresh: true,
            });
        }
    }, {
        scope: pageRef,
        dependencies: [reduceMotion],
        revertOnUpdate: true,
    });

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        lenisRef.current?.resize();
        return () => window.cancelAnimationFrame(frame);
    }, [lenisRef, openFounders]);

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
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeInOut" }}
            className="relative h-[100dvh] w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-y-contain selection:bg-[var(--color-theme-primary)] selection:text-[var(--color-theme-bg)]"
            style={themeStyles}
        >
            <div
                className="fixed inset-0 -z-30"
                style={{
                    background: `linear-gradient(135deg, ${pageTheme.bg} 0%, ${pageTheme.bg} 68%, #1a0f0f 100%)`,
                }}
            />

            {sections.map((section) => (
                <img
                    key={section.id}
                    data-about-background
                    src={section.image}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none fixed inset-0 -z-20 h-[110%] w-full object-cover brightness-50 will-change-transform"
                />
            ))}

            <div
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 38%, var(--color-theme-bg) 100%)",
                }}
            />

            <Navbar compactMobile />

            <nav
                aria-label="About sections"
                className="pointer-events-none fixed bottom-0 left-36 top-0 z-30 hidden items-center lg:flex xl:left-44"
            >
                <div className="relative h-[48vh] w-px bg-white/10">
                    <div
                        ref={progressFillRef}
                        className="absolute inset-x-0 top-0 h-full bg-[var(--color-theme-primary)]"
                    />
                    {sections.map((section, index) => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => scrollToSection(index)}
                            aria-label={`Scroll to ${section.title}`}
                            aria-current={activeIndex === index ? "step" : undefined}
                            className={`pointer-events-auto absolute left-0 flex cursor-pointer items-center transition-opacity duration-300 ${
                                activeIndex === index ? "opacity-100" : "opacity-35 hover:opacity-100"
                            }`}
                            style={{ top: `${(index / sectionCount) * 100}%` }}
                        >
                            <span className="-ml-[4px] h-2 w-2 rounded-full bg-[var(--color-theme-primary)]" />
                            <span className="absolute right-6 whitespace-nowrap text-right font-display text-base italic tracking-[0.1em] text-[var(--color-theme-primary)]">
                                {section.title}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>

            <main ref={sectionsRef} className="w-full max-w-full overflow-x-hidden">
                {sections.map((section, index) => (
                    <section
                        key={section.id}
                        data-about-index={index}
                        aria-labelledby={`${section.id}-heading`}
                        className={`relative flex min-h-[100dvh] w-full flex-col px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-32 lg:py-28 ${
                            index === sections.length - 1 ? "justify-between pb-0 sm:pb-0" : "justify-center"
                        }`}
                    >
                        <div
                            data-about-content
                            className={`mx-auto w-full max-w-5xl ${
                                index === 0
                                    ? "flex flex-1 flex-col items-center justify-center text-center"
                                    : "grid grid-cols-1 items-center gap-9 lg:grid-cols-[0.78fr_1fr] lg:gap-16"
                            }`}
                        >
                            <div className={index === 0 ? "max-w-5xl" : "max-w-xl"}>
                                {index === 0 ? (
                                    <h1
                                        id={`${section.id}-heading`}
                                        className="mb-6 font-display text-5xl leading-none tracking-wide text-white/95 italic sm:text-6xl lg:text-7xl"
                                    >
                                        {section.title}
                                    </h1>
                                ) : (
                                    <h2
                                        id={`${section.id}-heading`}
                                        className="mb-6 font-display text-4xl leading-none tracking-wide text-white/95 italic sm:text-5xl lg:text-6xl"
                                    >
                                        {section.title}
                                    </h2>
                                )}
                                <p className="font-body text-xs font-light leading-relaxed tracking-[0.08em] text-[var(--color-theme-secondary)]/70 uppercase italic sm:text-sm md:text-base md:tracking-[0.1em]">
                                    {section.body}
                                </p>
                            </div>

                            {section.founders ? (
                                <div className="grid grid-cols-1 gap-2">
                                    {section.founders.map((founder) => (
                                        <article
                                            key={founder.name}
                                            className="border-b border-white/10 transition-colors duration-500 hover:border-[var(--color-theme-primary)]/45"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleFounder(founder.name)}
                                                aria-expanded={Boolean(openFounders[founder.name])}
                                                className="group flex min-h-20 w-full cursor-pointer items-center justify-between gap-5 py-4 text-left sm:py-5"
                                            >
                                                <span>
                                                    <span className="mb-2 block font-body text-[11px] tracking-[0.2em] text-[var(--color-theme-primary)] uppercase sm:tracking-[0.28em] md:text-xs">
                                                        {founder.role}
                                                    </span>
                                                    <span className="block font-display text-3xl tracking-wide text-white/90 italic md:text-4xl">
                                                        {founder.name}
                                                    </span>
                                                </span>
                                                <span
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-xl text-[var(--color-theme-primary)] transition-all duration-300 group-hover:border-[var(--color-theme-primary)]/55 ${
                                                        openFounders[founder.name] ? "rotate-45 bg-white/5" : ""
                                                    }`}
                                                    aria-hidden="true"
                                                >
                                                    +
                                                </span>
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {openFounders[founder.name] && (
                                                    <motion.div
                                                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.65, 0, 0.35, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <p className="pb-6 font-body text-sm font-light leading-relaxed text-white/65 md:text-base">
                                                            {founder.bio}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </article>
                                    ))}
                                </div>
                            ) : section.communityImages ? (
                                <div
                                    data-about-media
                                    className="grid w-full max-w-md grid-cols-3 items-center justify-items-center gap-4 overflow-hidden sm:gap-6 lg:max-w-lg lg:justify-self-end lg:gap-8"
                                >
                                    {section.communityImages.map((image, imageIndex) => (
                                        <img
                                            key={image}
                                            src={image}
                                            alt=""
                                            aria-hidden="true"
                                            className={`h-20 w-full max-w-[6.5rem] object-contain opacity-80 transition-[filter,opacity,transform] duration-500 hover:scale-105 hover:opacity-100 sm:h-24 sm:max-w-[8rem] lg:h-36 lg:max-w-[10rem] ${
                                                imageIndex === 1 ? "" : "grayscale hover:grayscale-0"
                                            }`}
                                        />
                                    ))}
                                </div>
                            ) : index > 0 ? (
                                <div
                                    data-about-media
                                    className="group w-full overflow-hidden border border-white/10 bg-black/10 lg:max-w-sm lg:justify-self-end"
                                >
                                    <img
                                        src={section.image}
                                        alt={section.imageAlt}
                                        className="aspect-[16/10] w-full object-cover brightness-75 transition-transform duration-700 ease-out group-hover:scale-105 lg:aspect-[4/5]"
                                    />
                                </div>
                            ) : null}
                        </div>

                        {index === sections.length - 1 && (
                            <div className="relative z-20 mt-16 w-full shrink-0">
                                <Footer embedded />
                            </div>
                        )}
                    </section>
                ))}
            </main>
        </motion.div>
    );
}
