import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contributions from './components/Contributions';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contributions />
      <Contact />
    </div>
  );
}

export default App;
