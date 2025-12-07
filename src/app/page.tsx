
"use client";

import { BuildNotBurnApp } from "@/app/buildnotburn-app";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function Home() {
  return (
    <FirebaseClientProvider>
      <BuildNotBurnApp />
    </FirebaseClientProvider>
  );
}
