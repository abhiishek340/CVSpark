"use client";

import { GlobalContextProvider } from "@/context/global-context";
import { ToastProvider } from "@/providers/toast-provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <GlobalContextProvider>
      <ToastProvider />
      <div id="root-container">
        {children}
      </div>
    </GlobalContextProvider>
  );
}
