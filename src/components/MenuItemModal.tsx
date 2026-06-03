import { useEffect } from "react";
import { motion } from "framer-motion";

export type MenuItemDetail = {
    name: string;
    description: string;
    price: string;
    image: string;
};

type MenuItemModalProps = {
    item: MenuItemDetail;
    sectionTitle: string;
    accentColor: string;
    onClose: () => void;
};

export default function MenuItemModal({ item, sectionTitle, accentColor, onClose }: MenuItemModalProps) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
        <motion.div
            className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <button
                type="button"
                aria-label="Close"
                className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
                onClick={onClose}
            />

            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="menu-item-title"
                className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center gap-8 md:gap-14 pointer-events-none"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
                <div className="pointer-events-auto w-full md:w-[48%] aspect-square max-h-[50vh] md:max-h-[65vh] overflow-hidden relative shrink-0">
                    <div className="absolute inset-0 border border-white/10 z-10" />
                    <img
                        src={item.image}
                        alt={item.name}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="pointer-events-auto flex flex-col items-center md:items-start text-center md:text-left w-full md:w-[52%]">
                    <p
                        className="font-body text-[10px] md:text-xs uppercase tracking-[0.35em] mb-4 italic"
                        style={{ color: accentColor }}
                    >
                        {sectionTitle}
                    </p>
                    <h2
                        id="menu-item-title"
                        className="font-display text-3xl md:text-5xl text-white/95 italic tracking-wide mb-5"
                    >
                        {item.name}
                    </h2>
                    <p className="font-body text-xs md:text-sm text-white/50 leading-relaxed font-light tracking-[0.12em] uppercase italic max-w-md mb-8">
                        {item.description}
                    </p>
                    <span
                        className="font-display text-2xl md:text-3xl italic tracking-widest"
                        style={{ color: accentColor }}
                    >
                        {item.price}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close menu item"
                    className="pointer-events-auto absolute -top-2 right-0 md:-top-4 md:-right-4 p-2 text-white/40 hover:text-white transition-colors duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </motion.div>
        </motion.div>
    );
}
