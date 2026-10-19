"use client";

import Image from "next/image";
import { useRef } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { desktopQuery, gsap, mobileQuery, useGSAP } from "@/lib/gsap";
import { messages } from "@/lib/whatsapp";

export function Closing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add(desktopQuery, () => {
        const footer = root.current?.querySelector(".footer-slide");
        if (!footer) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: true,
            start: "top top",
            end: "+=130%",
            invalidateOnRefresh: true,
          },
        });
        tl.from(".close-card", { y: 48, autoAlpha: 0, duration: 0.4, ease: "power2.out" }, 0);
        tl.from(
          ".close-word",
          { yPercent: 120, stagger: 0.018, duration: 0.28, ease: "power2.out", immediateRender: true },
          0.06,
        );
        tl.to(".close-land", { scale: 1.14, duration: 1, ease: "none" }, 0);
        tl.fromTo(
          footer,
          { yPercent: 105 },
          { yPercent: 0, duration: 0.55, immediateRender: true },
          0.32,
        );
        tl.from(
          ".footer-mark",
          { scale: 0.12, autoAlpha: 0, duration: 0.32, ease: "back.out(1.7)", immediateRender: false },
          0.62,
        );
      });

      motion.add(mobileQuery, () => {
        gsap.from(".close-card", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        gsap.from(".close-word", {
          yPercent: 120,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: ".close-card", start: "top 78%", once: true },
        });
        gsap.from(".footer-slide", {
          y: 70,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: ".footer-slide", start: "top 92%", once: true },
        });
        gsap.from(".footer-mark", {
          scale: 0.2,
          autoAlpha: 0,
          duration: 0.7,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".footer-slide", start: "top 90%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="contact"
      className="relative min-h-[100svh] scroll-mt-6 min-[768px]:h-[100svh] min-[768px]:overflow-hidden"
    >
      <div className="close-land absolute inset-0 origin-center">
        <Image
          src="/images/landscapes/hero-night.webp"
          alt="Illustrated mountain lake at night."
          fill
          quality={95}
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 py-20 sm:px-5 sm:py-24">
      <div className="close-card w-full max-w-2xl rounded-[24px] border border-white/50 bg-white/80 px-5 py-9 text-center shadow-[0_20px_50px_rgba(10,20,40,0.18)] backdrop-blur-md sm:rounded-[28px] sm:bg-white/72 sm:px-6 sm:py-10 md:px-12 md:py-14">
        <p className="mx-auto inline-flex min-h-8 items-center rounded-full bg-[#eef3d4] px-3 text-xs font-medium text-[#3F5214]">
          Miri, Sarawak
        </p>
        <h2 className="mt-5 font-display text-[clamp(1.8rem,4vw,3rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink">
          {"Have something in mind? Let's make it happen.".split(/(\s+)/).map((part, index) =>
            part.trim() === "" ? (
              part
            ) : (
              <span key={`${part}-${index}`} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
                <span className="close-word inline-block">{part}</span>
              </span>
            ),
          )}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#2c3128]">
          {"Tell me what you're working on. I'll help you choose the right package.".split(/(\s+)/).map((part, index) =>
            part.trim() === "" ? (
              part
            ) : (
              <span key={`${part}-${index}`} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
                <span className="close-word inline-block">{part}</span>
              </span>
            ),
          )}
        </p>
        <WhatsAppLink message={messages.general} className="btn-olive mt-7">
          Chat on WhatsApp <span aria-hidden="true">↗</span>
        </WhatsAppLink>
      </div>
      </div>
      <div className="footer-slide relative z-20 min-[768px]:absolute min-[768px]:inset-x-0 min-[768px]:bottom-0 min-[768px]:min-h-[34vh]">
        <SiteFooter className="min-[768px]:flex min-[768px]:min-h-[34vh] min-[768px]:flex-col min-[768px]:justify-center" />
      </div>
    </section>
  );
}
