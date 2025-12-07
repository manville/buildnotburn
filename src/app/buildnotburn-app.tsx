
"use client";

import { Header } from "@/components/buildnotburn/Header";
import { ThemeSwitcher } from "@/components/buildnotburn/ThemeSwitcher";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerCrash } from "lucide-react";

export function BuildNotBurnApp() {
  return (
    <>
      <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
        <Header user={null} plan={null} onLogout={() => {}} onOpenGuide={() => {}} onSignIn={() => {}} />
        <div className="w-full flex-grow flex items-center justify-center">
            <Card className="max-w-md mx-auto my-8 border-destructive/50 bg-destructive/10 text-center">
                <CardHeader>
                    <div className="mx-auto w-fit rounded-full p-3 bg-destructive/20 text-destructive">
                        <ServerCrash className="h-10 w-10" />
                    </div>
                    <CardTitle className="font-headline text-3xl uppercase tracking-wider text-destructive">SYSTEM OFFLINE</CardTitle>
                    <CardDescription className="font-code text-xs text-destructive/80">Awaiting Corrective Action</CardDescription>
                </CardHeader>
                <CardContent className="font-code text-destructive/90">
                    <p>The application core has encountered a fatal error.</p>
                    <p className="mt-2">All dynamic systems have been taken offline to prevent cascading failures.</p>
                </CardContent>
            </Card>
        </div>
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
      </main>
    </>
  );
}
