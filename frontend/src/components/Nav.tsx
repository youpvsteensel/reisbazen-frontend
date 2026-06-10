import { NavLink } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Overzicht' },
  { to: '/carretera-austral', label: 'Carretera Austral' },
  { to: '/el-chalten', label: 'El Chaltén' },
  { to: '/ushuaia', label: 'Ushuaia' },
  { to: '/falklands', label: 'Falklands' },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 group">
            <MapPin className="w-4 h-4 text-groen" />
            <span className="font-serif text-xl font-semibold text-groen tracking-tight">
              reisbazen
            </span>
          </NavLink>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nav-link pb-1 ${isActive ? 'active text-groen' : 'text-muted'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="flex md:hidden items-center gap-3">
            {navLinks.slice(1).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-xs font-medium transition-colors ${isActive ? 'text-groen' : 'text-muted'}`
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
