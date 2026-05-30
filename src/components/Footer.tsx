import { Link } from 'react-router';
import txtWite from '../assets/artisanal_logo_high_res(2)_txtwhite.jpeg';

type FooterProps = {
    embedded?: boolean;
};

export default function Footer({ embedded = false }: FooterProps) {
    return (
        <footer
            className={`relative text-[var(--color-theme-secondary)]/80 transition-all duration-500 ${
                embedded ? 'h-full py-5 md:py-6 bg-transparent' : 'py-10 md:py-12 bg-[var(--color-theme-bg)]'
            }`}
        >
            <div className={`max-w-7xl mx-auto h-full flex flex-col ${embedded ? 'px-6 md:px-12 justify-center' : 'px-6 md:px-12'}`}>
                {/* Logo Row */}
                <div className={embedded ? 'mb-4' : 'mb-8'}>
                    <img 
                        src={txtWite} 
                        alt="Artisanal Logo" 
                        className={`object-contain opacity-90 transition-opacity hover:opacity-100 duration-300 ${embedded ? 'h-7' : 'h-10'}`}
                    />
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-12 border-b border-white/5 ${embedded ? 'gap-4 pb-4' : 'gap-8 pb-8'}`}>
                    {/* Location & Contact Section */}
                    <div className={`md:col-span-4 flex flex-col items-start ${embedded ? 'space-y-2' : 'space-y-4'}`}>
                        <h3 className={`font-display italic font-light text-[var(--color-theme-primary)] tracking-wide transition-colors duration-500 ${embedded ? 'text-base' : 'text-xl'}`}>Location & Contact</h3>
                        <div className="space-y-1">
                            <p className="font-body text-xs font-light text-white/60 leading-relaxed tracking-wide">
                                1200 Dobbins Rd, Banner Elk, NC 28604
                            </p>
                            <a 
                                href="tel:8288985395" 
                                className="font-body text-xs font-medium text-white/60 hover:text-[var(--color-theme-primary)] transition-colors duration-300 inline-block tracking-wider"
                            >
                                828-898-5395
                            </a>
                        </div>
                    </div>

                    {/* Hours of Operation */}
                    <div className={`md:col-span-4 flex flex-col items-start ${embedded ? 'space-y-2' : 'space-y-4'}`}>
                        <h3 className={`font-display italic font-light text-[var(--color-theme-primary)] tracking-wide transition-colors duration-500 ${embedded ? 'text-base' : 'text-xl'}`}>Hours of Operation</h3>
                        <div className={`grid grid-cols-2 w-full ${embedded ? 'gap-2' : 'gap-4'}`}>
                            <div>
                                <p className="font-body text-[9px] font-semibold text-white/40 uppercase tracking-widest">Tuesday – Saturday</p>
                                <p className={`font-display font-light text-white/90 mt-0.5 ${embedded ? 'text-sm' : 'text-lg'}`}>5:00 pm – 9:30 pm</p>
                                <p className="font-display text-xs text-[var(--color-theme-primary)]/80 italic mt-0.5 font-light transition-colors duration-500">By reservation only</p>
                            </div>
                            <div>
                                <p className="font-body text-[9px] font-semibold text-white/40 uppercase tracking-widest">Sunday & Monday</p>
                                <p className={`font-display font-light text-white/50 mt-0.5 ${embedded ? 'text-sm' : 'text-lg'}`}>Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div className={`md:col-span-4 flex flex-col items-start ${embedded ? 'space-y-2' : 'space-y-4'}`}>
                        <h3 className={`font-display italic font-light text-[var(--color-theme-primary)] tracking-wide transition-colors duration-500 ${embedded ? 'text-base' : 'text-xl'}`}>Explore</h3>
                        <nav className={`grid grid-cols-2 w-full ${embedded ? 'gap-y-1 gap-x-3' : 'gap-y-2 gap-x-4'}`}>
                            {[
                                { name: "Home", url: "/" },
                                { name: "Menu", url: "/menu" },
                                { name: "About", url: "/about" },
                                { name: "Private Events", url: "/private-events" },
                                { name: "FAQ", url: "/faq" },
                                { name: "Gift Cards", url: "/gift-cards" },
                                { name: "Reservations", url: "/reservations" },
                                { name: "Contact", url: "/contact" }
                            ].map((link) => (
                                <Link 
                                    key={link.name}
                                    to={link.url} 
                                    className={`font-display font-light text-white/70 hover:text-[var(--color-theme-primary)] hover:scale-105 transition-all duration-300 ease-out inline-block tracking-wide ${embedded ? 'text-sm' : 'text-base'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className={`flex flex-col md:flex-row justify-between items-center ${embedded ? 'pt-3 gap-2' : 'pt-6 gap-4'}`}>
                    <p className="font-body text-xs font-light text-white/40 text-center md:text-left tracking-wider">
                        © Copyright 2026 | Website Powered by Krish Sapovadia + Marketing | All Rights Reserved
                    </p>
                    <div className="flex items-center">
                        <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="p-2 rounded-full bg-white/5 text-white/70 hover:text-[var(--color-theme-primary)] hover:bg-white/10 hover:scale-110 transition-all duration-300 flex items-center justify-center"
                        >
                            <InstagramIcon />
                        </a>
                    </div>
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