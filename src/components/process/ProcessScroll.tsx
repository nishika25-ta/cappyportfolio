"use client";

import Image from "next/image";
import { useRef } from "react";
import { TextReveal } from "@/components/ui/TextReveal";
import { steps } from "@/data/process";
import { desktopQuery, gsap, mobileQuery, useGSAP } from "@/lib/gsap";

export function ProcessScroll() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();
      motion.add(desktopQuery, () => {
        const el = track.current;
        if (!el) return;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: true,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.35}`,
            invalidateOnRefresh: true,
          },
        });
        const captions = el.querySelectorAll(".step-caption");
        const numbers = el.querySelectorAll(".process-num");
        gsap.set(captions, { autoAlpha: 0, y: 28 });
        gsap.set(numbers, { autoAlpha: 0, yPercent: 16 });
        gsap.set([captions[0], numbers[0]], { autoAlpha: 1, y: 0, yPercent: 0 });
        tl.to(el, { x: () => -distance(), ease: "none", duration: 1 }, 0);
        tl.to(".process-cloud", { x: 220, ease: "none", duration: 1 }, 0);
        tl.to(".process-cloud-b", { x: -140, ease: "none", duration: 1 }, 0);
        numbers.forEach((number, index) => {
          if (index === 0) return;
          tl.to(number, { autoAlpha: 1, yPercent: 0, duration: 0.16, ease: "power2.out" }, index * 0.28);
        });
        captions.forEach((caption, index) => {
          if (index === 0) return;
          tl.to(caption, { autoAlpha: 1, y: 0, duration: 0.16, ease: "power2.out" }, index * 0.28 + 0.04);
        });
      });

      motion.add(mobileQuery, () => {
        gsap.utils.toArray<HTMLElement>(".process-num, .step-caption").forEach((item) => {
          gsap.from(item, {
            y: 32,
            autoAlpha: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div>
      <section
        ref={root}
        id="process"
        className="relative scroll-mt-6 overflow-hidden bg-white min-[768px]:h-screen"
      >
        <Image
          src="/images/landscapes/clouds.webp"
          alt=""
          width={1600}
          height={900}
          className="process-cloud pointer-events-none absolute -left-24 top-0 hidden w-[min(980px,78vw)] mix-blend-darken min-[768px]:block"
        />
        <Image
          src="/images/landscapes/clouds.webp"
          alt=""
          width={1600}
          height={900}
          className="process-cloud-b pointer-events-none absolute right-[6%] top-[34%] hidden w-[min(420px,34vw)] mix-blend-darken min-[768px]:block"
        />
        <div className="pointer-events-none relative z-10 px-5 pt-14 text-center sm:px-6 sm:pt-16 min-[768px]:absolute min-[768px]:inset-x-0 min-[768px]:top-[10vh] min-[768px]:pt-0">
          <p className="pointer-events-auto mx-auto inline-flex min-h-8 items-center rounded-full bg-[#eef3d4] px-3 text-xs font-medium text-[#3F5214]">
            How it works
          </p>
          <TextReveal
            as="h2"
            text="From the first message to the finished files."
            className="pointer-events-auto mx-auto mt-4 max-w-xl font-display text-[clamp(1.85rem,6.5vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink"
          />
        </div>

        <div
          ref={track}
          className="relative z-10 flex flex-col gap-10 px-5 pb-16 pt-10 sm:gap-14 sm:px-6 sm:pb-20 sm:pt-12 min-[768px]:h-full min-[768px]:w-max min-[768px]:flex-row min-[768px]:items-end min-[768px]:gap-0 min-[768px]:px-0 min-[768px]:pb-[8vh] min-[768px]:pt-0"
        >
          {steps.map((step) => (
            <article
              key={step.n}
              className="min-[768px]:flex min-[768px]:w-[58vw] min-[768px]:shrink-0 min-[768px]:items-end min-[768px]:gap-5 min-[768px]:pl-[5vw]"
            >
              <p
                className="process-num font-display leading-[0.76] tracking-[-0.08em]"
                style={{ color: step.color, fontSize: "clamp(5.5rem, 22vw, 20rem)" }}
              >
                {step.n}
              </p>
              <div className="step-caption max-w-[18rem] min-[768px]:mb-[2.5vh] min-[768px]:max-w-[16rem]">
                <h3 className="mt-2 font-display text-xl font-medium tracking-[-0.03em] text-ink sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#2c3128] min-[768px]:text-base">
                  {step.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <TextReveal
        text="Website projects are usually 50% to begin and 50% after you approve the final preview. Smaller résumé and photo orders can be paid in full up front, if we agree that before any work starts."
        className="mx-auto max-w-xl px-6 py-12 text-center text-sm leading-relaxed text-[#2c3128]"
      />
    </div>
  );
}
