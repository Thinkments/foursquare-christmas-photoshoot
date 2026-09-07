import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Clock, MapPin, CheckCircle, Sparkles, Accessibility, ArrowRight, ArrowLeft, Download, ShieldCheck } from 'lucide-react';

interface Campus {
  id: string;
  name: string;
  city: string;
  address: string;
  studioRoom: string;
  dates: string[];
}

interface SessionType {
  id: string;
  title: string;
  duration: string;
  desc: string;
  idealFor: string;
  badge: string;
  slots: string[];
}

const CAMPUSES: Campus[] = [
  {
    id: 'dallas-regional',
    name: 'Dallas Regional Medical Center',
    city: 'Mesquite / Dallas, TX',
    address: '1011 N Galloway Ave, Mesquite, TX 75149',
    studioRoom: 'Executive Boardroom & Winter Conservatory (1st Floor West Wing)',
    dates: ['2026-12-02', '2026-12-03', '2026-12-04'],
  },
  {
    id: 'fort-worth-senior-living',
    name: 'Fort Worth Senior Living & Rehab Center',
    city: 'Fort Worth, TX',
    address: '2800 W 7th St, Fort Worth, TX 76107',
    studioRoom: 'Fireside Grand Hearth & Memory Care Courtyard Lounge',
    dates: ['2026-12-05', '2026-12-06', '2026-12-07'],
  },
  {
    id: 'plano-specialty',
    name: 'Plano Specialty Hospital Campus',
    city: 'Plano, TX',
    address: '3801 W 15th St, Plano, TX 75075',
    studioRoom: 'Winter Garden Atrium & Medical Arts Pavilion',
    dates: ['2026-12-09', '2026-12-10', '2026-12-11'],
  },
  {
    id: 'arlington-pavilion',
    name: 'Arlington Emergency Pavilion & Urgent Care',
    city: 'Arlington, TX',
    address: '800 W Randol Mill Rd, Arlington, TX 76012',
    studioRoom: 'Community Education Center & Santa Workshop Suite',
    dates: ['2026-12-12', '2026-12-13', '2026-12-14'],
  },
];

const SESSION_TYPES: SessionType[] = [
  {
    id: 'staff-express',
    title: 'Staff & Shift Express Mini-Session',
    duration: '15 Minutes',
    desc: 'Rapid portrait session formatted for 3x12 nurses and physicians before or after shift handoff. Scrubs or festive attire welcome.',
    idealFor: 'RNs, LVNs, CNAs, Techs, Physicians',
    badge: 'Shift-Friendly',
    slots: ['06:45 AM (Pre-Shift)', '07:15 AM (Post-Night)', '11:30 AM', '01:15 PM', '06:45 PM (Shift Change)'],
  },
  {
    id: 'resident-family',
    title: 'Resident & Multi-Gen Family Session',
    duration: '30 Minutes',
    desc: 'Unrushed, peaceful holiday portrait session with complete wheelchair access and gentle seated staging for residents and visiting families.',
    idealFor: 'Senior Living Residents, Rehab Patients & Relatives',
    badge: '100% ADA Accessible',
    slots: ['09:30 AM', '10:15 AM', '11:00 AM (Sensory Friendly)', '02:00 PM', '03:15 PM'],
  },
  {
    id: 'santa-experience',
    title: 'Santa Claus & North Pole Visit',
    duration: '20 Minutes',
    desc: 'Private audience with Santa Claus for healthcare employees’ children, grandkids, and visiting families. Includes candid photos and gift list moment.',
    idealFor: 'Kids, Toddlers, Grandchildren & Family Units',
    badge: 'Kids & Family',
    slots: ['10:00 AM', '11:00 AM', '01:30 PM', '02:30 PM', '03:45 PM', '05:00 PM'],
  },
  {
    id: 'unit-department',
    title: 'Unit & Department Team Holiday Card',
    duration: '30 Minutes',
    desc: 'Wide-angle group staging for clinical units, ICU/ER staff teams, pharmacy, therapy, or executive leadership teams.',
    idealFor: 'Whole Units, Shifts & Department Teams (Up to 25 people)',
    badge: 'Team Greeting Card',
    slots: ['07:00 AM (Joint Handoff)', '12:00 PM (Lunch Handoff)', '03:00 PM', '07:00 PM (Night Handoff)'],
  },
];

