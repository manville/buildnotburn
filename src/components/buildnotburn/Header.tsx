
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, LayoutDashboard } from 'lucide-react';
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


const Logo: React.FC<{ className?: string }> = ({ className }) => (
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

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onOpenGuide: () => void;
}


export const Header: React.FC<HeaderProps> = ({ user, onLogout, onOpenGuide }) => {
    return (
        <>
            <header className="flex flex-col items-center justify-center pt-16 sm:pt-24 pb-12 text-center select-none relative">
                {user && (
                    <div className="absolute top-4 right-4">
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
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
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
                <div className="flex flex-col items-center mt-4 space-y-2">
                    <p className="font-code text-muted-foreground text-sm sm:text-base">
                        The Sustainable System for Long-Term Creators.
                    </p>
                    <Button variant="link" onClick={onOpenGuide} className="text-primary/80 hover:text-primary">
                        <BookOpen className="mr-2 h-4 w-4"/>
                        Read The Guide
                    </Button>
                </div>
            </header>
        </>
    );
};

    