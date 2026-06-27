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
        "pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/75 backdrop-blur-md transition-colors duration-300 hover:border-white/35 hover:text-white disabled:cursor-default disabled:opacity-20";

    return (
        <div className="pointer-events-none fixed right-3 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2 lg:hidden">
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
                    strokeWidth="1.8"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 15 6-6 6 6" />
                </svg>
            </button>
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
                    strokeWidth="1.8"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
            </button>
        </div>
    );
}
