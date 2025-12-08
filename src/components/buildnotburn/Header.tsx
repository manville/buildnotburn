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
import { PlaceHolderImages } from '@/lib/placeholder-images';


const logoImage = PlaceHolderImages.find(p => p.id === 'logo');

const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn(className, 'relative flex items-center justify-center')}>
        {logoImage && (
            <Image 
                src={logoImage.imageUrl}
                alt="BuildNotBurn Logo"
                width={192}
                height={192}
                className="drop-shadow-[0_0_8px_hsl(var(--primary)/0.7)]"
                priority
                data-ai-hint={logoImage.aiHint}
            />
        )}
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
