import { Link } from 'react-router';
import { createPortal } from 'react-dom';
import { useUI } from '../context/UIContext';

export default function SiteMap({ open }: { open: boolean }) {
    const { closeSiteMap } = useUI();

    const overlay = (
        <div
            onClick={closeSiteMap}
            className={`fixed inset-0 z-[900] transition-opacity duration-300 ease-out will-change-opacity ${
                open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div className="absolute inset-0 bg-black/90" />

            <div
                className={`relative z-10 flex h-full flex-col items-center justify-center pt-28 text-white transition-transform duration-300 ease-out will-change-transform transform-gpu ${
                    open ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'
                }`}
            >
                <div className="flex flex-col items-center gap-4 md:gap-5" onClick={(e) => e.stopPropagation()}>
                    <Link to="/" onClick={closeSiteMap} className="text-3xl md:text-4xl font-display hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300">Home</Link>
                    <Link to="/menu" onClick={closeSiteMap} className="text-3xl md:text-4xl font-display hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300">Menu</Link>
                    <Link to="/about" onClick={closeSiteMap} className="text-3xl md:text-4xl font-display hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300">About</Link>
                    <Link to="/private-events" onClick={closeSiteMap} className="text-3xl md:text-4xl font-display hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300">Private Events</Link>
                    <Link to="/faq" onClick={closeSiteMap} className="text-3xl md:text-4xl font-display hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300">FAQ</Link>
                    <Link to="/contact" onClick={closeSiteMap} className="text-3xl md:text-4xl font-display hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300">Gift Cards</Link>
                    <Link to="/contact" onClick={closeSiteMap} className="text-3xl md:text-4xl font-display hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300">Reservations</Link>
                    <Link to="/contact" onClick={closeSiteMap} className="text-3xl md:text-4xl font-display hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300">Contact</Link>
                </div>
            </div>
        </div>
    );

    return createPortal(overlay, document.body);
}
