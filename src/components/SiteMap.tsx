export default function SiteMap({ open }: { open: boolean }) {
    return (
        <div className={`fixed inset-0 z-20 transition-all duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
                {/* your sitemap links here */}
                <a href="/" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Home</a>
                <a href="/menu" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Menu</a>
                <a href="/about" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">About</a>
                <a href="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Private Events</a>
                <a href="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">FAQ</a>
                <a href="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Gift Cards</a>
                <a href="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Reservations</a>
                <a href="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Contact</a>
            </div>
        </div>
    );
}