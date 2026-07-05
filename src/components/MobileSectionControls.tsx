type MobileSectionControlsProps = {
    previousLabel: string;
    nextLabel: string;
    previousDisabled: boolean;
    nextDisabled: boolean;
    onPrevious: () => void;
    onNext: () => void;
};

export default function MobileSectionControls({
    previousLabel,
    nextLabel,
    previousDisabled,
    nextDisabled,
    onPrevious,
    onNext,
}: MobileSectionControlsProps) {
    const buttonClass =
        "pointer-events-auto flex h-11 w-14 cursor-pointer items-center justify-center rounded-lg text-white/80 transition-[background-color,color,transform,opacity] duration-200 hover:bg-white/10 hover:text-white active:scale-95 disabled:cursor-default disabled:text-white/25 disabled:hover:bg-transparent disabled:active:scale-100";

    return (
        <div className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-1/2 z-50 flex -translate-x-1/2 items-center rounded-xl border border-white/10 bg-black/15 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-[2px] lg:hidden">
            <button
                type="button"
                onClick={onPrevious}
                disabled={previousDisabled}
                className={buttonClass}
                aria-label={previousLabel}
            >
                <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m7 14 5-5 5 5" />
                </svg>
            </button>
            <span className="h-6 w-px bg-white/15" aria-hidden="true" />
            <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                className={buttonClass}
                aria-label={nextLabel}
            >
                <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m7 10 5 5 5-5" />
                </svg>
            </button>
        </div>
    );
}
