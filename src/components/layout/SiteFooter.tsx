import Image from "next/image";
import { siteConfig } from "@/config/site";
import { messages } from "@/lib/whatsapp";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`relative z-20 bg-[#D5E15A] px-5 pb-28 pt-10 text-ink md:px-10 ${className}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/images/branding/cat.jpg"
            alt="Painted tabby cat."
            width={72}
            height={72}
            className="footer-mark h-[72px] w-[72px] rounded-full bg-white object-cover"
          />
          <p className="font-display text-lg font-medium tracking-[-0.03em]">
            {siteConfig.brandName}
            <span className="mt-1 block text-sm font-normal">
              Independent freelancer · {siteConfig.location}
            </span>
          </p>
        </div>
        <nav aria-label="Page sections" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="inline-flex min-h-11 items-center text-sm font-medium">
              {link.label}
            </a>
          ))}
        </nav>
        <WhatsAppLink message={messages.general} className="inline-flex min-h-11 items-center text-sm font-medium underline decoration-[#3F5214] underline-offset-4">
          WhatsApp
        </WhatsAppLink>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-sm leading-relaxed">
        © {siteConfig.year} {siteConfig.brandName}. The featured websites are fictional concept projects made to show the packages.
      </p>
    </footer>
  );
}
