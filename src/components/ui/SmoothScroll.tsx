"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function BindScrollTrigger() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    const frame = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", refresh);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        anchors: true,
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        respectReducedMotion: false,
      }}
    >
      <BindScrollTrigger />
      {children}
    </ReactLenis>
  );
}
