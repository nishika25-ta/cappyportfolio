import { Closing } from "@/components/contact/Closing";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { OpeningFilm } from "@/components/hero/OpeningFilm";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { ProcessScroll } from "@/components/process/ProcessScroll";
import { ServiceChapters } from "@/components/services/ServiceChapters";

export default function Home() {
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <main id="content">
        <OpeningFilm />
        <ProcessScroll />
        <Portfolio />
        <ServiceChapters />
        <Closing />
      </main>
      <FloatingWhatsApp />
    </>
  );
}
