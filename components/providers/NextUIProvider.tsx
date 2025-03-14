"use client";

import React, { useEffect } from "react";

// This wrapper component provides dark theme support
export function NordvikUIProvider({ children }: { children: React.ReactNode }) {
  // Use effect to apply the dark theme after hydration
  useEffect(() => {
    // Apply dark theme directly to HTML element
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);
  
  return <>{children}</>;
}

export default NordvikUIProvider;
