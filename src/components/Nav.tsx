import { NavLink, Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Nav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-logo text-2xl text-white leading-none">
            Routebaas
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link-reisbazen ${isActive ? 'active' : ''}`}
            >
              Alle Reisroutes
            </NavLink>
            <a
              href="https://www.reisbazen.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link-reisbazen"
            >
              REISBAZEN.NL
            </a>
            <a
              href="https://www.instagram.com/reisbazen/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-[10px] uppercase tracking-widest font-semibold transition-colors ${
                  isActive ? 'text-[#c4785a]' : 'text-white/80'
                }`
              }
            >
              Reizen
            </NavLink>
            <a
              href="https://www.instagram.com/reisbazen/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
