import Image from "next/image";
import { FoodCompare } from "@/components/services/FoodCompare";
import { FrameReveal } from "@/components/ui/FrameReveal";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { services } from "@/data/services";
import { packageMessage } from "@/lib/whatsapp";

const chapterTone = ["#3A4C12", "#6B8F1A", "#7C9A24"];

function ResumeSheet() {
  return (
    <div className="rounded-2xl border border-[#e4e1d6] bg-[#fffdf8] p-6 shadow-[0_18px_40px_rgba(40,50,20,0.06)] md:p-8">
      <p className="text-xs font-medium text-[#3F5214]">Sample layout, not a real résumé</p>
      <p className="mt-5 font-display text-3xl font-medium tracking-[-0.03em] text-ink">Your name</p>
      <p className="mt-1 text-sm text-[#2c3128]">The role you want</p>
      <p className="mt-6 text-xs font-medium tracking-[0.04em] text-[#3F5214]">Experience</p>
      <p className="mt-2 text-sm text-ink">A job title</p>
      <p className="text-sm text-[#2c3128]">Where you worked · A year</p>
      <p className="mt-4 text-xs font-medium tracking-[0.04em] text-[#3F5214]">Skills</p>
      <p className="mt-2 text-sm text-[#2c3128]">The tools and tasks that match the role</p>
    </div>
  );
}

export function ServiceChapters() {
  return (
    <div>
      {services.map((service, index) => {
        const flip = index % 2 === 1;
        return (
          <section
            key={service.id}
            id={service.id}
            className={`scroll-mt-6 px-5 py-16 md:px-8 md:py-28 ${
              service.id === "resumes" ? "bg-[#f4f1e8]" : "bg-white"
            }`}
          >
            <Reveal
              className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-12 ${
                flip ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <p
                  className="font-display text-[clamp(3rem,14vw,5.5rem)] font-medium leading-none tracking-[-0.06em]"
                  style={{ color: chapterTone[index] }}
                >
                  0{index + 1}
                </p>
                <TextReveal
                  as="h2"
                  text={service.title}
                  className="mt-3 font-display text-[clamp(1.9rem,7vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink"
                />
                <TextReveal
                  text={service.lede}
                  className="mt-4 max-w-md text-base leading-relaxed text-[#2c3128]"
                />
                <p className="mt-6 font-display text-3xl font-medium tracking-[-0.03em] text-ink">
                  From RM{service.from}
                </p>
                <WhatsAppLink message={service.message} className="btn-olive mt-6">
                  {service.cta} <span aria-hidden="true">↗</span>
                </WhatsAppLink>

                <details className="mt-8 max-w-md rounded-2xl border border-[#e4e1d6] bg-[#fffdf8] px-4 py-1">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
                    See the three packages
                    <span aria-hidden="true" className="text-[#4A6014]">
                      +
                    </span>
                  </summary>
                  <ul className="space-y-5 pb-4">
                    {service.tiers.map((tier) => (
                      <li key={tier.name} className="border-t border-[#e4e1d6] pt-4">
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="font-medium text-ink">{tier.name}</h3>
                          <p className="font-display text-xl text-ink">RM{tier.price}</p>
                        </div>
                        <ul className="mt-2 space-y-1 text-sm leading-relaxed text-[#2c3128]">
                          {tier.includes.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <WhatsAppLink
                          message={packageMessage(tier.name, tier.price)}
                          className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-[#3F5214] underline decoration-[#c5d34a] decoration-2 underline-offset-4"
                        >
                          Enquire about {tier.name}
                        </WhatsAppLink>
                      </li>
                    ))}
                  </ul>
                  <p className="pb-4 text-sm leading-relaxed text-[#2c3128]">{service.note}</p>
                </details>
              </div>

              <div>
                {service.id === "websites" ? (
                  <div className="relative overflow-hidden rounded-2xl sm:overflow-visible">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-0 top-6 rounded-2xl bg-[#d5e15a] sm:-bottom-3 sm:-left-3 sm:right-8 sm:top-8 sm:inset-x-auto"
                    />
                    <FrameReveal className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#e7e4da] shadow-[0_18px_40px_rgba(40,50,20,0.08)]">
                      <Image
                        src="/images/projects/bloom-basket.webp"
                        alt="Homepage screenshot of the Bloom & Basket Miri concept website."
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top"
                      />
                    </FrameReveal>
                  </div>
                ) : null}
                {service.id === "resumes" ? <ResumeSheet /> : null}
                {service.id === "food" ? <FoodCompare /> : null}
              </div>
            </Reveal>
          </section>
        );
      })}
    </div>
  );
}
