import { Link, useLocation } from 'react-router-dom';
import { alleStops } from '../data/reisData';
import { ChevronRight } from 'lucide-react';

export default function RouteStrip() {
  const location = useLocation();

  return (
    <div className="bg-white border-b border-gray-100 py-4 overflow-x-auto">
      <div className="flex items-center gap-2 px-4 sm:px-6 max-w-6xl mx-auto w-max sm:w-full">
        {alleStops.map((stop, i) => {
          const isActive = location.pathname === stop.route;
          return (
            <div key={stop.naam} className="flex items-center gap-2 flex-shrink-0">
              <Link
                to={stop.route}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-groen text-white shadow-sm'
                    : 'bg-groen-licht text-groen hover:bg-groen/15 border border-groen/20'
                }`}
              >
                {stop.naam}
              </Link>
              {i < alleStops.length - 1 && (
                <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
