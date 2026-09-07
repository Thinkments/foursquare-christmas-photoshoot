import React, { useState } from 'react';
import { Palette, Sparkles, CheckCircle2, AlertCircle, Shirt, Camera } from 'lucide-react';

interface Backdrop {
  id: string;
  name: string;
  atmosphere: string;
  colorScheme: string;
  bestFor: string;
  bgGradient: string;
}

interface OutfitStyle {
  id: string;
  name: string;
  description: string;
  recommendedColors: string[];
  avoidColors: string[];
  bestMatches: string[]; // backdrop IDs
  tips: string[];
}

const BACKDROPS: Backdrop[] = [
  {
    id: 'evergreen-hearth',
    name: 'Evergreen Fireside Hearth',
    atmosphere: 'Warm traditional brick fireplace, lush cedar garland, glowing amber fairy lights.',
    colorScheme: 'Deep Pine, Crimson Red, Warm Gold, Rich Mahogany',
    bestFor: 'Multi-gen families, resident portraits, and traditional holiday cards.',
    bgGradient: 'from-[#0B3B24] via-[#1B5E20] to-[#2E1A11]',
  },
  {
    id: 'frosted-pines',
    name: 'Winter Birch & Frosted Pines',
    atmosphere: 'Serene modern winter wonderland with frosted snow pines and soft silver accents.',
    colorScheme: 'Icy White, Slate Blue, Silver Sparkle, Charcoal',
    bestFor: 'Sophisticated portraits, crisp individual headshots, and modern greeting cards.',
    bgGradient: 'from-[#1E293B] via-[#334155] to-[#64748B]',
  },
  {
    id: 'north-pole',
    name: 'North Pole Santa Workshop',
    atmosphere: 'Vibrant and joyful toy workshop with festive presents, oversized ribbon, and Santa throne.',
    colorScheme: 'Santa Red, Candy Cane White, Forest Green, Bright Gold',
    bestFor: 'Kids, toddlers, family visits with Santa, and playful team poses.',
    bgGradient: 'from-[#9E152D] via-[#C41E3A] to-[#D4AF37]',
  },
  {
    id: 'clinical-holiday',
    name: 'Clinical Pride & Holiday Wreath',
    atmosphere: 'Clean, professional hospital studio setup with elegant fresh evergreen wreath and subtle holiday ribbon.',
    colorScheme: 'Hospital Navy, Ceil Blue, Crisp White, Emerald Green',
    bestFor: 'Nursing unit teams, physician headshots, and departmental staff recognitions.',
    bgGradient: 'from-[#0F172A] via-[#1E3A8A] to-[#0B3B24]',
  },
];

const OUTFIT_STYLES: OutfitStyle[] = [
  {
    id: 'scrubs-clinical',
    name: 'Holiday Scrubs & White Coats',
    description: 'Showcase healthcare frontline pride. Festive patterned scrub tops or crisp solid hospital scrubs with stethoscopes.',
    recommendedColors: ['Royal Blue', 'Navy', 'Ceil Blue', 'Holiday Crimson', 'Forest Green'],
    avoidColors: ['Faded hospital pastels', 'Clashing neon yellow'],
    bestMatches: ['clinical-holiday', 'evergreen-hearth'],
    tips: [
      'Iron or steam scrubs before the session.',
      'Wear your facility ID badge proudly or bring a festive holiday stethoscope cover.',
      'Unit matching scrubs create striking cohesive group cards.',
    ],
  },
  {
    id: 'classic-velvet',
    name: 'Classic Velvet & Jewel Tones',
    description: 'Timeless holiday elegance for families and formal executive portraits.',
    recommendedColors: ['Emerald Green', 'Burgundy / Maroon', 'Midnight Navy', 'Champagne Gold'],
    avoidColors: ['Bright neon greens', 'Heavy high-contrast micro-stripes (causes moiré effect on camera)'],
    bestMatches: ['evergreen-hearth', 'frosted-pines'],
    tips: [
      'Velvet, corduroy, and textured silks catch portrait softbox lighting beautifully.',
      'Pair jewel tones with gold or pearl jewelry for a polished heirloom look.',
    ],
  },
  {
    id: 'cozy-knits',
    name: 'Cozy Winter Knits & Sweaters',
    description: 'Chunky cable knit sweaters, cardigans, and tasteful Fair Isle Nordic patterns.',
    recommendedColors: ['Cream / Ivory', 'Oatmeal', 'Camel Tan', 'Forest Pine', 'Dusty Rose'],
    avoidColors: ['Stark plain black (absorbs studio shadows)', 'Overly busy logos/graphic tees'],
    bestMatches: ['frosted-pines', 'evergreen-hearth'],
    tips: [
      'Chunky knit textures create warmth and dimension in digital portraits.',
      'Coordinate tones without everyone wearing the exact same color sweater.',
    ],
  },
  {
    id: 'matching-pajamas',
    name: 'Matching Holiday Pajamas & Plaid',
    description: 'Fun, whimsical, and memorable holiday pajama sets for children, parents, and playful units.',
    recommendedColors: ['Classic Red & Black Buffalo Plaid', 'Green & Navy Tartan', 'Gingerbread prints'],
    avoidColors: ['Fluorescent glow-in-the-dark fabrics'],
    bestMatches: ['north-pole', 'evergreen-hearth'],
    tips: [
      'Bring festive fuzzy socks or clean slippers for seated fireside poses.',
      'Great for kids meeting Santa Claus in the studio.',
    ],
  },
];

