export default function LinkBar() {
    const links = {
        "Home": "/",
        "Menu": "/menu",
        "About": "/",
    }

    return (
        <div className="flex justify-center items-center gap-6 py-10">
            {Object.entries(links).map(([name, url]) => (
                <div key={name} className="flex items-center gap-6">
                    <a 
                        href={url} 
                        className="inline-block text-7xl font-display text-[var(--color-theme-secondary)] transition-all duration-500 ease-out hover:text-[var(--color-theme-primary)] hover:scale-110"
                    >
                        {name}
                    </a>
                    <span className="w-2 h-2 bg-[var(--color-theme-primary)] rounded-full transition-colors duration-500"></span>
                </div>
            ))}
            <div className="flex items-center gap-6">
                <a
                    href="/"
                    className="inline-block text-7xl font-display text-[var(--color-theme-secondary)] transition-all duration-500 ease-out hover:text-[var(--color-theme-primary)] hover:scale-110"
                >
                    Contact
                </a>
            </div>
        </div>
    );
}