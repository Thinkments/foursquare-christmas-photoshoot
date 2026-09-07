import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  CheckCircle2,
  RefreshCw,
  Printer,
  AlertCircle,
  Link2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Camera,
  Coffee,
  MapPin,
} from 'lucide-react';
import {
  FOURSQUARE_FACILITIES,
  FACILITY_LIST,
  MORNING_SLOTS,
  AFTERNOON_SLOTS,
  ALL_BOOKABLE_SLOTS,
  DEPT_HEAD_SLOT,
  LUNCH_BREAK,
  type FacilityConfig,
} from '../data/facilities';

interface Booking {
  id: string;
  ref: string;
  facilityCode: string;
  facilityName: string;
  date: string;
  timeSlot: string;
  residentName: string;
  roomNumber: string;
  familyContact: string;
  familyPhone: string;
  familyEmail: string;
  needsWheelchair: boolean;
  status: 'Scheduled' | 'Checked In' | 'Complete';
  createdAt: string;
}

interface Props {
  facilityCode: string;
  forcedDate?: string;
}

export default function FacilityScheduler({ facilityCode, forcedDate }: Props) {
  const facility = FOURSQUARE_FACILITIES[facilityCode.toLowerCase()] || FOURSQUARE_FACILITIES.aml;

  // Multi-day date selector (e.g. for CML)
  const initialDate = forcedDate || (facility.dates ? facility.dates[0].dateStr : facility.shootDate);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);

  const [activeTab, setActiveTab] = useState<'book' | 'reschedule' | 'coordinator'>('book');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Form State
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM');
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

  const storageKey = `4sq_bookings_${facility.code}`;

  // Default seed bookings for realistic demo
  const getInitialBookings = (): Booking[] => [
    {
      id: `${facility.code}-1`,
      ref: `${facility.abbr}-101`,
      facilityCode: facility.code,
      facilityName: facility.name,
      date: selectedDate,
      timeSlot: '10:00 AM',
      residentName: 'Harold Jenkins',
      roomNumber: 'Room 204B',
      familyContact: 'Linda Jenkins (Daughter)',
      familyPhone: '(432) 555-0192',
      familyEmail: 'linda.jenkins@email.com',
      needsWheelchair: true,
      status: 'Checked In',
      createdAt: new Date().toISOString(),
    },
    {
      id: `${facility.code}-2`,
      ref: `${facility.abbr}-102`,
      facilityCode: facility.code,
      facilityName: facility.name,
      date: selectedDate,
      timeSlot: '10:10 AM',
      residentName: 'Evelyn Carter',
      roomNumber: 'Room 112A',
      familyContact: 'David Carter (Son)',
      familyPhone: '(432) 555-3841',
      familyEmail: 'david.c@email.com',
      needsWheelchair: false,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    },
    {
      id: `${facility.code}-3`,
      ref: `${facility.abbr}-103`,
      facilityCode: facility.code,
      facilityName: facility.name,
      date: selectedDate,
      timeSlot: '10:20 AM',
      residentName: 'Robert Vance',
      roomNumber: 'Room 305C',
      familyContact: 'Angela Vance (Spouse)',
      familyPhone: '(432) 555-9012',
      familyEmail: 'avance@email.com',
      needsWheelchair: false,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    },
  ];

  // Helper to generate the exact 1-click reschedule link
  const getRescheduleUrl = (refCode: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/reschedule?facility=${facility.code}&ref=${encodeURIComponent(refCode)}`;
    }
    return `https://foursquare-christmas-photoshoot.netlify.app/reschedule?facility=${facility.code}&ref=${encodeURIComponent(refCode)}`;
  };

  // 1-Click Copy Link with feedback
  const handleCopyLink = (refCode: string) => {
    const url = getRescheduleUrl(refCode);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedRef(refCode);
    setTimeout(() => setCopiedRef(null), 3000);
  };

  // Load from local storage and handle ?ref= query params
  useEffect(() => {
    let list: Booking[] = [];
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        list = JSON.parse(saved);
      } else {
        list = getInitialBookings();
        localStorage.setItem(storageKey, JSON.stringify(list));
      }
    } catch {
      list = getInitialBookings();
    }
    setBookings(list);

    // Auto-detect URL query params (?ref=... or ?tab=...)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      const tab = params.get('tab');

      if (ref || tab === 'reschedule') {
        setActiveTab('reschedule');
        if (ref) {
          setLookupQuery(ref);
          const cleanQ = ref.toLowerCase().trim();
          const cleanPhone = ref.replace(/\D/g, '');
          const found = list.find(
            (b) =>
              b.ref.toLowerCase() === cleanQ ||
              b.residentName.toLowerCase().includes(cleanQ) ||
              (cleanPhone.length >= 7 && b.familyPhone.replace(/\D/g, '').includes(cleanPhone))
          );
          if (found) setMatchedBooking(found);
        }
      } else if (tab === 'coordinator') {
        setActiveTab('coordinator');
      }
    }
  }, [facility.code, selectedDate]);

  const saveBookings = (newList: Booking[]) => {
    setBookings(newList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newList));
      // Also backup to global Ashton storage if AML
      if (facility.code === 'aml') {
        localStorage.setItem('4sq_ashton_bookings_10min', JSON.stringify(newList));
      }
    } catch {}
  };

  // Booked slots for currently selected date
  const bookedSlots = bookings.filter((b) => b.date === selectedDate).map((b) => b.timeSlot);

  // Submit Booking
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `${facility.abbr}-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking: Booking = {
      id: `${facility.code}-${Date.now()}`,
      ref: newRef,
      facilityCode: facility.code,
      facilityName: facility.name,
      date: selectedDate,
      timeSlot,
      residentName: residentName.trim(),
      roomNumber: roomNumber.trim(),
      familyContact: familyContact.trim(),
      familyPhone: familyPhone.trim(),
      familyEmail: familyEmail.trim(),
      needsWheelchair,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
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

  // Lookup for Rescheduling
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
      setRescheduleMessage('No reservation found matching that pass code, resident name, or phone number.');
    }
  };

  // Confirm Reschedule
  const handleConfirmReschedule = () => {
    if (!matchedBooking || !rescheduleSlot) return;

    const updated = bookings.map((b) =>
      b.id === matchedBooking.id ? { ...b, timeSlot: rescheduleSlot, date: selectedDate } : b
    );
    saveBookings(updated);
    setMatchedBooking({ ...matchedBooking, timeSlot: rescheduleSlot, date: selectedDate });
    setRescheduleMessage(`Success! Rescheduled to ${rescheduleSlot} on ${selectedDate}. No calls to reception needed.`);
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
    setRescheduleMessage('Reservation cancelled. That 10-minute slot is now open for another family.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Facility Header Badge & Operational Notice */}
      <div className="bg-holiday-pine text-white p-5 rounded-3xl shadow-lg border border-holiday-gold/40 mb-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold text-holiday-gold tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full border border-holiday-gold/30">
                {facility.abbr} • Foursquare Healthcare
              </span>
              <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-holiday-gold" /> {facility.city}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              {facility.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              📅 <strong>{facility.shootDate}</strong> • {facility.loungeName}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-holiday-gold/30 p-3 rounded-2xl text-xs text-slate-200 shrink-0">
            <p className="font-bold text-holiday-gold mb-0.5">Official Shoot Schedule:</p>
            <p>• <strong>10:00 AM – 7:00 PM</strong> (10-Min Slots)</p>
            <p>• <strong>12:00 PM</strong>: Dept Head Picture</p>
            <p>• <strong>1:00 – 1:45 PM</strong>: Studio Lunch Reset</p>
          </div>
        </div>

        {/* Multi-Day Selector for CML (11/9 & 11/10) */}
        {facility.dates && facility.dates.length > 1 && (
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-2">
            <span className="text-xs text-holiday-gold font-bold uppercase tracking-wider">
              Select Shoot Date:
            </span>
            {facility.dates.map((d) => (
              <button
                key={d.shortDate}
                type="button"
                onClick={() => setSelectedDate(d.dateStr)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  selectedDate === d.dateStr
                    ? 'bg-holiday-red text-white shadow-md border border-white/40'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{d.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3-Tab Console */}
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
            <div className="bg-white border-2 border-holiday-pine rounded-3xl p-6 sm:p-8 shadow-xl text-center animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-holiday-pine rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-holiday-pine" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-holiday-red bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                10-Minute Slot Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-2">
                You're Scheduled at {facility.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                No receptionist paper clipboard needed. Your slot is locked in real-time.
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
                  <p><strong>Facility:</strong> {facility.name}</p>
                  <p><strong>Date & Time:</strong> <span className="text-holiday-gold font-bold">{confirmedBooking.timeSlot}</span> on {confirmedBooking.date}</p>
                  <p><strong>Family Contact:</strong> {confirmedBooking.familyContact} ({confirmedBooking.familyPhone})</p>
                  {confirmedBooking.needsWheelchair && (
                    <p className="text-holiday-gold font-semibold">✓ Wheelchair ramp assistance flagged for staff</p>
                  )}
                </div>
              </div>

              {/* Dedicated Reschedule Link Box */}
              <div className="my-5 max-w-md mx-auto bg-slate-50 border-2 border-dashed border-holiday-pine/40 rounded-2xl p-4 text-left shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Link2 className="w-4 h-4 text-holiday-pine" />
                    <span>Your Direct Reschedule Link</span>
                  </div>
                  <span className="text-[10px] bg-holiday-pine/10 text-holiday-pine font-bold px-2 py-0.5 rounded-full">
                    Save or Bookmark
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                  Need to change your time later? You don't have to call reception. Click this private link to switch to any open 10-minute slot instantly:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getRescheduleUrl(confirmedBooking.ref)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyLink(confirmedBooking.ref)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold text-xs font-bold rounded-xl shadow transition shrink-0"
                  >
                    {copiedRef === confirmedBooking.ref ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <a
                    href={getRescheduleUrl(confirmedBooking.ref)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-holiday-pine hover:text-holiday-pinelight font-bold underline"
                  >
                    <span>Test Reschedule Link in new tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-400 font-mono">Ref: {confirmedBooking.ref}</span>
                </div>
              </div>

              {/* Simulated SMS Alert Preview */}
              <div className="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-left mb-6 text-xs text-emerald-950 flex gap-3 items-start">
                <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-800">
                    Automated SMS Confirmation (Simulated to {confirmedBooking.familyPhone}):
                  </p>
                  <p className="text-emerald-900 mt-1 text-[11px] leading-relaxed italic">
                    "🎄 {facility.name}: Photo shoot confirmed for {confirmedBooking.residentName} on {confirmedBooking.date} at {confirmedBooking.timeSlot}. To reschedule without calling reception, use your private link: {getRescheduleUrl(confirmedBooking.ref)}"
                  </p>
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
                    setMatchedBooking(confirmedBooking);
                  }}
                  className="px-6 py-3 bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold font-bold text-xs rounded-xl shadow transition"
                >
                  Open 1-Click Reschedule Tab
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmitBooking} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {/* Step 1: Pick 10-Minute Slot */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      1. Pick Your 10-Minute Time Slot
                    </h3>
                    <p className="text-xs text-slate-500">{facility.name} • {selectedDate}</p>
                  </div>
                  <span className="text-xs text-holiday-pine font-semibold">
                    {bookedSlots.length} of {ALL_BOOKABLE_SLOTS.length} booked
                  </span>
                </div>

                {/* Morning Block */}
                <div className="mb-5">
                  <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Morning Sessions (10:00 AM – 1:00 PM)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {MORNING_SLOTS.map((slot) => {
                      if (slot === DEPT_HEAD_SLOT) {
                        return (
                          <div
                            key={slot}
                            className="p-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-center flex flex-col justify-center items-center col-span-2 sm:col-span-2"
                            title="Locked for Department Head Picture"
                          >
                            <span className="text-[11px] font-extrabold flex items-center gap-1">
                              <Camera className="w-3 h-3 text-amber-700" /> 12:00 PM: Dept Head Photo
                            </span>
                            <span className="text-[9px] text-amber-700">Reserved (Staff Group)</span>
                          </div>
                        );
                      }

                      const isTaken = bookedSlots.includes(slot);
                      const isSelected = timeSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setTimeSlot(slot)}
                          className={`p-2 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center ${
                            isTaken
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-holiday-red text-white border-holiday-red shadow-md scale-105'
                              : 'bg-white hover:border-holiday-pine text-slate-800'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className="text-[9px] font-normal">{isTaken ? 'Booked' : 'Open'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Photographer Lunch Break Block */}
                <div className="my-4 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <strong className="block text-[11px] uppercase tracking-wider">
                        {LUNCH_BREAK.label}
                      </strong>
                      <span className="text-[11px] text-amber-800">
                        Photographer meal break and backdrop reset. Resident sessions resume promptly at 1:45 PM.
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full shrink-0">
                    Studio Paused
                  </span>
                </div>

                {/* Afternoon Block */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Afternoon & Evening Sessions (1:45 PM – 7:00 PM)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {AFTERNOON_SLOTS.map((slot) => {
                      const isTaken = bookedSlots.includes(slot);
                      const isSelected = timeSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setTimeSlot(slot)}
                          className={`p-2 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center ${
                            isTaken
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-holiday-red text-white border-holiday-red shadow-md scale-105'
                              : 'bg-white hover:border-holiday-pine text-slate-800'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className="text-[9px] font-normal">{isTaken ? 'Booked' : 'Open'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 2: Resident & Family Info */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-slate-900 font-heading mb-3">
                  2. Resident & Family Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resident Full Name *
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Family Contact Lead *
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
                      placeholder="family@email.com"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needsWheelchair}
                    onChange={(e) => setNeedsWheelchair(e.target.checked)}
                    className="rounded text-holiday-pine focus:ring-holiday-pine w-4 h-4"
                  />
                  <span>Resident uses wheelchair / motorized chair (Staff will prep zero-threshold ramp)</span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span>Selected: <strong>{timeSlot}</strong> on <strong>{selectedDate}</strong></span>
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

      {/* TAB 2: RESCHEDULER */}
      {activeTab === 'reschedule' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="max-w-xl mx-auto text-center mb-6">
            <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">
              Self-Service Reschedule Portal
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
              Change Your {facility.abbr} Photo Slot
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Enter your Pass Code (e.g. {facility.abbr}-101), Resident Name, or Cell Phone to view open 10-minute slots.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-2 max-w-md mx-auto mb-6">
            <input
              type="text"
              required
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder={`Enter ${facility.abbr}-101, Resident Name, or Phone...`}
              className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-holiday-pine"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold font-bold text-xs rounded-xl shadow transition"
            >
              Find Slot
            </button>
          </form>

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
                    Current Scheduled Slot
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

              {/* Direct Link Share Bar */}
              <div className="mb-4 p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Link2 className="w-4 h-4 text-holiday-pine shrink-0" />
                  <span className="text-slate-600 text-[11px] truncate">
                    Direct Link: <span className="font-mono text-slate-800 font-semibold">{getRescheduleUrl(matchedBooking.ref)}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyLink(matchedBooking.ref)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition shrink-0 self-end sm:self-auto"
                >
                  {copiedRef === matchedBooking.ref ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Direct Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Open Slots for Rescheduling */}
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Click an Open 10-Minute Slot to Switch (Frees Previous Slot Automatically)
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                {ALL_BOOKABLE_SLOTS.filter((s) => s !== matchedBooking.timeSlot).map((slot) => {
                  const isTaken = bookedSlots.includes(slot);
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

      {/* TAB 3: COORDINATOR & PHOTOGRAPHER LIVE RUN-SHEET */}
      {activeTab === 'coordinator' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-holiday-pine tracking-wider">
                  {facility.name} • {selectedDate}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 mt-0.5">
                Activity Coordinator & Photographer Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Replaces reception paper sheet. Floor staff can see wheelchair needs and resident room numbers.
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

          {/* Department Head Picture Reminder in Roster */}
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-bold text-amber-900">
                12:00 PM Department Head Group Picture: All facility department directors report to {facility.loungeName}.
              </span>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
              12:00 PM Locked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b">
                  <th className="p-3">Time</th>
                  <th className="p-3">Resident & Room</th>
                  <th className="p-3">Family Contact</th>
                  <th className="p-3">Mobility</th>
                  <th className="p-3 text-center">Reschedule Link</th>
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
                          <AlertCircle className="w-3 h-3" /> Wheelchair Ramp
                        </span>
                      ) : (
                        <span className="text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(b.ref)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-holiday-pine hover:text-holiday-gold text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 transition"
                        title={`Copy 1-click reschedule link for ${b.residentName}`}
                      >
                        {copiedRef === b.ref ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Link2 className="w-3 h-3 text-slate-500" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
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
