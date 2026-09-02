import ShinyText from './reactbits/ShinyText';

const SectionHeading = ({ number, text }) => (
  <h2 className="flex items-baseline gap-3 font-mono text-sm tracking-[0.2em] uppercase">
    <span className="text-muted">{number}</span>
    <ShinyText text={text} color="#f5a524" shineColor="#ffe4a3" speed={4} />
  </h2>
);

export default SectionHeading;
