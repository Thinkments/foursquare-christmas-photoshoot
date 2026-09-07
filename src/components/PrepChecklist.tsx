import React, { useState } from 'react';
import { CheckSquare, Square, Printer, ShieldCheck } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  text: string;
  desc: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'badge',
    category: 'Clinical Readiness',
    text: 'Hospital Badge & Clean Uniform',
    desc: 'If participating in shift or clinical unit portraits, ensure your Foursquare ID badge is clipped neatly and scrubs/coats are freshly pressed.',
  },
  {
    id: 'arrival',
    category: 'Scheduling & Timing',
    text: 'Arrive 5–7 Minutes Ahead of Slot',
    desc: 'Allows our team to check in your party, stage accessories, and confirm your preferred backdrop with zero rush.',
  },
  {
    id: 'props',
    category: 'Safety & Sanitation',
    text: 'Personal Holiday Props Sanitized',
    desc: 'If bringing personalized ornaments, stethoscopes, or family heirlooms, wipe down with hospital disinfectant wipes upon studio entry.',
  },
  {
    id: 'mobility',
    category: 'Universal Accessibility',
    text: 'Wheelchair / Transfer Request Checked',
    desc: 'If a resident or relative utilizes a motorized wheelchair or transfer board, our studio coordinator will have zero-threshold ramps clear.',
  },
  {
    id: 'kids',
    category: 'Santa & Family Visits',
    text: 'Prepare Wish List & Spare Clothing',
    desc: 'For toddlers visiting Santa, have their favorite comfort toy and holiday outfit ready. Wipes are available on site.',
  },
  {
    id: 'pets',
    category: 'Therapy Animals',
    text: 'Certified Therapy Animal Documentation',
    desc: 'Therapy dogs participating in resident holiday photos must have updated rabies tags and facility visitor clearance.',
  },
];

export default function PrepChecklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>(['arrival']);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const progressPercent = Math.round((checkedIds.length / CHECKLIST_ITEMS.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto stable-widget-container">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div>
            <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">
              Studio Readiness Guide
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
              Photo Shoot Preparation & Safety Checklist
            </h3>
            <p className="text-sm text-slate-600">
              Check off each item to ensure your holiday photo session is smooth, safe, and memorable.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition shrink-0"
          >
            <Printer className="w-4 h-4 text-holiday-pine" />
            <span>Print Checklist</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-gradient-to-r from-holiday-pine to-holiday-gold h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-6">
          <span>{checkedIds.length} of {CHECKLIST_ITEMS.length} items completed</span>
          <span className="text-holiday-pine">{progressPercent}% Ready</span>
        </div>

        {/* Checklist List */}
        <div className="space-y-3 mb-8">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'border-holiday-pine/40 bg-holiday-pine/5 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="mt-0.5 text-holiday-pine shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-holiday-pine" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-sm font-bold ${
                        isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {item.text}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hospital Cleanliness Commitment */}
        <div className="bg-holiday-pine/10 border border-holiday-pine/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-700">
          <ShieldCheck className="w-5 h-5 text-holiday-pine shrink-0" />
          <span>
            <strong>Texas HHS Sanitation Standard:</strong> All studio rooms are air-purified with medical-grade HEPA filtration, and high-touch props are UV-C sanitized between parties.
          </span>
        </div>
      </div>
    </div>
  );
}
