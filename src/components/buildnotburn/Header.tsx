import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, LayoutDashboard, LogIn } from 'lucide-react';
import type { User } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';


const Logo: React.FC<{ className?: string }> = ({ className }) => (
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

interface HeaderProps {
    user: User | null;
    plan: 'trial' | 'builder' | 'architect' | null;
    onLogout: () => void;
    onOpenGuide: () => void;
    onSignIn: () => void;
}


export const Header: React.FC<HeaderProps> = ({ user, plan, onLogout, onOpenGuide, onSignIn }) => {
    const isPaidUser = plan === 'builder' || plan === 'architect';

    return (
        <>
            <header className="flex flex-col items-center justify-center pt-16 sm:pt-24 pb-12 text-center select-none relative">
                <div className="absolute top-4 right-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                    </p>
                                </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                   <Link href="/review">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Review</span>
                                   </Link>
                                </DropdownMenuItem>
                                {isPaidUser && (
                                     <DropdownMenuItem onClick={onOpenGuide}>
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        <span>The Guide</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="outline" onClick={onSignIn}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                        </Button>
                    )}
                </div>
                <div className="flex items-center justify-center gap-4">
                    <Logo className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
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
                <div className="flex flex-col items-center mt-4 space-y-2">
                    <p className="font-code text-muted-foreground text-sm sm:text-base">
                        The Sustainable System for Long-Term Creators.
                    </p>
                    {isPaidUser && (
                        <Button variant="link" onClick={onOpenGuide} className="text-primary/80 hover:text-primary">
                            <BookOpen className="mr-2 h-4 w-4"/>
                            Read The Guide
                        </Button>
                    )}
                </div>
            </header>
        </>
    );
};
