import { useState } from 'react';
import SiteMap from './SiteMap';
import '../index.css';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [hovering, setHovering] = useState(false);

    return (
        <>
            <nav className="flex justify-between items-center w-screen absolute top-0 h-10 px-10 py-15 z-30">
                <a href="/">
                    <img src="src/assets/artisanal_logo_high_res(2)_txtwhite.jpeg" className="h-13" />
                </a>
                <div className='flex flex-row justify-between items-center gap-6'>
                    <button className="border-solid text-white border-white border px-6 py-4 font-display transition-all duration-300 hover:bg-[#dac464] hover:border-[#dac464] hover:text-black hover:rounded-4xl">RESERVE A TABLE</button>
                    <svg
                        viewBox="0 0 100 100"
                        width="40" height="40"
                        className="cursor-pointer"
                        onClick={() => setOpen(!open)}
                        onMouseEnter={() => setHovering(true)}
                        onMouseLeave={() => setHovering(false)}
                    >
                        <line
                            x1="20" y1="35" x2="80" y2="35"
                            stroke="white" strokeWidth="4" strokeLinecap="round"
                            style={{
                                transformBox: 'fill-box',
                                transformOrigin: 'center',
                                transform: open
                                    ? 'translateY(15px) rotate(45deg)'
                                    : hovering ? 'translateY(-3px)' : '',
                                transition: 'transform 0.35s ease',
                            }}
                        />
                        <line
                            x1="20" y1="65" x2="80" y2="65"
                            stroke="white" strokeWidth="4" strokeLinecap="round"
                            style={{
                                transformBox: 'fill-box',
                                transformOrigin: 'center',
                                transform: open
                                    ? 'translateY(-15px) rotate(-45deg)'
                                    : hovering ? 'translateY(3px)' : '',
                                transition: 'transform 0.35s ease',
                            }}
                        />
                    </svg>
                </div>
            </nav>

            <SiteMap open={open} />
        </>
    );
}