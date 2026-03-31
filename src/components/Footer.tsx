export default function Footer() {
    return (
        <div className="flex flex-col justify-end items-center gap-5 py-10 bg-[#2a230f] text-white h-[40vh]">
            <div className="grid grid-cols-3 gap-10 w-screen">
                <div className="flex flex-col justify-center p-7">
                    <h1 className="text-2xl font-display">Artisanal Restaurant</h1>
                    <div className="w-10 h-0.5 border border-solid border-white"></div>
                    <p className="mt-3 font-display">828-898-5395</p>
                    <p className="font-display">1200 Dobbins Rd, Banner Elk, NC 28604</p>

                    <h1 className="text-2xl font-display mt-6">Hours of Operation</h1>
                    <div className="w-10 h-0.5 border border-solid border-white"></div>
                    <p className="mt-3 font-display">Tuesday - Saturday: 5:00 pm-9:30pm, by reservation</p>
                    <p className="font-display">Sunday & Monday: Closed</p>
                </div>

                {/* Center - Nav Links */}
                <div className="flex flex-col justify-center items-center gap-3">
                    <h1 className="text-2xl font-display">Explore</h1>
                    <div className="w-10 h-0.5 border border-solid border-white mb-1"></div>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                        <a href="/" className="font-display text-white/80 hover:text-[#dac464] transition-colors duration-300">Home</a>
                        <a href="/menu" className="font-display text-white/80 hover:text-[#dac464] transition-colors duration-300">Menu</a>
                        <a href="/about" className="font-display text-white/80 hover:text-[#dac464] transition-colors duration-300">About</a>
                        <a href="/private-events" className="font-display text-white/80 hover:text-[#dac464] transition-colors duration-300">Private Events</a>
                        <a href="/faq" className="font-display text-white/80 hover:text-[#dac464] transition-colors duration-300">FAQ</a>
                        <a href="/gift-cards" className="font-display text-white/80 hover:text-[#dac464] transition-colors duration-300">Gift Cards</a>
                        <a href="/reservations" className="font-display text-white/80 hover:text-[#dac464] transition-colors duration-300">Reservations</a>
                        <a href="/contact" className="font-display text-white/80 hover:text-[#dac464] transition-colors duration-300">Contact</a>
                    </div>
                </div>

                {/* Right - Social & Reserve */}
                <div className="flex flex-col justify-center items-center p-7 gap-3">
                    <div className="flex flex-row gap-4 items-center">
                        <img src='src\assets\artisanal_logo_high_res(2)_txtwhite.jpeg' className="h-10" />
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-3">
                <h2 className="text-sm font-display">© Copyright 2026 | Website Powered by Krish Sapovadia + Marketing | All Rights Reserved | </h2><InstagramIcon scale={0.7} />
            </div>
        </div>
    );
}

function InstagramIcon({ scale = 1 }: { scale?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={24*scale} height={24*scale}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/80 hover:text-[#dac464] transition-colors duration-300 cursor-pointer"
        >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
    );
}