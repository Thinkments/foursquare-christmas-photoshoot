import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Clock, CheckCircle2, RefreshCw, Printer, AlertCircle } from 'lucide-react';

interface Booking {
  id: string;
  ref: string;
  facility: string;
  date: string;
  timeSlot: string;
  residentName: string;
  roomNumber: string;
  familyContact: string;
  familyPhone: string;
  familyEmail: string;
  needsWheelchair: boolean;
  status: 'Scheduled' | 'Checked In' | 'Complete';
}

const FACILITIES = [
  { id: 'fw', name: 'Fort Worth Senior Living & Rehab', address: '2800 W 7th St, Fort Worth', room: 'Fireside Grand Hearth', dates: ['Dec 5, 2026', 'Dec 6, 2026', 'Dec 7, 2026'] },
  { id: 'dal', name: 'Dallas Regional Medical Center & Rehab', address: '1011 N Galloway Ave, Mesquite', room: 'Winter Conservatory (1st Floor)', dates: ['Dec 2, 2026', 'Dec 3, 2026', 'Dec 4, 2026'] },
  { id: 'pln', name: 'Plano Specialty Hospital & Rehab', address: '3801 W 15th St, Plano', room: 'Winter Garden Atrium', dates: ['Dec 9, 2026', 'Dec 10, 2026'] },
  { id: 'arl', name: 'Arlington Emergency & Living Center', address: '800 W Randol Mill Rd, Arlington', room: 'Santa Suite (Suite 100)', dates: ['Dec 12, 2026', 'Dec 13, 2026'] },
];

const ALL_SLOTS = [
  '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM',
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
  '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM',
  '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-1',
    ref: '4SQ-101',
    facility: 'Fort Worth Senior Living & Rehab',
    date: 'Dec 5, 2026',
    timeSlot: '09:00 AM',
    residentName: 'Harold Jenkins',
    roomNumber: 'Room 204B',
    familyContact: 'Linda Jenkins (Daughter)',
    familyPhone: '(817) 555-0192',
    familyEmail: 'linda@email.com',
    needsWheelchair: true,
    status: 'Checked In',
  },
  {
    id: 'b-2',
    ref: '4SQ-102',
    facility: 'Fort Worth Senior Living & Rehab',
    date: 'Dec 5, 2026',
    timeSlot: '09:15 AM',
    residentName: 'Evelyn Carter',
    roomNumber: 'Room 112A',
    familyContact: 'David Carter (Son)',
    familyPhone: '(817) 555-3841',
    familyEmail: 'david@email.com',
    needsWheelchair: false,
    status: 'Scheduled',
  },
  {
    id: 'b-3',
    ref: '4SQ-103',
    facility: 'Fort Worth Senior Living & Rehab',
    date: 'Dec 5, 2026',
    timeSlot: '09:30 AM',
    residentName: 'Mary Higgins',
    roomNumber: 'Room 108B',
    familyContact: 'Patricia Higgins (Daughter)',
    familyPhone: '(817) 555-6671',
    familyEmail: 'patricia@email.com',
    needsWheelchair: true,
    status: 'Scheduled',
  }
];

