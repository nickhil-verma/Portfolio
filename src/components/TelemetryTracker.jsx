"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TelemetryTracker() {
  const pathname = usePathname();
  const lastLoggedPath = useRef(null);

  useEffect(() => {
    // Avoid double logging on the same pathname during component re-renders
    if (lastLoggedPath.current === pathname) return;
    lastLoggedPath.current = pathname;

    const logVisit = async () => {
      try {
        // Skip analytics logging on localhost development
        const isLocalhost =
          typeof window !== "undefined" &&
          (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.hostname === "::1");

        if (!isLocalhost) {
          const payload = {
            route: pathname || "/",
            screenResolution: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "Unknown",
            windowSize: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown",
            language: typeof navigator !== "undefined" ? navigator.language : "Unknown",
            referrer: typeof document !== "undefined" ? (document.referrer || "Direct") : "Direct",
          };

          await fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      } catch (err) {
        console.error("Failed to log analytics visit:", err);
      }
    };

    logVisit();
  }, [pathname]);

  return null;
}
