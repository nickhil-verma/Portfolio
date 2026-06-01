"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Bypass smooth scrolling on admin routes and the main route page (/)
    if (pathname === "/" || (pathname && pathname.startsWith("/admin"))) {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-scrolling");
        document.documentElement.style.scrollBehavior = "auto";
      }
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo curve
      smoothWheel: true,
      syncTouch: false,
    });

    let frameId;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    // Clean up animation frames and lenis instances on unmount
    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
