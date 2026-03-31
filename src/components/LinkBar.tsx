
export default function LinkBar() {
    const links = {
        "Home": "/",
        "Menu": "/",
        "About": "/",
        "Contact": "/",
    }

    return (
        <div className="flex justify-center items-center gap-3 py-5">
            <span className="w-2 h-2 bg-[#dac464] rounded-full"></span>
            {Object.entries(links).map(([name, url]) => (
                <>
                    <a href={url} className="text-4xl font-display transition-all duration-300 text-[#ffe6ac] relative hover:text-[#dac464] after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:bg-[#dac464]">{name}</a>
                    <span className="w-2 h-2 bg-[#dac464] rounded-full"></span>
                </>
            ))}
        </div>
    );
}