export default function SimpleHolidayScheduler() {
  const [activeTab, setActiveTab] = useState<'book' | 'reschedule' | 'coordinator'>('book');

  // Master State
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Booking Form State
  const [facility, setFacility] = useState(FACILITIES[0]);
  const [date, setDate] = useState(FACILITIES[0].dates[0]);
  const [timeSlot, setTimeSlot] = useState(ALL_SLOTS[3]); // 09:45 AM
  const [residentName, setResidentName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [familyContact, setFamilyContact] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [familyEmail, setFamilyEmail] = useState('');
  const [needsWheelchair, setNeedsWheelchair] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Reschedule State
  const [lookupQuery, setLookupQuery] = useState('');
  const [matchedBooking, setMatchedBooking] = useState<Booking | null>(null);
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [rescheduleMessage, setRescheduleMessage] = useState('');

  // Coordinator State
  const [coordSearch, setCoordSearch] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('4sq_simple_bookings');
      if (saved) {
        setBookings(JSON.parse(saved));
      } else {
        localStorage.setItem('4sq_simple_bookings', JSON.stringify(INITIAL_BOOKINGS));
      }
    } catch {}
  }, []);

  // Save changes
  const saveBookings = (newList: Booking[]) => {
    setBookings(newList);
    try {
      localStorage.setItem('4sq_simple_bookings', JSON.stringify(newList));
    } catch {}
  };

  // Taken slots for current facility & date
  const takenSlots = bookings
    .filter((b) => b.facility === facility.name && b.date === date)
    .map((b) => b.timeSlot);

  // Handle New Booking
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `4SQ-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      ref: newRef,
      facility: facility.name,
      date,
      timeSlot,
      residentName: residentName.trim(),
      roomNumber: roomNumber.trim(),
      familyContact: familyContact.trim(),
      familyPhone: familyPhone.trim(),
      familyEmail: familyEmail.trim(),
      needsWheelchair,
      status: 'Scheduled',
    };

    const updated = [newBooking, ...bookings];
    saveBookings(updated);
    setConfirmedBooking(newBooking);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0B3B24', '#C41E3A', '#D4AF37'],
      });
    } catch {}
  };

  // Handle Reschedule Lookup
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduleMessage('');
    const cleanQ = lookupQuery.toLowerCase().trim();
    const cleanPhone = lookupQuery.replace(/\D/g, '');

    const found = bookings.find(
      (b) =>
        b.ref.toLowerCase() === cleanQ ||
        b.residentName.toLowerCase().includes(cleanQ) ||
        (cleanPhone.length >= 7 && b.familyPhone.replace(/\D/g, '').includes(cleanPhone))
    );

    setMatchedBooking(found || null);
    if (!found) {
      setRescheduleMessage('No reservation found matching that name, phone, or pass code.');
    }
  };

  // Confirm Reschedule
  const handleConfirmReschedule = () => {
    if (!matchedBooking || !rescheduleSlot) return;

    const updated = bookings.map((b) =>
      b.id === matchedBooking.id ? { ...b, timeSlot: rescheduleSlot } : b
    );
    saveBookings(updated);
    setMatchedBooking({ ...matchedBooking, timeSlot: rescheduleSlot });
    setRescheduleMessage(`Success! Rescheduled to ${rescheduleSlot}. No phone calls needed.`);
    setRescheduleSlot('');

    try {
      confetti({ particleCount: 70, spread: 60, colors: ['#0B3B24', '#D4AF37'] });
    } catch {}
  };

  // Cancel Booking
  const handleCancelBooking = () => {
    if (!matchedBooking) return;
    const updated = bookings.filter((b) => b.id !== matchedBooking.id);
    saveBookings(updated);
    setMatchedBooking(null);
    setRescheduleMessage('Reservation cancelled. The 15-minute slot is now open for other families.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex bg-slate-200/80 p-1.5 rounded-2xl mb-8 max-w-xl mx-auto border border-slate-300/60 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveTab('book');
            setConfirmedBooking(null);
          }}
          className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'book'
              ? 'bg-holiday-pine text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-holiday-gold" />
          <span>Book Photo Shoot</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('reschedule');
            setRescheduleMessage('');
          }}
          className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'reschedule'
              ? 'bg-holiday-pine text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-holiday-gold" />
          <span>Change / Reschedule</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coordinator')}
          className={`flex-1 py-3 px-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'coordinator'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-holiday-gold" />
          <span>Day-of Roster</span>
        </button>
      </div>

      {/* TAB 1: SIMPLE BOOKING FORM */}
      {activeTab === 'book' && (
        <div>
          {confirmedBooking ? (
            /* Instant Confirmation Card */
            <div className="bg-white border-2 border-holiday-pine rounded-3xl p-8 shadow-xl text-center animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-holiday-pine rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-holiday-pine" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-holiday-red bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Reservation Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-2">
                Photo Shoot Locked In!
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                The receptionist sheet is replaced. An automated reminder will be sent before your session.
              </p>

              {/* Pass Box */}
              <div className="my-6 max-w-md mx-auto bg-holiday-pine text-white rounded-2xl p-6 text-left shadow-lg border border-holiday-gold/30">
                <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] text-holiday-gold uppercase font-bold tracking-wider">Pass Code</span>
                    <p className="text-2xl font-mono font-bold">{confirmedBooking.ref}</p>
                  </div>
                  <span className="text-xs font-bold bg-holiday-red px-3 py-1 rounded-lg text-white">
                    15-Minute Slot
                  </span>
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                  <p><strong>Resident:</strong> {confirmedBooking.residentName} ({confirmedBooking.roomNumber})</p>
                  <p><strong>Time:</strong> <span className="text-holiday-gold font-bold">{confirmedBooking.timeSlot}</span> on {confirmedBooking.date}</p>
                  <p><strong>Facility:</strong> {confirmedBooking.facility}</p>
                  <p><strong>Family Contact:</strong> {confirmedBooking.familyContact} ({confirmedBooking.familyPhone})</p>
                  {confirmedBooking.needsWheelchair && (
                    <p className="text-holiday-gold font-semibold">✓ Wheelchair ramp assistance flagged for staff</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setResidentName('');
                    setRoomNumber('');
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                >
                  Book Another Resident
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reschedule');
                    setLookupQuery(confirmedBooking.ref);
                  }}
                  className="px-6 py-3 bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold font-bold text-xs rounded-xl shadow transition"
                >
                  Test Reschedule Button
                </button>
              </div>
            </div>
          ) : (
            /* Simple 3-Step Booking Wizard */
            <form onSubmit={handleSubmitBooking} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {/* 1. Facility & Date */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-holiday-pine text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="text-base font-bold text-slate-900 font-heading">Choose Facility & Date</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {FACILITIES.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => {
                        setFacility(f);
                        setDate(f.dates[0]);
                      }}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                        facility.id === f.id
                          ? 'border-holiday-pine bg-holiday-pine/5 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">{f.name}</h4>
                      <p className="text-[11px] text-slate-500">{f.room}</p>
                    </div>
                  ))}
                </div>

                {/* Dates row */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Shoot Date
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {facility.dates.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDate(d)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                          date === d
                            ? 'bg-holiday-pine text-white shadow'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Pick 15-Minute Slot */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-holiday-pine text-white text-xs font-bold flex items-center justify-center">2</span>
                    <h3 className="text-base font-bold text-slate-900 font-heading">Pick an Open 15-Minute Slot</h3>
                  </div>
                  <span className="text-[11px] text-slate-500">Photographer back-to-back schedule</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {ALL_SLOTS.map((slot) => {
                    const isTaken = takenSlots.includes(slot);
                    const isSelected = timeSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isTaken}
                        onClick={() => setTimeSlot(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                          isTaken
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-holiday-red border-holiday-red text-white shadow-md'
                            : 'bg-white border-slate-300 hover:border-holiday-pine text-slate-800'
                        }`}
                      >
                        <span>{slot}</span>
                        {isTaken && <span className="block text-[9px] font-normal no-underline">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Resident & Family Info */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-holiday-pine text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="text-base font-bold text-slate-900 font-heading">Resident Loved One & Family Contact</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resident Name (Who Lives Here) *
                    </label>
                    <input
                      type="text"
                      required
                      value={residentName}
                      onChange={(e) => setResidentName(e.target.value)}
                      placeholder="e.g. Harold Jenkins"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Room or Unit # *
                    </label>
                    <input
                      type="text"
                      required
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g. Room 204B"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Family Member Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={familyContact}
                      onChange={(e) => setFamilyContact(e.target.value)}
                      placeholder="e.g. Linda Jenkins (Daughter)"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cell Phone (For SMS Reminder) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={familyPhone}
                      onChange={(e) => setFamilyPhone(e.target.value)}
                      placeholder="(817) 555-0192"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={familyEmail}
                      onChange={(e) => setFamilyEmail(e.target.value)}
                      placeholder="linda@email.com"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsWheelchair}
                    onChange={(e) => setNeedsWheelchair(e.target.checked)}
                    className="rounded text-holiday-pine focus:ring-holiday-pine w-4 h-4"
                  />
                  <span>Resident uses wheelchair / motorized chair (Activity Coordinator will prep ramp access)</span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span>Selected: <strong>{timeSlot}</strong> on <strong>{date}</strong> at {facility.name}</span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-holiday-red hover:bg-holiday-reddark text-white font-extrabold text-sm rounded-xl shadow-lg transition transform hover:scale-[1.02]"
                >
                  Confirm 15-Minute Photo Shoot →
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: SIMPLE 1-CLICK RESCHEDULER */}
      {activeTab === 'reschedule' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="max-w-xl mx-auto text-center mb-6">
            <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">
              No Receptionist Calls Needed
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
              Switch or Cancel Your Shoot Slot
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Enter your Pass Code (e.g. 4SQ-101), Resident Name, or Cell Phone to view open slots.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-2 max-w-md mx-auto mb-6">
            <input
              type="text"
              required
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter 4SQ-101 or Resident Name..."
              className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold font-bold text-xs rounded-xl shadow transition"
            >
              Lookup
            </button>
          </form>

          {/* Quick Demo Buttons */}
          <div className="text-center text-xs text-slate-500 mb-6 flex items-center justify-center gap-2">
            <span>Quick Test:</span>
            <button
              type="button"
              onClick={() => {
                setLookupQuery('Harold Jenkins');
                setMatchedBooking(bookings[0]);
              }}
              className="text-holiday-pine underline font-semibold"
            >
              Harold Jenkins (4SQ-101)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setLookupQuery('Evelyn Carter');
                setMatchedBooking(bookings[1]);
              }}
              className="text-holiday-pine underline font-semibold"
            >
              Evelyn Carter (4SQ-102)
            </button>
          </div>

          {rescheduleMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center mb-6 font-semibold">
              {rescheduleMessage}
            </div>
          )}

          {matchedBooking && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-holiday-pine uppercase bg-holiday-pine/10 px-2 py-0.5 rounded">
                    Current Reservation
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {matchedBooking.residentName} ({matchedBooking.roomNumber})
                  </h4>
                  <p className="text-xs text-slate-500">
                    Contact: {matchedBooking.familyContact} • {matchedBooking.familyPhone}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold font-heading text-holiday-pine block">
                    {matchedBooking.timeSlot}
                  </span>
                  <span className="text-xs text-slate-500">{matchedBooking.date}</span>
                </div>
              </div>

              {/* Open Slots for Reschedule */}
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Click an Open Slot to Switch (Frees Previous Slot Automatically)
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                {ALL_SLOTS.filter((s) => s !== matchedBooking.timeSlot).map((slot) => {
                  const isTaken = bookings.some(
                    (b) => b.facility === matchedBooking.facility && b.date === matchedBooking.date && b.timeSlot === slot
                  );
                  const isSelected = rescheduleSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setRescheduleSlot(slot)}
                      className={`p-2 rounded-lg border text-xs font-bold transition ${
                        isTaken
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-holiday-red text-white border-holiday-red shadow'
                          : 'bg-white hover:border-holiday-pine text-slate-800'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800"
                >
                  Cancel This Shoot Slot
                </button>

                <button
                  type="button"
                  disabled={!rescheduleSlot}
                  onClick={handleConfirmReschedule}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow transition ${
                    rescheduleSlot
                      ? 'bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Switch to {rescheduleSlot || '...'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COORDINATOR & PHOTOGRAPHER LIVE ROSTER */}
      {activeTab === 'coordinator' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-holiday-pine tracking-wider">
                  Replaces Paper Sheet
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 mt-0.5">
                Activity Coordinator & Photographer Day-of Run Sheet
              </h3>
              <p className="text-xs text-slate-500">
                Shows exact room numbers for patient transport and photographer pacing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-holiday-gold" />
              <span>Print Clipboard Sheet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b">
                  <th className="p-3">Time</th>
                  <th className="p-3">Resident & Room</th>
                  <th className="p-3">Family Contact</th>
                  <th className="p-3">Mobility</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-holiday-pine whitespace-nowrap">
                      {b.timeSlot}
                      <span className="block text-[10px] text-slate-400 font-normal">{b.date}</span>
                    </td>
                    <td className="p-3">
                      <strong className="text-slate-900 text-xs block">{b.residentName}</strong>
                      <span className="text-[11px] font-bold text-blue-700">{b.roomNumber}</span>
                    </td>
                    <td className="p-3 text-xs">
                      {b.familyContact}
                      <span className="block text-[10px] text-slate-500">{b.familyPhone}</span>
                    </td>
                    <td className="p-3 text-[11px]">
                      {b.needsWheelchair ? (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Wheelchair / Ramp
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard Posing</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => {
                          const updated = bookings.map((item) =>
                            item.id === b.id ? { ...item, status: e.target.value as any } : item
                          );
                          saveBookings(updated);
                        }}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${
                          b.status === 'Checked In'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : b.status === 'Complete'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Checked In">Checked In</option>
                        <option value="Complete">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
