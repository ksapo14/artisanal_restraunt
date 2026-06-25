import { Link } from 'react-router';
import { createPortal } from 'react-dom';
import { useUI } from '../context/UIContext';

const RESERVATION_URL = "https://www.opentable.com/booking/restref/availability?rid=44458&searchdatetime=2024-04-05T19%3A00&correlationId=555d2496-d57d-436f-9b78-c125559a78c0&restRef=44458&dateTime=2024-04-05T19%3A00&partySize=2";
const GIFT_CARD_URL = "https://order.toasttab.com/egiftcards/artisanal-restaurant-1200-dobbins-rd";
const linkClass = "flex min-h-14 w-full flex-1 items-center justify-center text-center text-3xl sm:text-4xl md:text-5xl font-display hover:text-[var(--color-theme-primary,#dac464)] transition-colors duration-300";

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
                className={`relative z-10 flex h-[100svh] flex-col items-center overflow-y-auto px-6 py-24 text-white transition-transform duration-300 ease-out will-change-transform transform-gpu sm:py-28 ${
                    open ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'
                }`}
            >
                <nav
                    aria-label="Site map"
                    className="flex min-h-[calc(100svh-12rem)] w-full max-w-xl flex-1 flex-col items-stretch justify-between gap-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Link to="/" onClick={closeSiteMap} className={linkClass}>Home</Link>
                    <Link to="/menu" onClick={closeSiteMap} className={linkClass}>Menu</Link>
                    <Link to="/about" onClick={closeSiteMap} className={linkClass}>About</Link>
                    <Link to="/private-events" onClick={closeSiteMap} className={linkClass}>Private Events</Link>
                    <Link to="/faq" onClick={closeSiteMap} className={linkClass}>FAQ</Link>
                    <a href={GIFT_CARD_URL} target="_blank" rel="noopener noreferrer" onClick={closeSiteMap} className={linkClass}>Gift Cards</a>
                    <a href={RESERVATION_URL} target="_blank" rel="noopener noreferrer" onClick={closeSiteMap} className={linkClass}>Reservations</a>
                    <Link to="/contact" onClick={closeSiteMap} className={linkClass}>Contact</Link>
                </nav>
            </div>
        </div>
    );

    return createPortal(overlay, document.body);
}
