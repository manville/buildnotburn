
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
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
        <path 
            fill="hsl(var(--primary))" 
            stroke="hsl(var(--primary))"
            d="M12.35 2.2c.26.04.5.13.73.28 1.57.98 2.63 3.06 2.63 5.26 0 2.4-1.31 4.6-3.13 5.65a4.35 4.35 0 0 1-1.18.41c-.4.1-.8.1-1.2.01-.2-.05-.39-.12-.58-.21a3.42 3.42 0 0 0-2.07-2.07c-.1-.19-.17-.38-.21-.58-.1-.4-.1-.8.01-1.2.1-.4.28-.77.5-1.1.9-1.33 2.5-2.26 4.36-2.45Z"
        />
        <path 
            fill="currentColor"
            stroke="currentColor"
            d="M17.5 7.5c0 2.49-1.57 4.5-3.5 4.5S10.5 9.99 10.5 7.5 12.07 3 14 3s3.5 2.01 3.5 4.5ZM9.5 21.5c0-2.49 1.57-4.5 3.5-4.5s3.5 2.01 3.5 4.5-1.57 4.5-3.5 4.5-3.5-2.01-3.5-4.5Z" opacity="0.4"
        />
        <path 
            fill="hsl(var(--background))"
            d="M10.15 8.15h3.7v7.7h-3.7v-7.7Z"
        />
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

    
