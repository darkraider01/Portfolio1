import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { id: 'about', label: 'About', num: '01' },
  { id: 'projects', label: 'Projects', num: '02' },
  { id: 'skills', label: 'Skills', num: '03' },
  { id: 'contributions', label: 'Contributions', num: '04' },
  { id: 'contact', label: 'Contact', num: '05' }
];

const Nav = () => {
  const [active, setActive] = useState(null);
  const { pathname } = useLocation();
  const onHome = pathname === '/';

  useEffect(() => {
    if (!onHome) return;
    const sections = links
      .map(link => document.getElementById(link.id))
      .filter(Boolean);

    const io = new IntersectionObserver(
      entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(section => io.observe(section));
    return () => io.disconnect();
  }, [onHome]);

  // Off the homepage there are no sections to observe — the journal lives
  // under the Contributions entry, so keep that one lit.
  const activeId = onHome ? active : 'contributions';

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 md:px-16">
        <Link
          to="/"
          className="font-mono text-sm tracking-widest text-bone transition-colors hover:text-amber"
        >
          IG
        </Link>
        <ul className="flex items-center gap-5 md:gap-8">
          {links.map(link => (
            <li key={link.id}>
              <Link
                to={{ pathname: '/', hash: `#${link.id}` }}
                className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                  activeId === link.id ? 'text-amber' : 'text-muted hover:text-bone'
                }`}
              >
                <span className="hidden sm:inline">{link.num} </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
