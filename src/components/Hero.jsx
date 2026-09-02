import MoltenBackdrop from './MoltenBackdrop';
import ShinyText from './reactbits/ShinyText';

const Hero = () => {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden border-b border-line px-6 md:px-16">
      <MoltenBackdrop />

      <div className="relative z-10 max-w-3xl">
        <p className="mb-6 font-mono text-sm tracking-[0.2em] uppercase">
          <ShinyText
            text="Ishan Ghosh"
            color="#f5a524"
            shineColor="#ffe4a3"
            speed={4}
          />
        </p>
        <h1 className="font-mono text-4xl font-medium leading-[1.15] text-bone sm:text-5xl md:text-6xl">
          <ShinyText
            text="Backend / systems engineer —"
            color="#ededea"
            shineColor="#f5a524"
            speed={5}
            className="block"
          />
          <span className="block text-bone-dim">Rust, Go, distributed systems.</span>
        </h1>
        <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg">
          I build the parts of a system most people route around — consensus,
          replication, and the exact moment two nodes disagree about what's true.
        </p>
        <div className="mt-10 flex items-center gap-6">
          <a
            href="https://github.com/darkraider01"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-sm text-bone transition-colors hover:border-amber hover:text-amber"
          >
            github.com/darkraider01
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
