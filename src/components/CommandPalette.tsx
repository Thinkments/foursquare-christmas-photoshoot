import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar, MapPin, Sparkles, Calculator, CheckSquare, Palette, ArrowRight, X } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  category: 'Service' | 'Location' | 'Tool' | 'Guide';
  description: string;
  url: string;
  icon: any;
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'schedule',
    title: 'Interactive Photo Shoot Scheduler',
    category: 'Tool',
    description: 'Book a 15-min or 30-min holiday photo session across any DFW campus.',
    url: '/schedule',
    icon: Calendar,
  },
  {
    id: 'reschedule',
    title: 'Self-Service Reschedule Portal',
    category: 'Tool',
    description: 'Switch your 15-minute photo shoot appointment to an open slot without calling reception.',
    url: '/reschedule',
    icon: Calendar,
  },
  {
    id: 'coordinator',
    title: 'Activity Coordinator & Photographer Run-Sheet',
    category: 'Guide',
    description: 'Live day-of check-in roster, resident room numbers, and wheelchair transport list.',
    url: '/coordinator',
    icon: CheckSquare,
  },
  {
    id: 'calculator',
    title: 'Holiday Package & Print Calculator',
    category: 'Tool',
    description: 'Calculate package prices, holiday card sets, canvas prints, and employee discounts.',
    url: '/calculator',
    icon: Calculator,
  },
  {
    id: 'style-guide',
    title: 'Festive Wardrobe & Backdrop Matcher',
    category: 'Tool',
    description: 'Match outfit colors and attire types to our 4 signature holiday studio backdrops.',
    url: '/style-guide',
    icon: Palette,
  },
  {
    id: 'prep-checklist',
    title: 'Session Preparation & Mobility Checklist',
    category: 'Guide',
    description: 'Step-by-step checklist for shift staff, resident families, and unit coordinators.',
    url: '/prep-checklist',
    icon: CheckSquare,
  },
  {
    id: 'staff-portraits',
    title: 'Clinical Shift & Staff Express Sessions',
    category: 'Service',
    description: '15-minute quick sessions tailored for 3x12 nurses and clinical teams between shifts.',
    url: '/services/staff-portraits',
    icon: Sparkles,
  },
  {
    id: 'resident-family',
    title: 'Resident & Multi-Gen Family Portraits',
    category: 'Service',
    description: 'Peaceful, wheelchair-accessible sessions for senior living and rehab residents.',
    url: '/services/resident-family',
    icon: Sparkles,
  },
  {
    id: 'santa-experience',
    title: 'Santa Claus & North Pole Experience',
    category: 'Service',
    description: 'Magical visits with Santa for healthcare employees’ children and visiting families.',
    url: '/services/santa-experience',
    icon: Sparkles,
  },
  {
    id: 'department-teams',
    title: 'Unit & Department Holiday Card Sessions',
    category: 'Service',
    description: 'Group staging for clinical units, ICU/ER staff, and facility leadership.',
    url: '/services/department-teams',
    icon: Sparkles,
  },
  {
    id: 'dallas-regional',
    title: 'Dallas Regional Medical Center Studio',
    category: 'Location',
    description: 'Executive Boardroom & Winter Conservatory — 1011 N Galloway Ave, Mesquite, TX.',
    url: '/locations/dallas-regional',
    icon: MapPin,
  },
  {
    id: 'fort-worth',
    title: 'Fort Worth Senior Living & Rehab Studio',
    category: 'Location',
    description: 'Fireside Grand Hearth & Garden Lounge — 2800 W 7th St, Fort Worth, TX.',
    url: '/locations/fort-worth-senior-living',
    icon: MapPin,
  },
  {
    id: 'plano-specialty',
    title: 'Plano Specialty Hospital Studio',
    category: 'Location',
    description: 'Winter Garden Atrium — 3801 W 15th St, Plano, TX.',
    url: '/locations/plano-specialty',
    icon: MapPin,
  },
  {
    id: 'arlington-pavilion',
    title: 'Arlington Emergency Pavilion Studio',
    category: 'Location',
    description: 'Community Education & Santa Suite — 800 W Randol Mill Rd, Arlington, TX.',
    url: '/locations/arlington-pavilion',
    icon: MapPin,
  },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filtered = SEARCH_ITEMS.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (url: string) => {
    setIsOpen(false);
    window.location.href = url;
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex].url);
    }
  };

  return (
    <>
      {/* Global quick trigger button that can be activated from header or UI */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-holiday-pine/60 hover:bg-holiday-pine/90 border border-holiday-gold/30 rounded-lg shadow-inner transition-colors duration-150"
        title="Search with Ctrl+K"
        aria-label="Open Command Search Palette"
      >
        <Search className="w-3.5 h-3.5 text-holiday-gold" />
        <span>Search sessions & tools...</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-900/80 border border-slate-700 rounded text-slate-300">
          Ctrl K
        </kbd>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-slate-900 border border-holiday-gold/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
              <Search className="w-5 h-5 text-holiday-gold mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search holiday sessions, campus studios, pricing calculator, or prep guides..."
                className="w-full bg-transparent border-none text-slate-100 placeholder-slate-400 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                aria-label="Close search modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  <p>No matching sessions or guides found for "{query}".</p>
                  <p className="mt-1 text-xs text-slate-500">Try typing "scheduler", "Santa", "Dallas", or "pricing".</p>
                </div>
              ) : (
                filtered.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.url)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-100 ${
                        isSelected
                          ? 'bg-holiday-pine/80 border border-holiday-gold/30 text-white'
                          : 'hover:bg-slate-800/70 text-slate-300'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isSelected ? 'bg-holiday-gold text-holiday-pine' : 'bg-slate-800 text-holiday-gold'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-100">{item.title}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-holiday-goldlight border border-holiday-gold/20">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{item.description}</p>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 mt-1 shrink-0 transition-transform ${
                          isSelected ? 'text-holiday-gold translate-x-1' : 'text-slate-600'
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer status bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span className="text-holiday-gold font-medium">Foursquare Holiday Experience</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
