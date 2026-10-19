"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function FrameReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = ref.current?.querySelector<HTMLElement>("img, video");
      if (!media) return;

      gsap.set(media, { scale: 1.12 });

      const play = () => {
        gsap.to(media, {
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "transform",
          overwrite: "auto",
        });
      };

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 92%",
        once: true,
        onEnter: play,
        onRefresh(self) {
          if (self.progress > 0 || self.isActive) {
            gsap.set(media, { scale: 1, clearProps: "transform" });
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
