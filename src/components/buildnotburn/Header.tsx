
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
          d="M6.5 21V8.26321C6.5 7.15864 7.39543 6.26321 8.5 6.26321H13.6528C16.2051 6.26321 18.25 8.3081 18.25 10.8604C18.25 12.9325 16.892 14.7397 15.0114 15.3515C16.0353 15.639 16.75 16.6033 16.75 17.75C16.75 19.2688 15.5188 20.5 14 20.5L13.5 21H6.5Z"
      />
       <path 
          fill="hsl(var(--background))"
          stroke="hsl(var(--background))"
          strokeWidth="0.5"
          d="M9.5 17.5H13.5C14.3284 17.5 15 16.8284 15 16C15 15.1716 14.3284 14.5 13.5 14.5H9.5V17.5Z"
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

    
