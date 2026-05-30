import { Link } from 'react-router';

export default function SiteMap({ open }: { open: boolean }) {
    return (
        <div className={`fixed inset-0 z-[80] transition-all duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
                {/* your sitemap links here */}
                <Link to="/" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Home</Link>
                <Link to="/menu" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Menu</Link>
                <Link to="/about" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">About</Link>
                <Link to="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Private Events</Link>
                <Link to="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">FAQ</Link>
                <Link to="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Gift Cards</Link>
                <Link to="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Reservations</Link>
                <Link to="/contact" className="text-4xl font-display mb-6 hover:text-[#dac464] transition-colors duration-300">Contact</Link>
            </div>
        </div>
    );
}