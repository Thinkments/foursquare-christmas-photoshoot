import React, { useState } from 'react';
import { Calculator, Check, Sparkles, Tag, ArrowRight, ShieldCheck } from 'lucide-react';

interface PackageTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const BASE_PACKAGES: PackageTier[] = [
  {
    id: 'employee-subsidized',
    name: 'Hospital Staff Express',
    price: 0,
    description: '100% subsidized by Foursquare Healthcare Employee Appreciation Fund.',
    features: [
      '15-Minute Shift-Friendly Studio Time',
      '3 High-Resolution Digital Images',
      'Full Personal & Social Media Print Release',
      '48-Hour Digital Proof Delivery',
    ],
  },
  {
    id: 'premier-keepsake',
    name: 'Premier Holiday Keepsake',
    price: 49,
    popular: true,
    description: 'Complete high-resolution digital download gallery for families & team units.',
    features: [
      'Up to 30 Minutes Studio Session',
      'Complete Digital Gallery (12+ High-Res Images)',
      'Professional Skin Tone Retouching',
      'Unrestricted Commercial / Holiday Card Release',
      'Digital Delivery within 36 Hours',
    ],
  },
  {
    id: 'grand-heirloom',
    name: 'Grand Family & Unit Heirloom',
    price: 99,
    description: 'Designed for large multi-gen resident families and entire clinical department teams.',
    features: [
      '30-45 Minutes Dedicated Studio Staging',
      'Unlimited High-Resolution Image Downloads',
      'Unit Group Poses + Individual Professional Headshots',
      'Rush 24-Hour Digital Gallery Delivery',
      'Complimentary Digital Holiday Card Design Template',
    ],
  },
];

export default function PackageCalculator() {
  const [selectedTier, setSelectedTier] = useState<string>('premier-keepsake');
  const [cardCount, setCardCount] = useState<number>(25); // 0, 25, 50, 100
  const [framedPrints, setFramedPrints] = useState<number>(1);
  const [canvasPrints, setCanvasPrints] = useState<number>(0);
  const [isEmployeeDiscount, setIsEmployeeDiscount] = useState<boolean>(true);

  // Pricing rates
  const tierObj = BASE_PACKAGES.find((p) => p.id === selectedTier) || BASE_PACKAGES[0];
  const basePrice = tierObj.price;

  // Card pricing: $25 for 25 cards, $45 for 50, $80 for 100
  const cardPrice = cardCount === 25 ? 25 : cardCount === 50 ? 45 : cardCount === 100 ? 80 : 0;
  const printPrice = framedPrints * 20; // $20 each for 8x10
  const canvasPrice = canvasPrints * 65; // $65 each for 16x20

  const subtotal = basePrice + cardPrice + printPrice + canvasPrice;
  const discountAmount = isEmployeeDiscount ? subtotal * 0.2 : 0;
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <div className="w-full max-w-4xl mx-auto stable-widget-container">
      {/* Interactive Calculator Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">
              Real-Time Estimate
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
              Holiday Portrait Package & Print Calculator
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-holiday-pine/10 text-holiday-pine px-3.5 py-1.5 rounded-xl text-xs font-bold border border-holiday-pine/20">
            <Sparkles className="w-4 h-4 text-holiday-gold" />
            <span>2026 Holiday Subsidies Active</span>
          </div>
        </div>

        {/* 1. Base Package Select */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            1. Select Digital Portrait Package
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BASE_PACKAGES.map((pkg) => {
              const isSelected = selectedTier === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedTier(pkg.id)}
                  className={`relative p-5 rounded-2xl cursor-pointer border-2 transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-holiday-pine bg-holiday-pine/5 ring-2 ring-holiday-pine/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 right-4 bg-holiday-red text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{pkg.name}</h4>
                    <div className="my-2">
                      <span className="text-2xl font-extrabold font-heading text-holiday-pine">
                        ${pkg.price}
                      </span>
                      {pkg.price === 0 && (
                        <span className="ml-2 text-xs font-bold text-holiday-red">Free For Staff</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{pkg.description}</p>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-holiday-mistletoe shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Physical Prints & Greeting Cards Add-ons */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            2. Optional Print Keepsakes & Holiday Greeting Cards
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Custom Greeting Cards */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="block text-xs font-bold text-slate-900">Custom Foil Cards</span>
              <span className="text-[11px] text-slate-500 block mb-2">Folded cards with envelopes</span>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="w-full text-xs font-semibold px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value={0}>No cards ($0)</option>
                <option value={25}>Pack of 25 (+$25)</option>
                <option value={50}>Pack of 50 (+$45)</option>
                <option value={100}>Pack of 100 (+$80)</option>
              </select>
            </div>

            {/* 8x10 Archival Framed Prints */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="block text-xs font-bold text-slate-900">8x10 Framed Desk Print</span>
              <span className="text-[11px] text-slate-500 block mb-2">Lustre archival finish ($20 ea)</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFramedPrints(Math.max(0, framedPrints - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="text-sm font-bold text-slate-800 w-6 text-center">{framedPrints}</span>
                <button
                  type="button"
                  onClick={() => setFramedPrints(framedPrints + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* 16x20 Gallery Wrapped Canvas */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="block text-xs font-bold text-slate-900">16x20 Canvas Wrap</span>
              <span className="text-[11px] text-slate-500 block mb-2">Solid wood frame mount ($65 ea)</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCanvasPrints(Math.max(0, canvasPrints - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="text-sm font-bold text-slate-800 w-6 text-center">{canvasPrints}</span>
                <button
                  type="button"
                  onClick={() => setCanvasPrints(canvasPrints + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Discount Toggle */}
        <div className="p-4 bg-holiday-pine/5 border border-holiday-pine/20 rounded-2xl mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-holiday-pine text-holiday-gold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                Foursquare Healthcare Staff & Resident Family Discount
              </span>
              <span className="text-[11px] text-slate-600">
                Applies an automatic 20% savings on all optional print and card merchandise.
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEmployeeDiscount}
              onChange={(e) => setIsEmployeeDiscount(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-holiday-pine"></div>
          </label>
        </div>

        {/* Price Summary & CTA */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-heading text-holiday-gold">
                ${total.toFixed(0)}
              </span>
              <span className="text-xs text-slate-400">Estimated Total</span>
              {isEmployeeDiscount && discountAmount > 0 && (
                <span className="text-xs text-holiday-goldlight font-bold bg-holiday-pine px-2 py-0.5 rounded">
                  Saved ${discountAmount.toFixed(0)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Includes digital proofs within 48 hours + full print release rights.
            </p>
          </div>

          <a
            href="/schedule"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-holiday-red hover:bg-holiday-reddark text-white font-extrabold text-sm rounded-xl shadow-lg transition transform hover:scale-[1.02] shrink-0"
          >
            <span>Proceed to Session Booking</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
