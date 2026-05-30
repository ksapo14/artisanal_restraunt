import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MenuItemModal, { type MenuItemDetail } from "../components/MenuItemModal";
import bgImg1 from '../assets/artisanal_full_restraunt_pic.jpg';
import bgImg2 from '../assets/restraunt_2.png';
import bgImg3 from '../assets/restraunt_3.png';

const menuData = [
    {
        title: "Starters",
        color: "#dac464",
        bg: "#1c170a",
        items: [
            { name: "Heirloom Tomato & Burrata", description: "Balsamic pearls, basil oil, artisanal sourdough toast.", price: "$18", image: bgImg1 },
            { name: "Crispy Octopus", description: "Smoked paprika, lemon herb aioli, Spanish chorizo.", price: "$22", image: bgImg2 },
            { name: "Truffle Mushroom Risotto", description: "Wild forest mushrooms, parmesan crisps, white truffle oil.", price: "$20", image: bgImg3 },
            { name: "Wagyu Beef Carpaccio", description: "Caper berries, baby arugula, freshly shaved horseradish.", price: "$24", image: bgImg1 },
        ]
    },
    {
        title: "Main Courses",
        color: "#a68a7b",
        bg: "#1b1412",
        items: [
            { name: "Pan-Seared Scallops", description: "Cauliflower silk, crispy pancetta, sage brown butter.", price: "$38", image: bgImg2 },
            { name: "Roasted Rack of Lamb", description: "Mint gremolata, glazed baby carrots, red wine reduction.", price: "$46", image: bgImg3 },
            { name: "Herb-Crusted Halibut", description: "Seasonal asparagus, lemon-caper beurre blanc.", price: "$42", image: bgImg1 },
            { name: "Dry-Aged Ribeye", description: "Roasted garlic confit, bone marrow butter, smoked sea salt.", price: "$58", image: bgImg2 },
        ]
    },
    {
        title: "Desserts",
        color: "#d48888",
        bg: "#1a0f0f",
        items: [
            { name: "Dark Chocolate Fondant", description: "Warm center, raspberry coulis, vanilla bean gelato.", price: "$14", image: bgImg3 },
            { name: "Lemon Yuzu Tart", description: "Toasted Italian meringue, citrus zest, buttery shortbread.", price: "$12", image: bgImg1 },
            { name: "Pistachio Panna Cotta", description: "Local honeycomb, candied pistachios, hint of rose water.", price: "$13", image: bgImg2 },
            { name: "Artisanal Cheese Board", description: "Selection of local cheeses, fig jam, artisanal crackers.", price: "$19", image: bgImg3 },
        ]
    }
];

type SelectedMenuItem = {
    item: MenuItemDetail;
    sectionTitle: string;
    accentColor: string;
};

