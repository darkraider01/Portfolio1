import MoltenBackdrop from './MoltenBackdrop';
import SectionHeading from './SectionHeading';

const Contact = () => {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-16 md:py-32 scroll-mt-24">
      <MoltenBackdrop />
      <div className="relative z-10 grid gap-10 md:grid-cols-[200px_1fr] md:gap-16">
        <SectionHeading number="05" text="Contact" />
        <div className="max-w-xl">
          <p className="font-sans text-lg leading-relaxed text-bone-dim">
            Reachable by email, or check the code directly on GitHub.
          </p>
          <div className="mt-6 flex flex-col gap-3 font-mono text-base">
            <a
              href="mailto:ishanghosh0111@gmail.com"
              className="w-fit text-bone transition-colors hover:text-amber"
            >
              ishanghosh0111@gmail.com
            </a>
            <a
              href="https://github.com/darkraider01"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-bone transition-colors hover:text-amber"
            >
              github.com/darkraider01
            </a>
          </div>
        </div>
      </div>

      <p className="relative z-10 mt-24 font-mono text-xs text-muted">
        Ishan Ghosh — built with React, Vite &amp; Tailwind CSS.
      </p>
    </section>
  );
};

export default Contact;
