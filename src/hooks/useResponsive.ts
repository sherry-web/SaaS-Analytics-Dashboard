import { useState, useEffect } from "react";

export interface ResponsiveConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
}

// ✅ Enhanced: SSR-safe implementation with proper typing
export function useResponsive(): ResponsiveConfig {
  // ✅ Safe default for SSR
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    // ✅ Only run in browser environment
    if (typeof window === "undefined") return;

    const handleResize = () => setScreenWidth(window.innerWidth);
    
    window.addEventListener("resize", handleResize);
    
    // ✅ Cleanup function
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Responsive breakpoints
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  return { isMobile, isTablet, isDesktop, screenWidth };
}