export default function Menu() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState<SelectedMenuItem | null>(null);

    const nextSection = () => {
        if (activeIndex < menuData.length) {
            setActiveIndex(prev => prev + 1);
        }
    };

    const prevSection = () => {
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const FOOTER_SPLIT = 40; // % of viewport: desserts (top) + footer (bottom)
    const currentSection = activeIndex < menuData.length ? menuData[activeIndex] : menuData[menuData.length - 1];
    const isFooter = activeIndex === menuData.length;
    const displayIndex = isFooter ? menuData.length - 1 : activeIndex;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-screen w-screen overflow-hidden flex flex-col relative" 
            style={{ '--color-theme-primary': currentSection.color } as React.CSSProperties}
        >
            {/* Seamless Gradient Background */}
            <div 
                className="fixed inset-0 transition-all duration-1000 ease-in-out -z-10"
                style={{ 
                    background: isFooter ? currentSection.bg : `linear-gradient(135deg, ${currentSection.bg} 0%, ${currentSection.bg} 40%, ${menuData[(activeIndex + 1) % menuData.length].bg} 100%)`,
                    filter: 'brightness(1.2)'
                }}
            />
            
            <div className={`transition-all duration-700 ${activeIndex > 0 ? 'opacity-0 pointer-events-none -translate-y-10' : 'opacity-100'}`}>
                <Navbar />
            </div>
            
            <div className="flex-1 relative overflow-hidden">
                {/* Side nav — fixed between courses; shifts up only for footer reveal */}
                <div
                    className="absolute left-8 md:left-24 top-0 bottom-0 z-30 flex items-center pointer-events-none transition-transform duration-1000"
                    style={{ transform: isFooter ? `translateY(-${FOOTER_SPLIT}%)` : undefined }}
                >
                    <div className="relative h-[60vh] w-px bg-white/5">
                        <div 
                            className="absolute top-0 left-0 w-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                            style={{ 
                                height: `${displayIndex * (100 / (menuData.length - 1))}%`,
                                backgroundColor: currentSection.color 
                            }}
                        />
                        {menuData.map((section, idx) => (
                            <div 
                                key={idx} 
                                className={`absolute left-0 flex items-center transition-all duration-500 ease-out ${idx === displayIndex ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-90 pointer-events-none'}`}
                                style={{ top: `${(idx / (menuData.length - 1)) * 100}%` }}
                            >
                                <div 
                                    className="w-2 h-2 -ml-[4px] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                    style={{ backgroundColor: section.color }}
                                />
                                <span 
                                    className="ml-8 font-display text-lg md:text-2xl italic uppercase tracking-[0.4em] whitespace-nowrap" 
                                    style={{ color: section.color }}
                                >
                                    {section.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Sections - Organized Vertically on the Right */}
                <div 
                    className="h-full w-full transition-all duration-1000 ease-[cubic-bezier(0.19, 1, 0.22, 1)]"
                    style={{ transform: `translateY(-${isFooter ? (activeIndex - 1) * 100 + FOOTER_SPLIT : activeIndex * 100}%)` }}
                >
                    {menuData.map((section, sIdx) => (
                        <div key={sIdx} className="h-full w-full flex items-center justify-end px-6 md:px-32 pt-40 pb-32">
                            <div className="w-full md:w-1/2 flex flex-col gap-y-10 md:gap-y-14">
                                {section.items.map((item, iIdx) => (
                                    <div 
                                        key={iIdx} 
                                        role="button"
                                        tabIndex={sIdx === displayIndex ? 0 : -1}
                                        onClick={() => setSelectedItem({ item, sectionTitle: section.title, accentColor: section.color })}
                                        onKeyDown={(e) => e.key === "Enter" && setSelectedItem({ item, sectionTitle: section.title, accentColor: section.color })}
                                        className={`flex gap-6 md:gap-14 group cursor-pointer hover:scale-[1.04] transition-all duration-500 ease-out ${sIdx === displayIndex ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}
                                        style={{ transitionDelay: sIdx === displayIndex ? `${iIdx * 100}ms` : '0ms' }}
                                    >
                                        <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 overflow-hidden relative rounded-xs self-center">
                                            <div className="absolute inset-0 border border-white/5 z-10 transition-colors duration-500 group-hover:border-white/20" />
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                                        </div>
                                        <div className="flex flex-col justify-center border-b border-white/5 pb-6 w-full group-hover:border-white/10 transition-colors">
                                            <div className="flex justify-between items-baseline mb-3">
                                                <h3 className="font-display text-lg md:text-2xl text-white/90 group-hover:text-white transition-colors duration-300 tracking-wider">{item.name}</h3>
                                                <span className="font-body text-[10px] md:text-xs tracking-widest text-white/40 ml-4 font-light italic" style={{ color: sIdx === displayIndex ? section.color : '' }}>{item.price}</span>
                                            </div>
                                            <p className="font-body text-[10px] md:text-xs text-white/40 leading-relaxed font-light tracking-[0.1em] uppercase italic group-hover:text-white/60 transition-colors">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    {/* Footer — bottom half; desserts remain in top half */}
                    <div className="h-[50vh] w-full shrink-0 overflow-hidden">
                        <Footer embedded />
                    </div>
                </div>

                {/* Navigation Controls - Spanning Full Page on the Right */}
                <div className="absolute right-4 md:right-8 top-0 bottom-0 z-50 flex flex-col justify-between py-32 pointer-events-none">
                    <button 
                        onClick={prevSection}
                        disabled={activeIndex === 0}
                        className="group flex items-start justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 200" 
                            strokeWidth="1.5" 
                            stroke="currentColor" 
                            className="h-full w-8 md:w-10"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 200V4M12 4L5 11M12 4L19 11" />
                        </svg>
                    </button>
                    <button 
                        onClick={nextSection}
                        disabled={isFooter}
                        className="group flex items-end justify-center text-white/10 hover:text-white transition-all duration-700 disabled:opacity-0 cursor-pointer pointer-events-auto h-[30vh]"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 200" 
                            strokeWidth="1.5" 
                            stroke="currentColor" 
                            className="h-full w-8 md:w-10"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 0V196M12 196L5 189M12 196L19 189" />
                        </svg>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <MenuItemModal
                        item={selectedItem.item}
                        sectionTitle={selectedItem.sectionTitle}
                        accentColor={selectedItem.accentColor}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}
