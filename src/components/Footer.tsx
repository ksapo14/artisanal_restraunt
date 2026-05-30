import txtWite from '../assets/artisanal_logo_high_res(2)_txtwhite.jpeg';

export default function Footer() {
    return (
        <footer className="relative bg-[var(--color-theme-bg)] text-[var(--color-theme-secondary)]/80 py-10 md:py-12 transition-all duration-500">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Logo Row */}
                <div className="mb-8">
                    <img 
                        src={txtWite} 
                        alt="Artisanal Logo" 
                        className="h-10 object-contain opacity-90 transition-opacity hover:opacity-100 duration-300" 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/5">
                    {/* Location & Contact Section */}
                    <div className="md:col-span-4 flex flex-col items-start space-y-4">
                        <h3 className="font-display text-xl italic font-light text-[var(--color-theme-primary)] tracking-wide transition-colors duration-500">Location & Contact</h3>
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
                    <div className="md:col-span-4 flex flex-col items-start space-y-4">
                        <h3 className="font-display text-xl italic font-light text-[var(--color-theme-primary)] tracking-wide transition-colors duration-500">Hours of Operation</h3>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div>
                                <p className="font-body text-[9px] font-semibold text-white/40 uppercase tracking-widest">Tuesday – Saturday</p>
                                <p className="font-display text-lg font-light text-white/90 mt-0.5">5:00 pm – 9:30 pm</p>
                                <p className="font-display text-xs text-[var(--color-theme-primary)]/80 italic mt-0.5 font-light transition-colors duration-500">By reservation only</p>
                            </div>
                            <div>
                                <p className="font-body text-[9px] font-semibold text-white/40 uppercase tracking-widest">Sunday & Monday</p>
                                <p className="font-display text-lg font-light text-white/50 mt-0.5">Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div className="md:col-span-4 flex flex-col items-start space-y-4">
                        <h3 className="font-display text-xl italic font-light text-[var(--color-theme-primary)] tracking-wide transition-colors duration-500">Explore</h3>
                        <nav className="grid grid-cols-2 gap-y-2 gap-x-4 w-full">
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
                                <a 
                                    key={link.name}
                                    href={link.url} 
                                    className="font-display text-base font-light text-white/70 hover:text-[var(--color-theme-primary)] hover:scale-105 transition-all duration-300 ease-out inline-block tracking-wide"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
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