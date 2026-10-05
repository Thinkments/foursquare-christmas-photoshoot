import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Clock, MapPin, CheckCircle, Sparkles, Accessibility, ArrowRight, ArrowLeft, Download, ShieldCheck, Phone, Home, User, RefreshCw } from 'lucide-react';
import type { BookingRecord } from './CoordinatorRoster';
import { FACILITY_LIST, ALL_BOOKABLE_SLOTS } from '../data/facilities';

interface Campus {
  id: string;
  name: string;
  city: string;
  address: string;
  studioRoom: string;
  dates: string[];
}

const CAMPUSES: Campus[] = FACILITY_LIST.map((f) => ({
  id: f.code,
  name: `${f.name} (${f.abbr})`,
  city: f.city,
  address: f.address,
  studioRoom: f.loungeName,
  dates: f.dates ? f.dates.map((d) => d.dateStr) : [f.shootDate],
}));

export default function SchedulerWizard() {
  const [step, setStep] = useState(1);
  const [selectedCampus, setSelectedCampus] = useState<Campus>(CAMPUSES[0]);
  const [selectedDate, setSelectedDate] = useState<string>(CAMPUSES[0].dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(ALL_BOOKABLE_SLOTS[0]);

  const [formData, setFormData] = useState({
    residentName: '',
    roomNumber: '',
    familyContactName: '',
    familyEmail: '',
    familyPhone: '',
    partySize: '3',
    mobilityNotes: 'Wheelchair user - needs ramp access and seated transfer bench',
    isWheelchairNeeded: true,
    isSensoryFriendly: false,
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Sync date when campus changes
  useEffect(() => {
    if (selectedCampus && !selectedCampus.dates.includes(selectedDate)) {
      setSelectedDate(selectedCampus.dates[0]);
    }
  }, [selectedCampus]);

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const refCode = `4SQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(refCode);
    setBookingConfirmed(true);

    const newRecord: BookingRecord = {
      id: `book-${Date.now()}`,
      ref: refCode,
      campusId: selectedCampus.id,
      campusName: selectedCampus.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      residentName: formData.residentName || 'Resident Loved One',
      roomNumber: formData.roomNumber || 'Room 204B',
      familyContactName: formData.familyContactName || 'Family Contact',
      familyPhone: formData.familyPhone || '(817) 555-0192',
      familyEmail: formData.familyEmail,
      mobilityNeeds: formData.isWheelchairNeeded
        ? 'Wheelchair ramp access requested'
        : 'Standard seating',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem('4sq_master_bookings_prod');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newRecord);
      localStorage.setItem('4sq_master_bookings_prod', JSON.stringify(list));
      localStorage.setItem('4sq_xmas_booking_prod', JSON.stringify(newRecord));
    } catch {}

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0B3B24', '#C41E3A', '#D4AF37', '#FFFFFF'],
      });
    } catch {}
  };

  const downloadIcsCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Foursquare Healthcare//Christmas Resident Photo Shoot 2026//EN
BEGIN:VEVENT
UID:${bookingRef}@foursquarehealthcare.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:4SQ Christmas Photo Shoot: ${formData.residentName} (${formData.roomNumber})
DESCRIPTION:Christmas Photo Shoot with ${formData.residentName} (${formData.roomNumber})\\nCampus: ${selectedCampus.name}\\nStudio: ${selectedCampus.studioRoom}\\nRef Code: ${bookingRef}\\nNeed to Reschedule? Visit https://christmasphotos.netlify.app/reschedule?ref=${bookingRef}
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
          { num: 1, label: 'Facility' },
          { num: 2, label: '5-Min Slot' },
          { num: 3, label: 'Resident & Family' },
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
            {s.num < 3 && <div className="hidden sm:block w-12 md:w-20 h-0.5 bg-slate-200" />}
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
            Photo Session Confirmed & Logged
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 mt-3">
            Christmas Portrait Pass Issued
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
            Your 5-minute photo session with <strong className="text-slate-900">{formData.residentName || 'your loved one'}</strong> is locked in. The Activity Coordinator will coordinate with the nursing floor to ensure your resident is ready 10 minutes prior to your time.
          </p>

          {/* Ticket Card */}
          <div className="my-6 max-w-md mx-auto bg-gradient-to-br from-holiday-pine to-holiday-pinedark text-white p-6 rounded-2xl shadow-xl text-left border border-holiday-gold/40">
            <div className="flex justify-between items-start border-b border-white/20 pb-3 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-holiday-gold tracking-wider">Pass Reference</span>
                <p className="text-2xl font-mono font-bold text-white tracking-widest">{bookingRef}</p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-holiday-red text-white">
                5-Min Slot
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-200">
              <p>
                <strong className="text-white">Resident:</strong> {formData.residentName} ({formData.roomNumber})
              </p>
              <p>
                <strong className="text-white">Family Contact:</strong> {formData.familyContactName} ({formData.familyPhone})
              </p>
              <p>
                <strong className="text-white">Facility:</strong> {selectedCampus.name}
              </p>
              <p>
                <strong className="text-white">Address:</strong> {selectedCampus.address}
              </p>
              <p>
                <strong className="text-white">Studio Location:</strong> {selectedCampus.studioRoom}
              </p>
              <p>
                <strong className="text-white">Date & Time:</strong> {selectedDate} at <span className="font-bold text-holiday-gold">{selectedSlot}</span>
              </p>
            </div>
          </div>

          {/* Self-Service Reschedule Notice */}
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-4 rounded-xl text-left text-xs text-slate-700 mb-6">
            <div className="flex items-center gap-1.5 font-bold text-holiday-pine mb-1">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Need to Reschedule Later?</span>
            </div>
            <p className="text-slate-600">
              No need to call the reception desk. Simply open{' '}
              <a href={`/reschedule?ref=${bookingRef}`} className="font-bold text-holiday-red underline">
                christmasphotos.netlify.app/reschedule?ref={bookingRef}
              </a>{' '}
              to switch to any open slot in 10 seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={downloadIcsCalendar}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-holiday-wine to-holiday-crimson hover:brightness-110 text-holiday-goldlight font-bold text-sm rounded-xl shadow-lg border border-holiday-gold/40 transition"
            >
              <Download className="w-4 h-4" />
              <span>Add to Apple / Google Calendar (.ics)</span>
            </button>
            <a
              href={`/reschedule?ref=${bookingRef}`}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
            >
              Test Reschedule Flow
            </a>
          </div>
        </div>
      ) : (
        /* Wizard Steps Container */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* STEP 1: Facility Selection */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">Step 1 of 3</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
                  Select Your Resident's Healthcare Community
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Choose the facility where your family member resides or receives care across our 13 Texas locations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
                {CAMPUSES.map((c) => {
                  const isSelected = selectedCampus.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCampus(c)}
                      className={`p-4 rounded-2xl cursor-pointer border-2 transition-all duration-150 ${
                        isSelected
                          ? 'border-holiday-pine bg-holiday-pine/5 shadow-md ring-2 ring-holiday-pine/20'
                          : 'border-slate-200 hover:border-holiday-pine/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-xl bg-holiday-pine/10 text-holiday-pine mb-2">
                          <MapPin className="w-4 h-4 text-holiday-pine" />
                        </div>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-holiday-pine bg-holiday-pine/10 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{c.address}</p>
                      <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex justify-between">
                        <span><strong className="text-holiday-pine">Shoot:</strong> {c.dates[0]}</span>
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
                  <span>Continue to 5-Min Slots</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & 5-Minute Slot Selection */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">Step 2 of 3</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
                  Select Shoot Date & 5-Minute Slot
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {selectedCampus.name} • {selectedCampus.address}
                </p>
              </div>

              {/* Date Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Scheduled Shoot Date
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <span className="block text-xs font-bold">{d}</span>
                      <span className="text-[11px] opacity-80">Studio Open (10:00 AM – 7:00 PM)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5-Minute Slots Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Select Open 5-Minute Time Slot
                  </label>
                  <span className="text-[11px] text-slate-500">5-minute rapid session</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {ALL_BOOKABLE_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded-xl border text-[11px] font-bold transition text-center ${
                          isSelected
                            ? 'border-holiday-red bg-holiday-red text-white shadow-md'
                            : 'border-slate-200 bg-slate-50 hover:border-holiday-pine hover:bg-white text-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
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
                  <span>Resident & Family Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Resident Name, Room Number & Family Contact */}
          {step === 3 && (
            <form onSubmit={handleCompleteBooking}>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">Step 3 of 3</span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
                  Resident & Family Contact Information
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Essential for our Activity Coordinator to prep and escort your resident to the holiday studio on time.
                </p>
              </div>

              {/* Resident Info Box */}
              <div className="bg-holiday-pine/5 border border-holiday-pine/20 p-4 rounded-2xl mb-5">
                <span className="text-xs font-bold text-holiday-pine uppercase tracking-wider block mb-3">
                  Resident Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resident Loved One's Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.residentName}
                        onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                        placeholder="e.g. Harold Jenkins"
                        className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Facility Room or Unit # *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.roomNumber}
                        onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        placeholder="e.g. Room 204B / Memory Care West"
                        className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine"
                      />
                      <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Family Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Family Contact Lead Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.familyContactName}
                    onChange={(e) => setFormData({ ...formData, familyContactName: e.target.value })}
                    placeholder="e.g. Linda Jenkins (Daughter)"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone (for SMS Reminders) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.familyPhone}
                    onChange={(e) => setFormData({ ...formData, familyPhone: e.target.value })}
                    placeholder="(817) 555-0192"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.familyEmail}
                    onChange={(e) => setFormData({ ...formData, familyEmail: e.target.value })}
                    placeholder="linda@email.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine"
                  />
                </div>
              </div>

              {/* Accessibility Accommodations */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Accessibility className="w-4 h-4 text-holiday-pine" /> Universal Mobility & Posing Needs
                </span>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isWheelchairNeeded}
                      onChange={(e) => setFormData({ ...formData, isWheelchairNeeded: e.target.checked })}
                      className="rounded border-slate-300 text-holiday-pine focus:ring-holiday-pine"
                    />
                    <span className="font-medium">Requires Mobility Assistance</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSensoryFriendly}
                      onChange={(e) => setFormData({ ...formData, isSensoryFriendly: e.target.checked })}
                      className="rounded border-slate-300 text-holiday-pine focus:ring-holiday-pine"
                    />
                    <span>Quiet sensory pacing (no sudden flash diffusers, memory care friendly)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
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
                  <span>Confirm 5-Minute Photo Shoot</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
