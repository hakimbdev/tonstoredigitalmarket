"use client";

import { ReactNode } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

// Mock manifest URL - in production this would point to your actual manifest
const manifestUrl = "/tonconnect-manifest.json";

export function TonWalletProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
} 