"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.set(el, { y: 36, autoAlpha: 0 });

      const play = () => {
        gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out", overwrite: "auto" });
      };

      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: play,
        onRefresh(self) {
          if (self.progress > 0 || self.isActive) {
            gsap.set(el, { y: 0, autoAlpha: 1 });
          }
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
