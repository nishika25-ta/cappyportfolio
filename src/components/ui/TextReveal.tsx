"use client";

import { createElement, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const tags = ["h2", "h3", "p", "span"] as const;

export function TextReveal({
  text,
  as = "p",
  className,
}: {
  text: string;
  as?: (typeof tags)[number];
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll<HTMLElement>(".reveal-word");
      if (!words?.length || !ref.current) return;

      gsap.set(words, { yPercent: 120 });

      const play = () => {
        gsap.to(words, {
          yPercent: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.045,
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
            gsap.set(words, { yPercent: 0 });
          }
        },
      });
    },
    { scope: ref },
  );

  const content: ReactNode[] = text.split(/(\s+)/).map((part, index) =>
    part.trim() === "" ? (
      part
    ) : (
      <span
        key={`${part}-${index}`}
        className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
      >
        <span className="reveal-word inline-block">{part}</span>
      </span>
    ),
  );

  return createElement(as, { ref, className }, content);
}
