import { FrameReveal } from "@/components/ui/FrameReveal";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { ProjectVideo } from "@/components/portfolio/ProjectVideo";
import { projects, type Project } from "@/data/projects";

function ProjectCard({ project, lead = false }: { project: Project; lead?: boolean }) {
  return (
    <article>
      <FrameReveal
        className={`group relative overflow-hidden rounded-2xl bg-[#e7e4da] aspect-[16/10] ${
          lead ? "lg:aspect-[4/5]" : ""
        }`}
      >
        <ProjectVideo
          src={project.video}
          alt={project.alt}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </FrameReveal>
      <p className="mt-4 text-sm font-medium text-[#3F5214]">Concept project</p>
      <TextReveal
        as="h3"
        text={project.title}
        className="mt-1 font-display text-xl font-medium tracking-[-0.03em] text-ink sm:text-2xl"
      />
      <p className="mt-1 text-sm text-[#2c3128]">{project.category}</p>
      <TextReveal text={project.description} className="mt-2 max-w-md text-sm leading-relaxed text-[#2c3128]" />
      <p className="mt-2 text-sm text-[#2c3128]">{project.technology}</p>
      <p className="mt-3 text-sm font-medium text-ink">Live demo coming soon</p>
    </article>
  );
}

export function Portfolio() {
  return (
    <section id="work" className="scroll-mt-6 bg-white px-5 pb-20 md:px-8 md:pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#3F5214]">Selected concepts</p>
          <TextReveal
            as="h2"
            text="Work made to show the packages."
            className="mt-3 font-display text-[clamp(1.85rem,6vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink"
          />
          <TextReveal
            text="These three sites are fictional concepts, not paid client jobs. Live demos are not online yet."
            className="mt-4 max-w-xl text-base leading-relaxed text-[#2c3128]"
          />
        </div>

        <div className="mt-10 grid items-start gap-10 md:mt-14 md:gap-12 lg:grid-cols-[1.25fr_0.9fr] lg:gap-10">
          <Reveal>
            <ProjectCard project={projects[0]} lead />
          </Reveal>
          <div className="grid gap-10 md:gap-12">
            {projects.slice(1).map((project) => (
              <Reveal key={project.title}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
