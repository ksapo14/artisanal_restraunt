import { useUI } from '../context/UIContext';

type FooterProps = {
    embedded?: boolean;
};

export default function Footer({ embedded = false }: FooterProps) {
    const { toggleSiteMap } = useUI();

    return (
        <footer
            className={`relative text-white/70 transition-all duration-500 ${
                embedded ? 'h-full flex items-center bg-transparent px-8 md:px-16' : 'py-8 bg-[#1c170a] px-8 md:px-16 border-t border-white/5'
            }`}
        >
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Left Side: Copyright & Site Map */}
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                    <p className="font-body text-[10px] md:text-xs tracking-wider opacity-60">
                        © 2026 ARTISANAL | ALL RIGHTS RESERVED
                    </p>
                    <div className="hidden md:block w-px h-3 bg-white/10" />
                    <button 
                        onClick={toggleSiteMap}
                        className="font-body text-[10px] md:text-xs tracking-widest hover:text-[var(--color-theme-primary)] transition-colors duration-300 uppercase opacity-60 hover:opacity-100 cursor-pointer"
                    >
                        Site Map
                    </button>
                </div>

                {/* Right Side: Social Media */}
                <div className="flex items-center gap-4">
                    <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="text-white/40 hover:text-[var(--color-theme-primary)] transition-all duration-300 hover:scale-110"
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