
"use client";

import { Header } from "@/components/buildnotburn/Header";
import { GuideModal } from "@/components/buildnotburn/GuideModal";
import { SignInModal } from "@/components/buildnotburn/SignInModal";
import { Wall } from "@/components/buildnotburn/Wall";
import { ThemeSwitcher } from "@/components/buildnotburn/ThemeSwitcher";
import Link from "next/link";
import { useState } from "react";


export function BuildNotBurnApp() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <>
      <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
        <Header user={null} plan={null} onLogout={() => {}} onOpenGuide={() => setIsGuideOpen(true)} onSignIn={() => setIsSignInModalOpen(true)} />
        <div className="w-full flex-grow flex items-center justify-center">
           <div className="text-center font-code text-muted-foreground">SYSTEM OFFLINE // RE-INITIALIZING...</div>
        </div>
        <Wall bricks={[]} />
        <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50 flex flex-col items-center gap-8">
          <ThemeSwitcher />
          <div className="flex items-center justify-center gap-4">
              <Link href="https://withcabin.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="mailto:support@buildnotburn.com" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div>
              <p>
              &copy; {new Date().getFullYear()} BuildNotBurn. All Systems Operational.
              </p>
              <p>The Sustainable System for Long-Term Creators.</p>
          </div>
        </footer>
        <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      </main>
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  );
}
