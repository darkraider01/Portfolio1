import { projects } from '../data/projects';
import SpotlightCard from './reactbits/SpotlightCard';
import Reveal from './Reveal';
import MoltenBackdrop from './MoltenBackdrop';
import SectionHeading from './SectionHeading';
import { timeAgo } from '../utils/timeAgo';

const LangTag = ({ lang }) => (
  <span className="font-mono text-xs tracking-wide text-amber-dim">{lang}</span>
);

const CardMeta = ({ href, updatedAt }) => (
  <div className="flex items-center gap-4">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs text-muted transition-colors hover:text-amber"
    >
      view source &rarr;
    </a>
    <span className="font-mono text-xs text-muted">
      last commit: {timeAgo(updatedAt)}
    </span>
  </div>
);

const Projects = () => {
  const featured = projects.filter(p => p.featured);
  const rest = projects.filter(p => !p.featured);

  return (
    <section id="projects" className="relative overflow-hidden border-b border-line px-6 py-24 md:px-16 md:py-32 scroll-mt-24">
      <MoltenBackdrop />
      <div className="relative z-10 mb-14 grid gap-10 md:grid-cols-[200px_1fr] md:gap-16">
        <SectionHeading number="02" text="Projects" />
        <p className="max-w-xl font-sans text-lg text-bone-dim">
          A handful of what I've built and what's still running. Real repos,
          real READMEs — links go straight to the source.
        </p>
      </div>

      <div className="relative z-10 grid gap-6 md:grid-cols-2">
        {featured.map(project => (
          <Reveal key={project.slug}>
            <SpotlightCard className="flex h-full flex-col p-8 md:p-10">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="font-mono text-2xl text-bone">{project.name}</h3>
                <LangTag lang={project.languages[0]} />
              </div>
              <p className="flex-1 font-sans text-base leading-relaxed text-bone-dim">
                {project.description}
              </p>
              <div className="mt-6">
                <CardMeta href={project.href} updatedAt={project.updatedAt} />
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <div className="relative z-10 mt-6 flex flex-col gap-4">
        {rest.map(project => (
          <Reveal key={project.slug}>
            <SpotlightCard className="flex flex-col gap-3 p-6 md:flex-row md:items-baseline md:gap-8 md:p-7">
              <div className="flex items-baseline gap-3 md:w-64 md:shrink-0">
                <h3 className="font-mono text-lg text-bone">{project.name}</h3>
                <LangTag lang={project.languages[0]} />
              </div>
              <p className="flex-1 font-sans text-sm leading-relaxed text-bone-dim md:text-base">
                {project.description}
              </p>
              <div className="flex flex-col items-start gap-1 md:shrink-0 md:items-end">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted transition-colors hover:text-amber"
                >
                  view source &rarr;
                </a>
                <span className="font-mono text-xs text-muted">
                  {timeAgo(project.updatedAt)}
                </span>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Projects;
