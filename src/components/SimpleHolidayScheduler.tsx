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

const FACILITY_NAME = 'Ashton Medical Lodge';
const SHOOT_DATE = 'Wednesday, December 2, 2026';

// 10-Minute Rapid Slot Intervals (Ashton Medical Lodge, Dec 2)
// Morning Session: 10:00 AM – 1:00 PM (18 slots, 10 min each)
const MORNING_SLOTS = [
  '10:00 AM', '10:10 AM', '10:20 AM', '10:30 AM', '10:40 AM', '10:50 AM',
  '11:00 AM', '11:10 AM', '11:20 AM', '11:30 AM', '11:40 AM', '11:50 AM',
  '12:00 PM', '12:10 PM', '12:20 PM', '12:30 PM', '12:40 PM', '12:50 PM',
];

// Photographer Lunch Break: 1:00 PM – 1:45 PM

// Afternoon & Evening Session: 1:45 PM – 7:00 PM (31 slots, 10 min each)
const AFTERNOON_SLOTS = [
  '01:45 PM', '01:55 PM',
  '02:05 PM', '02:15 PM', '02:25 PM', '02:35 PM', '02:45 PM', '02:55 PM',
  '03:05 PM', '03:15 PM', '03:25 PM', '03:35 PM', '03:45 PM', '03:55 PM',
  '04:05 PM', '04:15 PM', '04:25 PM', '04:35 PM', '04:45 PM', '04:55 PM',
  '05:05 PM', '05:15 PM', '05:25 PM', '05:35 PM', '05:45 PM', '05:55 PM',
  '06:05 PM', '06:15 PM', '06:25 PM', '06:35 PM', '06:45 PM', '06:55 PM',
];

const ALL_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'ashton-1',
    ref: 'AML-101',
    facility: FACILITY_NAME,
    date: SHOOT_DATE,
    timeSlot: '10:00 AM',
    residentName: 'Harold Jenkins',
    roomNumber: 'Room 204B',
    familyContact: 'Linda Jenkins (Daughter)',
    familyPhone: '(432) 555-0192',
    familyEmail: 'linda.jenkins@email.com',
    needsWheelchair: true,
    status: 'Checked In',
  },
  {
    id: 'ashton-2',
    ref: 'AML-102',
    facility: FACILITY_NAME,
    date: SHOOT_DATE,
    timeSlot: '10:10 AM',
    residentName: 'Evelyn Carter',
    roomNumber: 'Room 112A',
    familyContact: 'David Carter (Son)',
    familyPhone: '(432) 555-3841',
    familyEmail: 'david.c@email.com',
    needsWheelchair: false,
    status: 'Scheduled',
  },
  {
    id: 'ashton-3',
    ref: 'AML-103',
    facility: FACILITY_NAME,
    date: SHOOT_DATE,
    timeSlot: '10:20 AM',
    residentName: 'Mary Higgins',
    roomNumber: 'Room 108B',
    familyContact: 'Patricia Higgins (Daughter)',
    familyPhone: '(432) 555-6671',
    familyEmail: 'phiggins@email.com',
    needsWheelchair: true,
    status: 'Scheduled',
  },
  {
    id: 'ashton-4',
    ref: 'AML-104',
    facility: FACILITY_NAME,
    date: SHOOT_DATE,
    timeSlot: '01:45 PM',
    residentName: 'James Robinson',
    roomNumber: 'Room 315',
    familyContact: 'Marcus Robinson (Son)',
    familyPhone: '(432) 555-8812',
    familyEmail: 'marcus.r@email.com',
    needsWheelchair: false,
    status: 'Scheduled',
  },
];

