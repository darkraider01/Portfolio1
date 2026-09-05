import MoltenBackdrop from './MoltenBackdrop';
import SectionHeading from './SectionHeading';

const groups = [
  {
    label: 'Languages',
    items: ['Rust', 'Go', 'Java', 'Python']
  },
  {
    label: 'Systems & Distributed',
    items: [
      'Raft consensus',
      'Leader election & log replication',
      'Append-only / immutable storage',
      'Cryptographic hash chaining',
      'Concurrency & networking (TCP)'
    ]
  },
  {
    label: 'Compiler & Instrumentation',
    items: [
      'rustc / RUSTC_WRAPPER interception',
      'syn AST & byte-span analysis',
      'Go toolexec-based instrumentation',
      'OpenTelemetry semantic conventions'
    ]
  },
  {
    label: 'Infra & Tooling',
    items: ['Linux', 'Docker', 'gRPC / HTTP APIs', 'Git', 'GitHub Actions']
  }
];

const Skills = () => {
  return (
    <section id="skills" className="relative overflow-hidden border-b border-line px-6 py-24 md:px-16 md:py-32 scroll-mt-24">
      <MoltenBackdrop />
      <div className="relative z-10 grid gap-10 md:grid-cols-[200px_1fr] md:gap-16">
        <SectionHeading number="03" text="Skills" />
        <div className="grid max-w-2xl gap-10 sm:grid-cols-2">
          {groups.map(group => (
            <div key={group.label}>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
                {group.label}
              </h3>
              <ul className="space-y-2 font-sans text-base text-bone-dim">
                {group.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
