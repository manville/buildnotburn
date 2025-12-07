
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/buildnotburn/Header";
import type { Brick } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getTodayString, getYesterdayString, generateMockWallBricks } from "@/lib/mock-data";
import { GuideModal } from "@/components/buildnotburn/GuideModal";
import { SignInModal } from "@/components/buildnotburn/SignInModal";
import type { User } from 'firebase/auth';
import { Wall } from "@/components/buildnotburn/Wall";
import { ThemeSwitcher } from "@/components/buildnotburn/ThemeSwitcher";
import Link from "next/link";
import { Paywall } from "@/components/buildnotburn/Paywall";


type AppState = 'loading' | 'paywall' | 'audit' | 'building';
type Plan = 'trial' | 'builder' | 'architect';

export function BuildNotBurnApp() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [mockWallBricks, setMockWallBricks] = useState<Brick[]>([]);

  useEffect(() => {
    setMockWallBricks(generateMockWallBricks());
  }, []);

  const handleLogout = async () => {
    // Firebase signout logic will be re-added here
    setUser(null);
    setAppState('paywall');
  };

  const handleGuideClose = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setIsGuideOpen(false);
  };
  
  const isPaidUser = plan === 'builder' || plan === 'architect';

  return (
    <>
      <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
        <Header user={user} plan={plan} onLogout={handleLogout} onOpenGuide={() => setIsGuideOpen(true)} onSignIn={() => setIsSignInModalOpen(true)} />
        <div className="w-full flex-grow">
           {appState === 'loading' && <div className="text-center font-code text-muted-foreground">LOADING SYSTEM...</div>}
           {appState !== 'loading' && (
            <Paywall 
              variantIds={{
                  newsletter: process.env.NEXT_PUBLIC_LEMONSQUEEZY_NEWSLETTER_VARIANT_ID!,
                  builderMonthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_MONTHLY_VARIANT_ID!,
                  builderAnnually: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_ANNUALLY_VARIANT_ID!,
                  architectMonthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_MONTHLY_VARIANT_ID!,
                  architectAnnually: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_ANNUALLY_VARIANT_ID!,
              }}
            />
           )}
        </div>
        <Wall bricks={mockWallBricks} />
        <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50 flex flex-col items-center gap-8">
          <ThemeSwitcher />
          <div className="flex items-center justify-center gap-4">
              <Link href="https://withcabin.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacy</Link>
              {isPaidUser && <button onClick={() => setIsGuideOpen(true)} className="hover:text-primary transition-colors">The Guide</button>}
              <Link href="mailto:support@buildnotburn.com" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div>
              <p>
              &copy; {new Date().getFullYear()} BuildNotBurn. All Systems Operational.
              </p>
              <p>The Sustainable System for Long-Term Creators.</p>
          </div>
        </footer>
        <GuideModal isOpen={isGuideOpen} onClose={handleGuideClose} />
      </main>
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  );
}
