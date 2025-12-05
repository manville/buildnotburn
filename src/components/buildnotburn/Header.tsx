import type { FC } from 'react';

export const Header: FC = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-16 sm:pt-24 pb-12 text-center select-none">
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
      <p className="font-code text-muted-foreground mt-4 text-sm sm:text-base">
        A Lucee/CFML & HTMX Demo, Reimagined in Next.js.
      </p>
    </header>
  );
};