export default function WardrobeMatcher() {
  const [selectedBackdrop, setSelectedBackdrop] = useState<Backdrop>(BACKDROPS[0]);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitStyle>(OUTFIT_STYLES[0]);

  const isIdealMatch = selectedOutfit.bestMatches.includes(selectedBackdrop.id);

  return (
    <div className="w-full max-w-4xl mx-auto stable-widget-container">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">
            Interactive Style Advisor
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
            Studio Backdrop & Holiday Wardrobe Matcher
          </h3>
          <p className="text-sm text-slate-600">
            Preview how your clothing attire pairs with our 4 physical holiday sets across DFW campuses.
          </p>
        </div>

        {/* Step 1: Pick Backdrop */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            1. Select Studio Backdrop Setup
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BACKDROPS.map((b) => {
              const isSelected = selectedBackdrop.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBackdrop(b)}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition relative overflow-hidden ${
                    isSelected
                      ? 'border-holiday-pine shadow-lg ring-2 ring-holiday-pine/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`h-12 w-full rounded-xl bg-gradient-to-r ${b.bgGradient} mb-3 shadow-inner flex items-center justify-center text-white text-xs font-bold`}>
                    <Camera className="w-4 h-4 opacity-75" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{b.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{b.atmosphere}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Pick Outfit */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            2. Select Wardrobe / Attire Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {OUTFIT_STYLES.map((o) => {
              const isSelected = selectedOutfit.id === o.id;
              return (
                <div
                  key={o.id}
                  onClick={() => setSelectedOutfit(o)}
                  className={`p-4 rounded-2xl cursor-pointer border-2 transition ${
                    isSelected
                      ? 'border-holiday-red bg-holiday-red/5 shadow-lg ring-2 ring-holiday-red/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700 w-fit mb-2">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{o.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{o.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Match Analysis Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-holiday-gold/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-holiday-gold">
                Compatibility Rating
              </span>
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <span>{selectedOutfit.name}</span>
                <span className="text-slate-500">+</span>
                <span>{selectedBackdrop.name}</span>
              </h4>
            </div>

            <div>
              {isIdealMatch ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-holiday-pine text-holiday-goldlight font-extrabold text-xs border border-holiday-gold/30">
                  <Sparkles className="w-3.5 h-3.5" /> Ideal Studio Harmony (98% Match)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs">
                  Compatible Palette (85% Match)
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Recommended colors */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-holiday-gold block mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Recommended Colors
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedOutfit.recommendedColors.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Colors to avoid */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-holiday-red block mb-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Colors / Patterns to Avoid
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedOutfit.avoidColors.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Studio Lighting Pro Tips */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-white block mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-holiday-gold" /> Pro Studio Tips
              </span>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                {selectedOutfit.tips.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
