import React from 'react';
import { cn } from '@/lib/utils';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn(className, 'relative flex items-center justify-center')}>
         <svg 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--primary)/0.7)]"
        >
            <defs>
                <linearGradient id="crystal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.5}} />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            {/* Crystal Flame Shape */}
            <g fill="url(#crystal-gradient)" stroke="hsl(var(--primary))" strokeWidth="0.5" style={{opacity: 0.8}}>
                <path d="M50 0 L60 20 L75 15 L70 35 L85 40 L70 50 L80 65 L65 60 L60 75 L50 90 L40 75 L35 60 L20 65 L30 50 L15 40 L30 35 L25 15 L40 20 Z" />
                <path d="M50 90 L50 100 L45 95 Z" fill="hsl(var(--primary))" />
                <path d="M50 90 L50 100 L55 95 Z" fill="hsl(var(--primary))" />
            </g>

            {/* Inner polygons for facets */}
            <g fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" style={{opacity: 0.9}}>
                <path d="M50 0 L60 20 L40 20 Z" />
                <path d="M60 20 L75 15 L70 35 L65 60 Z" />
                <path d="M40 20 L25 15 L30 35 L35 60 Z" />
                <path d="M70 35 L85 40 L70 50 L80 65 L65 60 Z" />
                <path d="M30 35 L15 40 L30 50 L20 65 L35 60 Z" />
                <path d="M60 75 L50 90 L40 75 L50 70 Z" />
            </g>

            {/* Central Brick */}
            <g transform="translate(35, 40) rotate(-10)">
                <path 
                    d="M10 0 L30 5 L30 15 L10 10 Z" 
                    fill="hsl(var(--background))" 
                    stroke="hsl(var(--card))" 
                    strokeWidth="1"
                />
                <path 
                    d="M10 10 L30 15 L30 25 L10 20 Z" 
                    fill="hsl(var(--card))" 
                    stroke="hsl(var(--border))" 
                    strokeWidth="1"
                />
                 <path 
                    d="M10 0 L10 10 L10 20 L0 15 L0 5 Z" 
                    fill="hsl(var(--secondary))" 
                    stroke="hsl(var(--border))" 
                    strokeWidth="1"
                />
            </g>
        </svg>
    </div>
);