export default function SchedulerWizard() {
  const [step, setStep] = useState(1);
  const [selectedCampus, setSelectedCampus] = useState<Campus>(CAMPUSES[0]);
  const [selectedSession, setSelectedSession] = useState<SessionType>(SESSION_TYPES[0]);
  const [selectedDate, setSelectedDate] = useState<string>(CAMPUSES[0].dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(SESSION_TYPES[0].slots[0]);

  // Form details
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'Cardiology / Med-Surg',
    partySize: '2',
    isWheelchairNeeded: false,
    isSensoryFriendly: false,
    notes: '',
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Sync date when campus changes
  useEffect(() => {
    if (selectedCampus && !selectedCampus.dates.includes(selectedDate)) {
      setSelectedDate(selectedCampus.dates[0]);
    }
  }, [selectedCampus]);

  // Sync slot when session type changes
  useEffect(() => {
    if (selectedSession && !selectedSession.slots.includes(selectedSlot)) {
      setSelectedSlot(selectedSession.slots[0]);
    }
  }, [selectedSession]);

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = `4SQ-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(refCode);
    setBookingConfirmed(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0B3B24', '#C41E3A', '#D4AF37', '#FFFFFF'],
      });
    } catch {
      // Confetti fallback
    }

    // Save to local storage for persistent pass
    try {
      localStorage.setItem(
        '4sq_xmas_booking',
        JSON.stringify({
          ref: refCode,
          campus: selectedCampus.name,
          session: selectedSession.title,
          date: selectedDate,
          slot: selectedSlot,
          name: formData.fullName,
          email: formData.email,
        })
      );
    } catch {
      // LocalStorage fallback
    }
  };

  const downloadIcsCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Foursquare Healthcare//Christmas Photo Shoot 2026//EN
BEGIN:VEVENT
UID:${bookingRef}@foursquarehealthcare.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:4SQ Christmas Photo Shoot: ${selectedSession.title}
DESCRIPTION:Session: ${selectedSession.title}\\nCampus: ${selectedCampus.name}\\nRoom: ${selectedCampus.studioRoom}\\nRef Code: ${bookingRef}\\nContact: holiday@foursquarehealthcare.com
LOCATION:${selectedCampus.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Foursquare_Christmas_Photoshoot_${bookingRef}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto stable-widget-container">
      {/* Progress Steps Header */}
      <div className="flex items-center justify-between mb-8 px-2 sm:px-6">
        {[
          { num: 1, label: 'Campus' },
          { num: 2, label: 'Session Type' },
          { num: 3, label: 'Date & Time' },
          { num: 4, label: 'Details' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${
                step === s.num
                  ? 'bg-holiday-red text-white ring-4 ring-holiday-red/20'
                  : step > s.num
                  ? 'bg-holiday-pine text-holiday-gold border border-holiday-gold/40'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span
              className={`hidden sm:inline text-xs font-semibold uppercase tracking-wider ${
                step === s.num ? 'text-holiday-pine font-bold' : 'text-slate-500'
              }`}
            >
              {s.label}
            </span>
            {s.num < 4 && <div className="hidden sm:block w-8 md:w-12 h-0.5 bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Confirmation View */}
      {bookingConfirmed ? (
        <div className="bg-white border-2 border-holiday-gold rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-holiday-pine/10 text-holiday-pine rounded-full flex items-center justify-center mx-auto mb-4 border border-holiday-pine/20">
            <Sparkles className="w-8 h-8 text-holiday-gold" />
          </div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-holiday-red bg-holiday-red/10 px-3 py-1 rounded-full border border-holiday-red/20">
            Booking Confirmed & Guaranteed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-holiday-slate mt-3">
            You're Scheduled for Holiday Portraits!
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-2">
            A calendar confirmation has been issued. Please arrive 5 minutes prior to your time slot at the campus studio room.
          </p>

          {/* Ticket Card */}
          <div className="my-6 max-w-md mx-auto bg-gradient-to-br from-holiday-pine to-holiday-pinedark text-white p-6 rounded-2xl shadow-xl text-left border border-holiday-gold/40">
            <div className="flex justify-between items-start border-b border-white/20 pb-3 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-holiday-gold tracking-wider">Pass Reference</span>
                <p className="text-xl font-mono font-bold text-white tracking-widest">{bookingRef}</p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-holiday-red text-white">
                {selectedSession.duration}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-200">
              <p>
                <strong className="text-white">Session:</strong> {selectedSession.title}
              </p>
              <p>
                <strong className="text-white">Campus:</strong> {selectedCampus.name}
              </p>
              <p>
                <strong className="text-white">Studio Room:</strong> {selectedCampus.studioRoom}
              </p>
              <p>
                <strong className="text-white">Date & Time:</strong> {selectedDate} at {selectedSlot}
              </p>
              <p>
                <strong className="text-white">Primary Guest:</strong> {formData.fullName || 'Foursquare Team Member'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={downloadIcsCalendar}
              className="inline-flex items-center gap-2 px-6 py-3 bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold font-bold text-sm rounded-xl shadow-lg transition"
            >
              <Download className="w-4 h-4" />
              <span>Add to Apple / Google Calendar (.ics)</span>
            </button>
            <button
              onClick={() => {
                setBookingConfirmed(false);
                setStep(1);
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
            >
              Book Another Session
            </button>
          </div>
        </div>
      ) : (
        /* Wizard Steps Container */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* STEP 1: Campus Selection */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">Step 1 of 4</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
                  Select Your Foursquare Facility Campus
                </h3>
                <p className="text-sm text-slate-600">
                  Select where you or your family will participate in this year's Christmas portrait sessions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CAMPUSES.map((c) => {
                  const isSelected = selectedCampus.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCampus(c)}
                      className={`p-5 rounded-2xl cursor-pointer border-2 transition-all duration-150 ${
                        isSelected
                          ? 'border-holiday-pine bg-holiday-pine/5 shadow-md ring-2 ring-holiday-pine/20'
                          : 'border-slate-200 hover:border-holiday-pine/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-xl bg-holiday-pine/10 text-holiday-pine mb-3">
                          <MapPin className="w-5 h-5 text-holiday-pine" />
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs font-bold text-holiday-pine bg-holiday-pine/10 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3.5 h-3.5" /> Selected
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{c.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{c.address}</p>
                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <span className="font-semibold text-holiday-pine">Studio Location:</span> {c.studioRoom}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-holiday-pine hover:bg-holiday-pinelight text-white font-bold text-sm rounded-xl shadow-lg transition"
                >
                  <span>Continue to Session Types</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Session Type Selection */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">Step 2 of 4</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
                  Choose Your Holiday Portrait Experience
                </h3>
                <p className="text-sm text-slate-600">
                  Custom-tailored sessions for clinical staff, nursing teams, residents, and families.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SESSION_TYPES.map((s) => {
                  const isSelected = selectedSession.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSession(s)}
                      className={`p-5 rounded-2xl cursor-pointer border-2 transition-all duration-150 flex flex-col justify-between ${
                        isSelected
                          ? 'border-holiday-pine bg-holiday-pine/5 shadow-md ring-2 ring-holiday-pine/20'
                          : 'border-slate-200 hover:border-holiday-pine/50 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-holiday-red/10 text-holiday-red border border-holiday-red/20">
                            {s.badge}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-holiday-gold" /> {s.duration}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">{s.title}</h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{s.desc}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                        <strong className="text-slate-700">Recommended for:</strong> {s.idealFor}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-holiday-pine hover:bg-holiday-pinelight text-white font-bold text-sm rounded-xl shadow-lg transition"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Date & Time Selection */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">Step 3 of 4</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
                  Select Studio Date & Time Slot
                </h3>
                <p className="text-sm text-slate-600">
                  {selectedCampus.name} • {selectedSession.title} ({selectedSession.duration})
                </p>
              </div>

              {/* Date Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Choose Available Session Date
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedCampus.dates.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`p-3.5 rounded-xl border text-center transition ${
                        selectedDate === d
                          ? 'border-holiday-pine bg-holiday-pine text-white shadow-md'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Calendar className={`w-4 h-4 mx-auto mb-1 ${selectedDate === d ? 'text-holiday-gold' : 'text-slate-400'}`} />
                      <span className="block text-sm font-bold">{d}</span>
                      <span className="text-[11px] opacity-80">Studio Open</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Select Shift-Friendly Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedSession.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-sm font-semibold transition ${
                        selectedSlot === slot
                          ? 'border-holiday-red bg-holiday-red text-white shadow-md'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-holiday-pine hover:bg-holiday-pinelight text-white font-bold text-sm rounded-xl shadow-lg transition"
                >
                  <span>Enter Guest Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Guest Details & Accommodations */}
          {step === 4 && (
            <form onSubmit={handleCompleteBooking}>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">Step 4 of 4</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
                  Guest Information & Accessibility
                </h3>
                <p className="text-sm text-slate-600">
                  Ensure our holiday photography team is fully prepared for your party.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Contact Lead *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Nurse Sarah Jenkins, BSN"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine focus:border-holiday-pine"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Email or Personal Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah.jenkins@foursquarehealthcare.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine focus:border-holiday-pine"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cell Phone (for SMS Slot Reminder)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(214) 555-0199"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine focus:border-holiday-pine"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department / Clinical Unit or Relation</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. ICU Night Shift / Resident Family"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine focus:border-holiday-pine"
                  />
                </div>
              </div>

              {/* Accessibility Accommodations */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Accessibility className="w-4 h-4 text-holiday-pine" /> Universal Accessibility & Special Requests
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isWheelchairNeeded}
                      onChange={(e) => setFormData({ ...formData, isWheelchairNeeded: e.target.checked })}
                      className="rounded border-slate-300 text-holiday-pine focus:ring-holiday-pine"
                    />
                    <span>Wheelchair / Bariatric transfer assistance & zero-threshold ramp needed</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSensoryFriendly}
                      onChange={(e) => setFormData({ ...formData, isSensoryFriendly: e.target.checked })}
                      className="rounded border-slate-300 text-holiday-pine focus:ring-holiday-pine"
                    />
                    <span>Low-stimulation sensory environment (quiet ambient lighting, no sudden flash)</span>
                  </label>
                </div>
              </div>

              {/* Summary recap box */}
              <div className="bg-holiday-pine/10 border border-holiday-pine/20 rounded-xl p-3.5 mb-6 text-xs text-slate-700">
                <strong className="text-holiday-pine">Selected Appointment:</strong> {selectedCampus.name} •{' '}
                {selectedSession.title} on <span className="font-bold text-slate-900">{selectedDate}</span> at{' '}
                <span className="font-bold text-slate-900">{selectedSlot}</span>.
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-holiday-red hover:bg-holiday-reddark text-white font-extrabold text-sm rounded-xl shadow-xl transition transform hover:scale-[1.02]"
                >
                  <ShieldCheck className="w-4 h-4 text-holiday-gold" />
                  <span>Confirm Holiday Photo Session</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
