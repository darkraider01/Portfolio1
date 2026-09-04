import MoltenBackdrop from './MoltenBackdrop';
import SectionHeading from './SectionHeading';

const About = () => {
  return (
    <section id="about" className="relative overflow-hidden border-b border-line px-6 py-24 md:px-16 md:py-32 scroll-mt-24">
      <MoltenBackdrop />
      <div className="relative z-10 grid gap-10 md:grid-cols-[200px_1fr] md:gap-16">
        <SectionHeading number="01" text="About" />
        <div className="max-w-2xl space-y-6 font-sans text-lg leading-relaxed text-bone-dim">
          <p>
            I gravitate toward the parts of a system most people try to avoid:
            consensus, replication, and the exact moment two nodes disagree
            about what's true. Most of what I build sits below the API layer:
            key-value stores, audit ledgers, inventory systems, video
            pipelines. The interesting problems there are about ordering,
            integrity, and what happens when the network doesn't cooperate.
          </p>
          <p>
            I write Rust when correctness and performance both matter and I
            don't want a garbage collector deciding when to pause my program.
            I write Go when I want to move fast on concurrent systems without
            fighting the language. Java shows up when the problem is
            enterprise-shaped and needs to interoperate with everything else
            in that world.
          </p>
          <p>
            Right now most of my time goes into{' '}
            <span className="text-bone">rust-compile-time-instrumentation</span>
            : zero-code OpenTelemetry instrumentation for Rust that reaches
            into third-party dependencies too, done by intercepting rustc
            directly on stable Rust instead of asking every crate author to
            hand-wire tracing calls.{' '}
            <span className="text-bone">mini-etcd</span> exists because I
            wanted to implement Raft myself instead of trusting a library to
            explain it to me. <span className="text-bone">Capa</span> exists
            because I got curious about whether engineering ability leaves a
            detectable trace in how someone actually works, not in what they
            claim on a resume. The{' '}
            <span className="text-bone">AI-driven QoS engine for 5G networks</span>{' '}
            came from wanting to see the same ordering and orchestration
            problems play out somewhere other than a storage system. Everything
            else follows from the same instinct: understand the primitive
            before reaching for the abstraction built on top of it.
          </p>
          <p>
            Outside my own repos, I contribute upstream in Go and Rust, most
            recently a handful of compiler-tooling fixes merged into
            OpenTelemetry's Go instrumentation project.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
