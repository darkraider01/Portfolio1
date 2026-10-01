import { useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import OssJournal from './pages/OssJournal';

// Hash links (#about) need explicit scrolling once the target section exists —
// the browser only handles that on a full page load, not a client-side route.
const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }
    // Skip the initial mount so a mid-page refresh keeps the browser's scroll
    // restoration instead of yanking back to the top.
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen bg-ink">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/oss" element={<OssJournal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