export default function SimpleHolidayScheduler() {
  const [activeTab, setActiveTab] = useState<'book' | 'reschedule' | 'coordinator'>('book');
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Form State
  const [timeSlot, setTimeSlot] = useState(ALL_SLOTS[3]); // 10:30 AM
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

  // Local storage sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem('4sq_ashton_bookings_10min');
      if (saved) {
        setBookings(JSON.parse(saved));
      } else {
        localStorage.setItem('4sq_ashton_bookings_10min', JSON.stringify(INITIAL_BOOKINGS));
      }
    } catch {}
  }, []);

  const saveBookings = (newList: Booking[]) => {
    setBookings(newList);
    try {
      localStorage.setItem('4sq_ashton_bookings_10min', JSON.stringify(newList));
    } catch {}
  };

  const takenSlots = bookings.map((b) => b.timeSlot);

  // Submit Booking
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `AML-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      ref: newRef,
      facility: FACILITY_NAME,
      date: SHOOT_DATE,
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
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0B3B24', '#C41E3A', '#D4AF37'],
      });
    } catch {}
  };

  // Lookup for Reschedule
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
    setRescheduleMessage(`Success! Rescheduled to ${rescheduleSlot}. No calls to reception needed.`);
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
    setRescheduleMessage('Reservation cancelled. That 10-minute slot is now open for other families.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Event Details Banner */}
      <div className="bg-holiday-pine text-white p-4 sm:p-5 rounded-2xl shadow-md border border-holiday-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[10px] text-holiday-gold font-extrabold uppercase tracking-widest block">
            Official Holiday Photo Shoot • 10-Minute Sessions
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
            {FACILITY_NAME}
          </h2>
          <p className="text-xs text-slate-200 mt-0.5">
            📅 <strong>{SHOOT_DATE}</strong> • Main Fireside Staging Lounge
          </p>
        </div>

        <div className="bg-slate-900/60 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-slate-200">
          <p className="font-bold text-holiday-gold">10-Min Slot Hours:</p>
          <p>Morning: 10:00 AM – 1:00 PM</p>
          <p>Afternoon: 1:45 PM – 7:00 PM</p>
        </div>
      </div>

      {/* Clean 3-Tab Bar */}
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
          <span>Book 10-Min Slot</span>
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
          <span>Reschedule Slot</span>
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

      {/* TAB 1: BOOKING FORM */}
      {activeTab === 'book' && (
        <div>
          {confirmedBooking ? (
            /* Confirmation Card */
            <div className="bg-white border-2 border-holiday-pine rounded-3xl p-8 shadow-xl text-center animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-holiday-pine rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-holiday-pine" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-holiday-red bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                10-Minute Slot Confirmed
              </span>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mt-2">
                You're Scheduled for December 2nd!
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                No receptionist paper sign-up sheets needed. We'll send an automated SMS reminder before your time.
              </p>

              {/* Pass Card */}
              <div className="my-6 max-w-md mx-auto bg-holiday-pine text-white rounded-2xl p-6 text-left shadow-lg border border-holiday-gold/40">
                <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] text-holiday-gold uppercase font-bold tracking-wider">Pass Code</span>
                    <p className="text-2xl font-mono font-bold">{confirmedBooking.ref}</p>
                  </div>
                  <span className="text-xs font-bold bg-holiday-red px-3 py-1 rounded-lg text-white">
                    10-Minute Slot
                  </span>
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                  <p><strong>Resident:</strong> {confirmedBooking.residentName} ({confirmedBooking.roomNumber})</p>
                  <p><strong>Facility:</strong> {FACILITY_NAME}</p>
                  <p><strong>Date & Time:</strong> <span className="text-holiday-gold font-bold">{confirmedBooking.timeSlot}</span> on Dec 2, 2026</p>
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
                  Book Another Family Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reschedule');
                    setLookupQuery(confirmedBooking.ref);
                  }}
                  className="px-6 py-3 bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold font-bold text-xs rounded-xl shadow transition"
                >
                  Test 1-Click Reschedule
                </button>
              </div>
            </div>
          ) : (
            /* Single-Page Fast Booking Form */
            <form onSubmit={handleSubmitBooking} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {/* Step 1: Pick 10-Minute Slot */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      1. Pick Your 10-Minute Time Slot
                    </h3>
                    <p className="text-xs text-slate-500">Wednesday, December 2nd • Ashton Medical Lodge</p>
                  </div>
                  <span className="text-xs text-holiday-pine font-semibold">
                    {takenSlots.length} of {ALL_SLOTS.length} slots booked
                  </span>
                </div>

                {/* Morning Block */}
                <div className="mb-4">
                  <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Morning Block (10:00 AM – 1:00 PM • 10-Min Increments)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {MORNING_SLOTS.map((slot) => {
                      const isTaken = takenSlots.includes(slot);
                      const isSelected = timeSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setTimeSlot(slot)}
                          className={`p-2 rounded-xl border text-xs font-bold transition text-center ${
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

                {/* Photographer Lunch Divider */}
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-3 py-1.5 rounded-xl my-3 text-center font-medium">
                  ☕ 1:00 PM – 1:45 PM: Photographer Lunch & Studio Reset
                </div>

                {/* Afternoon & Evening Block */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Afternoon & Evening Block (1:45 PM – 7:00 PM • 10-Min Increments)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {AFTERNOON_SLOTS.map((slot) => {
                      const isTaken = takenSlots.includes(slot);
                      const isSelected = timeSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setTimeSlot(slot)}
                          className={`p-2 rounded-xl border text-xs font-bold transition text-center ${
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
              </div>

              {/* Step 2: Resident & Family Details */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-slate-900 font-heading mb-1">
                  2. Resident Loved One & Family Details
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Allows our Activity Coordinator to prep and escort your resident to the fireside studio on time.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resident Loved One's Full Name *
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
                      Ashton Room or Unit # *
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
                      Family Member Contact *
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
                      Cell Phone (For SMS Reminders) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={familyPhone}
                      onChange={(e) => setFamilyPhone(e.target.value)}
                      placeholder="(432) 555-0192"
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
                  <span>Resident uses a wheelchair / motorized chair (Coordinator will prepare ramp access)</span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span>Selected: <strong>{timeSlot}</strong> on <strong>Dec 2, 2026</strong></span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-holiday-red hover:bg-holiday-reddark text-white font-extrabold text-sm rounded-xl shadow-lg transition transform hover:scale-[1.02]"
                >
                  Confirm 10-Minute Photo Shoot →
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: 1-CLICK RESCHEDULER */}
      {activeTab === 'reschedule' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="max-w-xl mx-auto text-center mb-6">
            <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">
              No Calls To Receptionist Needed
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
              Change Your Ashton Photo Slot
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Enter your Pass Code (e.g. AML-101), Resident Name, or Cell Phone to view open 10-minute slots on Dec 2nd.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-2 max-w-md mx-auto mb-6">
            <input
              type="text"
              required
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="Enter AML-101, Resident Name, or Phone..."
              className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold font-bold text-xs rounded-xl shadow transition"
            >
              Find Slot
            </button>
          </form>

          {/* Quick Demo Links */}
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
              Harold Jenkins (AML-101)
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
              Evelyn Carter (AML-102)
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
                    Current Dec 2nd Slot
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
                  <span className="text-xs text-slate-500">Wednesday, Dec 2, 2026</span>
                </div>
              </div>

              {/* Open Slots */}
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Click an Open 10-Minute Slot to Switch (Automatically Frees Previous Slot)
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {ALL_SLOTS.filter((s) => s !== matchedBooking.timeSlot).map((slot) => {
                  const isTaken = bookings.some((b) => b.timeSlot === slot);
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
                  Cancel Reservation
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

      {/* TAB 3: ASHTON ACTIVITY COORDINATOR ROSTER */}
      {activeTab === 'coordinator' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-holiday-pine tracking-wider">
                  Ashton Medical Lodge • Dec 2, 2026
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  10-Min Run Sheet
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 mt-0.5">
                Activity Coordinator & Photographer Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Replaces reception paper sheet. Shows resident room numbers for floor transport.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition shrink-0"
            >
              <Printer className="w-3.5 h-3.5 text-holiday-gold" />
              <span>Print Run-Sheet</span>
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
                      <span className="block text-[10px] text-slate-400 font-normal">Dec 2, 2026</span>
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
                          <AlertCircle className="w-3 h-3" /> Wheelchair Ramp
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
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
