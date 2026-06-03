import React, { createContext, useContext, useState } from 'react';

type UIContextType = {
    isSiteMapOpen: boolean;
    isMobile: boolean;
    toggleSiteMap: () => void;
    closeSiteMap: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isSiteMapOpen, setIsSiteMapOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);

    React.useEffect(() => {
        const mql = window.matchMedia('(max-width: 768px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    const toggleSiteMap = () => setIsSiteMapOpen(prev => !prev);
    const closeSiteMap = () => setIsSiteMapOpen(false);

    return (
        <UIContext.Provider value={{ isSiteMapOpen, isMobile, toggleSiteMap, closeSiteMap }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
