import { useEffect, useRef, useState } from "react";
import LinkBar from "../components/LinkBar";
import Navbar from "../components/Navbar";
import "../index.css";
import Footer from "../components/Footer";

export default function Home() {
    const bgImgRef = useRef<HTMLImageElement>(null);
    const [loading, setLoading] = useState(true);
    const [sliding, setSliding] = useState(false);

    useEffect(() => {
        const slideTimeout = setTimeout(() => {
            setSliding(true);
        }, 1500);

        const removeTimeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => {
            clearTimeout(slideTimeout);
            clearTimeout(removeTimeout);
        };
    }, []);

    return (
        <div className="relative overflow-hidden">
            {loading && (
                <div
                    className={`fixed inset-0 z-50 flex justify-center items-center bg-[#ffe6ac] transition-transform duration-500 ${sliding ? '-translate-y-full' : 'translate-y-0'
                        }`}
                >
                    <div className="relative flex items-center justify-center">
                        {/* Rectangular progress ring */}
                        <svg className="absolute" width="380" height="380" viewBox="0 0 380 380">
                            {/* Background rectangle */}
                            <rect
                                x="2" y="2" width="376" height="376"
                                fill="none"
                                stroke="#e5c97a"
                                strokeWidth="3"
                            />
                            {/* Animated fill rectangle */}
                            <rect
                                x="2" y="2" width="376" height="376"
                                fill="none"
                                stroke="#a07830"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="1504"
                                strokeDashoffset="1504"
                                style={{
                                    animation: 'fillCircle 1.4s ease-out forwards',
                                }}
                            />
                        </svg>
                        <img src="src/assets/artisanal_logo_high_res_nobg.jpeg" className="h-80 w-80 object-contain" />
                    </div>
                </div>
            )}
            <img
                src="/assets/artisanal_full_restraunt_pic.jpg"
                ref={bgImgRef}
                className="w-screen scale-130 absolute top-0 -z-4 brightness-50 transition-all duration-1000"
            />
            {/* Fade overlay */}
            <div className="absolute top-0 left-0 w-full h-screen -z-4 pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, transparent 70%, #2a230f 100%)'
                }}
            />
            <Navbar />
            <div className="flex flex-col gap-5 justify-center items-center h-screen">
                <img src='src/assets/artisanal_logo_high_res_nobg.jpeg' className="h-30" />
                <LinkBar />
            </div>
            <Footer />
        </div>
    );
}