import { NavLink } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/carretera-austral', label: 'Carretera Austral' },
  { to: '/el-chalten', label: 'El Chaltén' },
  { to: '/ushuaia', label: 'Ushuaia' },
  { to: '/falklands', label: 'Falklands' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/60 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="font-serif italic text-2xl text-white tracking-tight leading-none">
            reisbazen
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nav-link-reisbazen ${isActive ? 'active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="https://www.instagram.com/reisbazen/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors ml-1"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile: logo only + instagram */}
          <div className="flex md:hidden items-center gap-4">
            {navLinks.slice(1).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-[10px] uppercase tracking-widest font-medium transition-colors ${
                    isActive ? 'text-[#c4785a]' : 'text-white/80'
                  }`
                }
              >
                {link.label.split(' ')[0]}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
