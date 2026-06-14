import { useUI } from '../context/UIContext';

type FooterProps = {
    embedded?: boolean;
};

export default function Footer({ embedded = false }: FooterProps) {
    const { toggleSiteMap } = useUI();

    return (
        <footer
            className={`relative text-white/65 transition-all duration-500 ${
                embedded
                    ? 'min-h-20 flex items-center bg-transparent px-4 md:px-16'
                    : 'h-24 flex items-center bg-transparent px-4 md:px-16'
            }`}
        >
            <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 min-w-0">
                <div className="flex flex-row items-center justify-center gap-3 md:gap-6 min-w-0 whitespace-nowrap">
                    <p className="font-body text-[9px] md:text-xs tracking-[0.16em] text-white/55 uppercase truncate">
                        © 2026 ARTISANAL | ALL RIGHTS RESERVED
                    </p>
                    <div className="w-px h-3 bg-[var(--color-theme-primary,#dac464)]/25 shrink-0" />
                    <button 
                        onClick={toggleSiteMap}
                        className="font-body text-[9px] md:text-xs tracking-[0.22em] text-[var(--color-theme-secondary,#ffe6ac)]/70 hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300 uppercase cursor-pointer shrink-0"
                    >
                        Site Map
                    </button>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:block w-10 h-px bg-[var(--color-theme-primary,#dac464)]/25" />
                    <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="text-[var(--color-theme-secondary,#ffe6ac)]/55 hover:text-[var(--color-theme-primary,#dac464)] transition-all duration-300 hover:scale-110"
                    >
                        <InstagramIcon />
                    </a>
                </div>
            </div>
        </footer>
    );
}

function InstagramIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18" 
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
    );
}
