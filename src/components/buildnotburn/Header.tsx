import type { FC } from 'react';

const Logo: FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={className}
        aria-hidden="true"
    >
        <path
            fill="hsl(var(--foreground))"
            d="M50 0C30 15 20 30 20 50c0 25 20 50 30 50s30-25 30-50C80 30 70 15 50 0zm0 85c-10 0-20-15-20-35S40 15 50 15s20 15 20 35-10 35-20 35z"
            transform="scale(1.2) translate(-8.3, -5)"
        />
        <g transform="translate(5, 5)">
            <path
                fill="hsl(var(--primary))"
                d="M50 45 L30 55 L70 55 Z"
            />
            <path
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="3"
                d="M30 56 L30 68 L70 68 L70 56 Z M25 69 L25 81 L75 81 L75 69 Z"
            />
             <path
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth="3"
                d="M50 45 L30 55 L70 55 Z M30 56 L30 68 L70 68 L70 56 Z M25 69 L25 81 L75 81 L75 69 Z"
            />
        </g>
    </svg>
);


export const Header: FC = () => {
    return (
        <header className="flex flex-col items-center justify-center pt-16 sm:pt-24 pb-12 text-center select-none">
            <div className="flex items-center justify-center gap-4">
                <Logo className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-primary" />
                <div className="font-headline font-bold uppercase tracking-wider text-5xl sm:text-7xl lg:text-8xl leading-none">
                    <h1 className="sr-only">Build. Not, Burn.</h1>
                    <div aria-hidden="true" className="relative">
                        <div className="flex flex-col items-center">
                            <span>BUILD.</span>
                            <span className="mt-1">BURN.</span>
                        </div>
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl sm:text-2xl lg:text-3xl text-primary">NOT,</span>
                    </div>
                </div>
            </div>
            <p className="font-code text-muted-foreground mt-4 text-sm sm:text-base">
                A Lucee/CFML & HTMX Demo, Reimagined in Next.js.
            </p>
        </header>
    );
};
