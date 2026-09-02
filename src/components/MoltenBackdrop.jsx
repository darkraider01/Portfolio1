import MoltenMetal from './reactbits/MoltenMetal';

const MoltenBackdrop = ({ className = 'opacity-20' }) => (
  <div className={`pointer-events-none absolute inset-0 ${className}`}>
    <MoltenMetal
      color1="#0a0a0b"
      color2="#7a4a12"
      color3="#f5a524"
      speed={0.22}
      scale={5}
      brightness={1.05}
      glow={1.2}
      mouseStrength={0.12}
      opacity={0.9}
    />
  </div>
);

export default MoltenBackdrop;
