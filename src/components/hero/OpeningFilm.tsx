"use client";

import Image from "next/image";
import { useRef } from "react";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { desktopQuery, gsap, mobileQuery, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { messages } from "@/lib/whatsapp";

const labels = ["Websites", "Résumés", "Food photos"];
const names = ["The Kitchen", "Smoky Grill", "Bloom & Basket"];

function HeroCopy() {
  return (
    <div className="hero-ui relative z-10 flex min-h-[100svh] flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="hero-nav flex justify-center px-4 pt-[max(1.25rem,env(safe-area-inset-top))] md:pt-8">
        <div className="flex max-w-full items-center gap-2 rounded-full bg-white py-1.5 pl-3 pr-1.5 shadow-[0_8px_30px_rgba(40,50,20,0.08)]">
          <Image
            src="/images/branding/cat.jpg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
          <span className="truncate pr-2 font-display text-[15px] font-medium tracking-[-0.03em] text-ink">
            {siteConfig.brandName}
          </span>
          <WhatsAppLink message={messages.general} className="btn-olive !min-h-11 shrink-0 px-4 text-sm">
            Let&apos;s talk
          </WhatsAppLink>
        </div>
      </div>
      <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center px-5 pt-[6vh] text-center sm:px-6 md:pt-[11vh]">
        <h1 className="font-display text-[clamp(2.15rem,8.2vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink">
          <span className="flex flex-wrap justify-center gap-x-[0.28em]">
            {["Small", "ideas."].map((word, index) => (
              <span key={word} className="inline-block overflow-hidden pb-1">
                {index > 0 ? " " : null}
                <span className="hero-word inline-block">{word}</span>
              </span>
            ))}
          </span>
          <span className="mt-1 flex flex-wrap justify-center gap-x-[0.28em] text-[#4A6014]">
            {["Beautifully", "brought", "to", "life."].map((word, index) => (
              <span key={word} className="inline-block overflow-hidden pb-1">
                {index > 0 ? " " : null}
                <span className="hero-word inline-block">{word}</span>
              </span>
            ))}
          </span>
        </h1>
        <div className="hero-rest w-full">
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#2c3128] md:mt-6 md:text-lg">
            Thoughtful websites, polished résumés and beautiful visuals for people building something of their own.
          </p>
          <div className="mt-7 flex w-full flex-col items-stretch gap-3 sm:mt-8 sm:items-center sm:justify-center sm:flex-row">
            <WhatsAppLink message={messages.general} className="btn-olive w-full sm:w-auto">
              Let&apos;s work together <span aria-hidden="true">↗</span>
            </WhatsAppLink>
            <a href="#work" className="btn-quiet w-full sm:w-auto">
              Explore my work <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-[#2c3128] sm:mt-6 sm:max-w-none">
            Websites from RM129 · Résumés from RM19 · Food photos from RM15
          </p>
        </div>
      </div>
    </div>
  );
}

function Tickets() {
  return (
    <ul className="ticket-strip grid gap-3 px-1 min-[768px]:px-0">
      {services.map((service, index) => (
        <li key={service.id}>
          <a href={`#${service.id}`} className="ticket block min-h-11 text-left text-ink">
            <span className="text-xs font-medium">{labels[index]}</span>
            <span className="mt-2 block font-display text-[2.35rem] font-medium tracking-[-0.045em] md:text-[2.75rem]">
              RM<span data-count={service.from}>{service.from}</span>
            </span>
            <span className="mt-1 block text-sm leading-snug">Starting price. See what&apos;s included.</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function MaskedWords({ text }: { text: string }) {
  return text.split(/(\s+)/).map((part, index) =>
    part.trim() === "" ? (
      part
    ) : (
      <span key={`${part}-${index}`} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
        <span className="sheet-word inline-block">{part}</span>
      </span>
    ),
  );
}

function PriceCopy() {
  return (
    <div className="sheet-copy text-center">
      <p className="mx-auto inline-flex min-h-8 items-center rounded-full bg-[#eef3d4] px-3 text-xs font-medium text-[#3F5214]">
        Miri, Sarawak
      </p>
      <h2 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink">
        <MaskedWords text="Three ways to start. The prices stay on the page." />
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#2c3128]">
        <MaskedWords text="I'm an independent freelancer in Miri. Websites, résumés, and food photos, with the package written down before any work begins." />
      </p>
    </div>
  );
}

function NameWipe() {
  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden py-2">
      <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-ink">
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="wipe pointer-events-none absolute inset-y-0 left-0 w-28 bg-white/50 backdrop-blur-md"
      />
    </div>
  );
}

function countTickets(root: ParentNode, progress: number) {
  root.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    node.textContent = String(Math.round(progress * target));
  });
}

export function OpeningFilm() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const motion = gsap.matchMedia();

      const intro = (scope: ParentNode) => {
        gsap.from(scope.querySelectorAll(".hero-word"), {
          yPercent: 120,
          duration: 0.95,
          stagger: 0.16,
          ease: "power3.out",
        });
        gsap.from(scope.querySelector(".hero-nav"), {
          y: -18,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
        });
        gsap.from(scope.querySelector(".hero-rest"), {
          y: 22,
          autoAlpha: 0,
          duration: 0.8,
          delay: 0.55,
          ease: "power3.out",
        });
      };

      motion.add(desktopQuery, () => {
        const film = root.current?.querySelector(".film");
        if (!film) return;
        intro(film);
        countTickets(film, 0);
        const state = { p: 0 };
        const dock = film.querySelector(".dock");
        const sheet = film.querySelector(".sheet");
        const pine = film.querySelector(".pine");
        gsap.set([dock, sheet, pine], { y: 0, x: 0, scale: 1 });
        gsap.set(dock, { yPercent: 125 });
        gsap.set(sheet, { yPercent: 110 });
        gsap.set(pine, { yPercent: 115, scale: 0.72 });
        gsap.set(film.querySelector(".name-row"), { autoAlpha: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: film,
            pin: true,
            scrub: true,
            start: "top top",
            end: "+=240%",
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(dock, { yPercent: 125 }, { yPercent: 0, duration: 1, immediateRender: true }, 0);
        tl.fromTo(
          film.querySelector(".land"),
          { yPercent: 0, scale: 1.1 },
          { yPercent: 18, scale: 1.08, duration: 1.6, immediateRender: false },
          0,
        );
        tl.to(
          state,
          {
            p: 1,
            duration: 1.7,
            onUpdate: () => countTickets(film, state.p),
          },
          0.15,
        );
        tl.fromTo(
          film.querySelector(".hero-ui"),
          { y: 0, autoAlpha: 1 },
          { y: -70, autoAlpha: 0, duration: 0.55, immediateRender: false },
          0.85,
        );
        tl.fromTo(sheet, { yPercent: 110 }, { yPercent: 0, duration: 1, immediateRender: true }, 0.95);
        tl.fromTo(
          film.querySelector(".sheet-copy > p"),
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.35, ease: "power2.out", immediateRender: false },
          1.15,
        );
        tl.fromTo(
          film.querySelectorAll(".sheet-word"),
          { yPercent: 120 },
          { yPercent: 0, stagger: 0.035, duration: 0.4, ease: "power2.out", immediateRender: false },
          1.22,
        );
        tl.fromTo(
          film.querySelector(".name-row"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3, immediateRender: false },
          1.35,
        );
        tl.fromTo(
          film.querySelector(".pine"),
          { yPercent: 115, scale: 0.72 },
          { yPercent: 0, scale: 1, duration: 0.85, ease: "power2.out", immediateRender: true },
          1.7,
        );
        tl.fromTo(
          film.querySelector(".wipe"),
          { xPercent: -150 },
          { xPercent: 170, duration: 0.85, immediateRender: false },
          1.85,
        );
      });

      motion.add(mobileQuery, () => {
        const stack = root.current?.querySelector(".stack");
        if (!stack) return;
        intro(stack);
        countTickets(stack, 1);
        const state = { p: 1 };
        const prices = stack.querySelector(".stack-prices");
        if (prices) {
          ScrollTrigger.create({
            trigger: prices,
            start: "top 88%",
            once: true,
            onEnter: () => {
              state.p = 0;
              countTickets(stack, 0);
              gsap.to(state, {
                p: 1,
                duration: 1.35,
                ease: "power2.out",
                onUpdate: () => countTickets(stack, state.p),
                onComplete: () => countTickets(stack, 1),
              });
            },
          });
        }
        gsap.from(stack.querySelector(".pine"), {
          y: 80,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: stack.querySelector(".pine"), start: "top 90%", once: true },
        });
        gsap.from(stack.querySelectorAll(".sheet-word"), {
          yPercent: 120,
          duration: 0.8,
          stagger: 0.035,
          ease: "power3.out",
          scrollTrigger: { trigger: stack.querySelector(".sheet-copy"), start: "top 82%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" className="scroll-mt-6">
      <div className="stack min-[768px]:hidden">
        <div className="relative min-h-[100svh] overflow-hidden bg-white">
          <div className="absolute inset-0">
            <Image
              src="/images/landscapes/hero-day.webp"
              alt="Illustrated mountain lake in warm daylight."
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <HeroCopy />
        </div>
        <div className="stack-prices scroll-mt-6 overflow-x-clip bg-white px-5 py-16 sm:py-20">
          <PriceCopy />
          <div className="mx-auto mt-8 max-w-5xl sm:mt-10">
            <Tickets />
            <div className="mt-6 sm:mt-8">
              <NameWipe />
            </div>
            <Image
              src="/images/branding/pine.webp"
              alt=""
              width={900}
              height={1200}
              className="pine pointer-events-none mx-auto mt-2 w-[min(220px,58vw)] mix-blend-darken sm:w-[min(260px,70vw)]"
            />
          </div>
        </div>
      </div>

      <div className="film relative hidden h-[100svh] overflow-hidden bg-white min-[768px]:block">
        <div className="land absolute inset-0 origin-bottom scale-110">
          <Image
            src="/images/landscapes/hero-day.webp"
            alt="Illustrated mountain lake in warm daylight."
            fill
            priority
            quality={95}
            sizes="125vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0">
          <HeroCopy />
        </div>
        <div className="sheet absolute inset-x-0 bottom-0 top-[16%] z-20 overflow-hidden bg-white px-8 pt-10">
          <div className="relative z-10 flex h-full flex-col items-center pt-[4vh]">
            <PriceCopy />
          </div>
        </div>
        <div className="dock absolute inset-x-[4vw] bottom-[calc(16vh+3.2rem)] z-30">
          <Tickets />
          <div className="name-row absolute inset-x-0 top-full z-10 pt-3">
            <NameWipe />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-[calc(100%+3.2rem)] h-[16vh] overflow-hidden">
            <Image
              src="/images/branding/pine.webp"
              alt=""
              width={900}
              height={1200}
              className="pine mx-auto h-full w-auto max-w-none mix-blend-darken"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
