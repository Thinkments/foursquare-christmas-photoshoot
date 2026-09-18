import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  CheckCircle2,
  RefreshCw,
  Link2,
  Copy,
  Check,
  MessageSquare,
  MapPin,
  Users,
  AlertTriangle,
  Briefcase,
  Phone,
  Sparkles,
} from 'lucide-react';
import {
  FOURSQUARE_FACILITIES,
  FACILITY_LIST,
  MORNING_HOURLY_BLOCKS,
  AFTERNOON_HOURLY_BLOCKS,
  ALL_BOOKABLE_SLOTS,
  DEPARTMENT_HEADS,
  CALL_STATUSES,
  type DepartmentHead,
  type CallStatus,
} from '../data/facilities';
import { syncBookingToGoogle } from '../utils/googleSync';

export interface Booking {
  id: string;
  ref: string;
  facilityCode: string;
  facilityName: string;
  date: string;
  timeSlot: string;
  bookingType: 'Resident' | 'Staff';
  residentName: string;
  roomNumber: string;
  bed: 'Bed A' | 'Bed B' | 'Private' | 'Staff / Station';
  guestCount: number; // Max 4
  familyContact: string; // Care Companion or Staff Contact
  familyPhone: string;
  familyEmail: string;
  departmentHead?: string;
  callStatus?: CallStatus;
  callNotes?: string;
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

  const [activeTab, setActiveTab] = useState<'book' | 'reschedule'>('book');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Form State
  const [bookingType, setBookingType] = useState<'Resident' | 'Staff'>('Resident');
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM');
  const [residentName, setResidentName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [bed, setBed] = useState<'Bed A' | 'Bed B' | 'Private' | 'Staff / Station'>('Private');
  const [guestCount, setGuestCount] = useState<number>(0);
  const [familyContact, setFamilyContact] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [familyEmail, setFamilyEmail] = useState('');
  const [departmentHead, setDepartmentHead] = useState<string>(DEPARTMENT_HEADS[0]);
  const [needsWheelchair, setNeedsWheelchair] = useState(false);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Reschedule State
  const [lookupQuery, setLookupQuery] = useState('');
  const [matchedBooking, setMatchedBooking] = useState<Booking | null>(null);
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [rescheduleMessage, setRescheduleMessage] = useState('');

  const storageKey = `4sq_bookings_v2_${facility.code}`;

  // Helper to normalize room numbers (e.g., "Room 204B" -> "204B", "rm 102" -> "102")
  const normalizeRoom = (val: string) => val.trim().replace(/^(room|rm|unit|#)\s*/i, '').toUpperCase();

  // Helper to detect if a resident room is already booked on this date (limit 1 slot per resident)
  const checkDuplicateResident = (room: string, date: string, excludeId?: string) => {
    const cleanRoom = normalizeRoom(room);
    if (!cleanRoom) return null;
    return bookings.find(
      (b) =>
        b.date === date &&
        b.id !== excludeId &&
        b.bookingType === 'Resident' &&
        normalizeRoom(b.roomNumber) === cleanRoom
    );
  };

  // Seed bookings for realistic demo
  const getInitialBookings = (): Booking[] => [
    {
      id: `${facility.code}-1`,
      ref: `${facility.abbr}-101`,
      facilityCode: facility.code,
      facilityName: facility.name,
      date: selectedDate,
      timeSlot: '10:00 AM',
      bookingType: 'Resident',
      residentName: 'Harold Jenkins',
      roomNumber: '204',
      bed: 'Bed B',
      guestCount: 2,
      familyContact: 'Linda Jenkins (Daughter)',
      familyPhone: '(432) 555-0192',
      familyEmail: 'linda.jenkins@email.com',
      departmentHead: 'Director of Nursing (DON)',
      callStatus: 'Spoke - Confirmed',
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
      timeSlot: '10:05 AM',
      bookingType: 'Resident',
      residentName: 'Evelyn Carter',
      roomNumber: '112',
      bed: 'Bed A',
      guestCount: 1,
      familyContact: 'David Carter (Son)',
      familyPhone: '(432) 555-3841',
      familyEmail: 'david.c@email.com',
      departmentHead: 'Social Services Director',
      callStatus: 'To Call',
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
      timeSlot: '10:10 AM',
      bookingType: 'Staff',
      residentName: 'Sarah Miller, RN',
      roomNumber: 'Station 2',
      bed: 'Staff / Station',
      guestCount: 0,
      familyContact: 'Sarah Miller (Shift Nurse)',
      familyPhone: '(432) 555-8812',
      familyEmail: 'smiller@foursquare.com',
      departmentHead: 'Staff Development Coordinator',
      callStatus: 'Spoke - Confirmed',
      needsWheelchair: false,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    },
    {
      id: `${facility.code}-4`,
      ref: `${facility.abbr}-104`,
      facilityCode: facility.code,
      facilityName: facility.name,
      date: selectedDate,
      timeSlot: '10:15 AM',
      bookingType: 'Resident',
      residentName: 'Robert Vance',
      roomNumber: '305',
      bed: 'Bed A',
      guestCount: 3,
      familyContact: 'Angela Vance (Spouse)',
      familyPhone: '(432) 555-9012',
      familyEmail: 'avance@email.com',
      departmentHead: 'Activities Director',
      callStatus: 'Left Voicemail',
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
      // Also update master list for coordinator view
      localStorage.setItem(`4sq_master_bookings`, JSON.stringify(newList));
    } catch {}
  };

  // Booked slots for currently selected date
  const bookedSlots = bookings.filter((b) => b.date === selectedDate).map((b) => b.timeSlot);

  // Validate room on blur or change
  const handleRoomBlur = () => {
    if (bookingType === 'Resident' && roomNumber.trim()) {
      const existing = checkDuplicateResident(roomNumber, selectedDate);
      if (existing) {
        setRoomError(
          `Room ${normalizeRoom(roomNumber)} is already reserved at ${existing.timeSlot} for ${existing.residentName}. Only 1 timeslot is permitted per resident. To change times, please use the Reschedule portal.`
        );
      } else {
        setRoomError(null);
      }
    }
  };

  // Submit Booking
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // Check duplicate resident timeslot limit (1 per resident by Room Number)
    if (bookingType === 'Resident') {
      const duplicate = checkDuplicateResident(roomNumber, selectedDate);
      if (duplicate) {
        setRoomError(
          `Cannot double-book: Room ${normalizeRoom(roomNumber)} is already booked for ${duplicate.residentName} at ${duplicate.timeSlot}. Only 1 timeslot is permitted per resident. Please choose another room or use the Reschedule tab.`
        );
        return;
      }
    }

    setRoomError(null);
    const newRef = `${facility.abbr}-${Math.floor(100 + Math.random() * 900)}`;
    const effectiveBed = bookingType === 'Staff' ? 'Staff / Station' : bed;
    const effectiveRoom = bookingType === 'Staff' ? (roomNumber.trim() || 'Staff / Station') : normalizeRoom(roomNumber);

    const newBooking: Booking = {
      id: `${facility.code}-${Date.now()}`,
      ref: newRef,
      facilityCode: facility.code,
      facilityName: facility.name,
      date: selectedDate,
      timeSlot,
      bookingType,
      residentName: residentName.trim(),
      roomNumber: effectiveRoom,
      bed: effectiveBed,
      guestCount,
      familyContact: familyContact.trim(),
      familyPhone: familyPhone.trim(),
      familyEmail: familyEmail.trim(),
      departmentHead,
      callStatus: 'To Call',
      needsWheelchair,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...bookings];
    saveBookings(updated);
    setConfirmedBooking(newBooking);

    // Sync to Google Sheet and dispatch automated SMS text
    syncBookingToGoogle({
      facilityCode: facility.code,
      facilityName: facility.name,
      date: selectedDate,
      timeSlot,
      bookingType,
      residentName: residentName.trim(),
      roomNumber: effectiveRoom,
      bed: effectiveBed,
      guestCount,
      familyContact: familyContact.trim(),
      familyPhone: familyPhone.trim(),
      familyEmail: familyEmail.trim(),
      departmentHead,
      callStatus: 'To Call',
      needsWheelchair,
      ref: newRef,
    });

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
    setRescheduleMessage('Reservation cancelled. That 5-minute slot is now open for another family or staff member.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Christmas Photoshoot Description & Guidelines Banner */}
      <div className="bg-gradient-to-r from-holiday-pinedark via-holiday-pine to-holiday-pinedark border-2 border-holiday-gold/60 rounded-3xl p-5 sm:p-6 text-white mb-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-holiday-gold/20 border border-holiday-gold/50 flex items-center justify-center shrink-0 shadow">
            <Sparkles className="w-6 h-6 text-holiday-gold" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-holiday-gold bg-black/30 px-3 py-1 rounded-full border border-holiday-gold/30 inline-block mb-1.5">
              🎄 Christmas Photoshoot 2026
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
              Official Christmas Photoshoot Reservations
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
              This reservation portal is for the official Christmas photoshoot. Please note that <strong>only 1 timeslot is permitted per resident</strong>, and there is a <strong>maximum of 4 guests per photo group</strong>.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 bg-black/25 px-3.5 py-2 rounded-xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-holiday-gold shrink-0" />
                <span><strong>1 Timeslot Per Resident:</strong> Only 1 timeslot is permitted per resident.</span>
              </div>
              <div className="flex items-center gap-2.5 bg-black/25 px-3.5 py-2 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-holiday-gold shrink-0" />
                <span><strong>Maximum 4 Guests:</strong> Maximum of 4 guests per photo group.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Header Badge */}
      <div className="bg-holiday-pine text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-holiday-gold/40 mb-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
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

          <div className="bg-slate-900/85 border border-holiday-gold/30 p-3.5 rounded-2xl text-xs text-slate-200 shrink-0 shadow-inner">
            <p className="font-bold text-holiday-gold mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Christmas Photoshoot:
            </p>
            <p>• <strong>5-Minute Slots</strong> (10:00 AM – 7:00 PM)</p>
            <p>• <strong>Limit 1 timeslot</strong> permitted per resident</p>
            <p>• <strong>Maximum 4 guests</strong> per photo group</p>
            <p>• <strong>Staff & resident</strong> sessions included</p>
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

      {/* 2-Tab Console (Book & Reschedule) */}
      <div className="flex bg-slate-200/90 p-1.5 rounded-2xl mb-8 max-w-xl mx-auto border border-slate-300 shadow-inner">
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
          <span>Book 5-Min Slot</span>
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
                5-Minute Slot Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-2">
                You're Scheduled at {facility.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                No receptionist paper clipboard needed. Your 5-minute photo shoot is locked in real-time.
              </p>

              {/* Pass Card */}
              <div className="my-6 max-w-md mx-auto bg-holiday-pine text-white rounded-2xl p-6 text-left shadow-lg border border-holiday-gold/40">
                <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] text-holiday-gold uppercase font-bold tracking-wider">Pass Code</span>
                    <p className="text-2xl font-mono font-bold">{confirmedBooking.ref}</p>
                  </div>
                  <span className="text-xs font-bold bg-holiday-red px-3 py-1 rounded-lg text-white">
                    {confirmedBooking.bookingType === 'Staff' ? 'Staff Session' : 'Resident Session'}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                  <p>
                    <strong>Name:</strong> {confirmedBooking.residentName}{' '}
                    {confirmedBooking.bookingType === 'Resident' && (
                      <span className="text-holiday-gold font-bold">
                        (Room {confirmedBooking.roomNumber})
                      </span>
                    )}
                  </p>
                  <p><strong>Guests Bringing:</strong> {confirmedBooking.guestCount} {confirmedBooking.guestCount === 1 ? 'Guest' : 'Guests'}</p>
                  <p><strong>Facility:</strong> {facility.name}</p>
                  <p><strong>Date & Time:</strong> <span className="text-holiday-gold font-bold">{confirmedBooking.timeSlot}</span> on {confirmedBooking.date}</p>
                  <p><strong>Care Companion / Contact:</strong> {confirmedBooking.familyContact} ({confirmedBooking.familyPhone})</p>
                  {confirmedBooking.needsWheelchair && (
                    <p className="text-holiday-gold font-semibold">✓ Wheelchair ramp assistance flagged for floor staff</p>
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
                  Need to change your time later? No calls to reception needed. Click your private link to switch to any open 5-minute slot:
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
              </div>

              {/* Simulated SMS Alert Preview */}
              <div className="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-left mb-6 text-xs text-emerald-950 flex gap-3 items-start">
                <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-800">
                    Automated SMS Confirmation (Simulated to {confirmedBooking.familyPhone}):
                  </p>
                  <p className="text-emerald-900 mt-1 text-[11px] leading-relaxed italic">
                    "🎄 {facility.name}: Photo shoot confirmed for {confirmedBooking.residentName} on {confirmedBooking.date} at {confirmedBooking.timeSlot} ({confirmedBooking.guestCount} guests). Reschedule anytime: {getRescheduleUrl(confirmedBooking.ref)}"
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
                    setGuestCount(0);
                    setRoomError(null);
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                >
                  Book Another Session
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
                  Open Reschedule Tab
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmitBooking} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {/* Step 1: Pick 5-Minute Slot */}
              <div className="mb-8 pb-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                      <span>1. Pick Your 5-Minute Time Slot</span>
                      <span className="text-[11px] bg-holiday-pine/10 text-holiday-pine font-extrabold px-2.5 py-0.5 rounded-full">
                        5-Min Slots
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">{facility.name} • {selectedDate}</p>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span><strong>{ALL_BOOKABLE_SLOTS.length - bookedSlots.length}</strong> of {ALL_BOOKABLE_SLOTS.length} slots available</span>
                  </div>
                </div>

                {/* Morning Hourly Blocks */}
                <div className="space-y-4 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-holiday-pine" /> Morning Sessions (10:00 AM – 1:00 PM)
                    </span>
                    <span className="text-[11px] text-slate-500">Includes staff & residents</span>
                  </div>

                  {MORNING_HOURLY_BLOCKS.map((block) => (
                    <div key={block.hourLabel} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="font-bold text-slate-700">{block.hourLabel}</span>
                        <span className="text-[10px] text-slate-500 font-medium">10 slots • 5 mins each</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
                        {block.slots.map((slot) => {
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
                              <span className="text-[11px]">{slot}</span>
                              <span className="text-[8px] font-normal">{isTaken ? 'Booked' : 'Open'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Afternoon Hourly Blocks */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-holiday-pine" /> Afternoon & Evening Sessions (2:00 PM – 7:00 PM)
                    </span>
                    <span className="text-[11px] text-slate-500">Includes staff & residents</span>
                  </div>

                  {AFTERNOON_HOURLY_BLOCKS.map((block) => (
                    <div key={block.hourLabel} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5">
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="font-bold text-slate-700">{block.hourLabel}</span>
                        <span className="text-[10px] text-slate-500 font-medium">10 slots • 5 mins each</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
                        {block.slots.map((slot) => {
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
                              <span className="text-[11px]">{slot}</span>
                              <span className="text-[8px] font-normal">{isTaken ? 'Booked' : 'Open'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Booking Type & Resident/Staff Details */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                    2. Attendee & Booking Details
                  </h3>

                  {/* Staff Inclusion Toggle */}
                  <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingType('Resident');
                        setBed('Bed A');
                        setRoomError(null);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                        bookingType === 'Resident'
                          ? 'bg-white text-holiday-pine shadow-sm font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Resident Family Session</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingType('Staff');
                        setBed('Staff / Station');
                        setRoomError(null);
                      }}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                        bookingType === 'Staff'
                          ? 'bg-holiday-pine text-white shadow-sm font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-holiday-gold" />
                      <span>Staff Member Session (Included in Schedule)</span>
                    </button>
                  </div>
                </div>

                {/* Duplicate / Limit Alert Banner */}
                {roomError && (
                  <div className="mb-4 p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex gap-3 text-xs text-rose-900 animate-in fade-in">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-rose-800 font-bold mb-0.5">
                        Resident Time Slot Limit Exceeded:
                      </strong>
                      <p className="leading-relaxed">{roomError}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {bookingType === 'Resident' ? 'Resident Full Name *' : 'Staff Member Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={residentName}
                      onChange={(e) => setResidentName(e.target.value)}
                      placeholder={bookingType === 'Resident' ? 'e.g. Harold Jenkins' : 'e.g. Sarah Miller, RN (Night Shift)'}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                    />
                  </div>

                  {bookingType === 'Resident' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Room Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={roomNumber}
                        onChange={(e) => {
                          setRoomNumber(e.target.value);
                          setRoomError(null);
                        }}
                        onBlur={handleRoomBlur}
                        placeholder="e.g. 204"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Department / Nursing Station *
                      </label>
                      <input
                        type="text"
                        required
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="e.g. Hallway 2 Nursing Desk / ICU / Dietary"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                      />
                    </div>
                  )}
                </div>

                {/* Dropdown of Guests you are bringing (Max 4) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Guests You Are Bringing * (Max 4)
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine bg-white font-semibold"
                    >
                      <option value={0}>0 Guests ({bookingType === 'Resident' ? 'Resident Only' : 'Staff Only'})</option>
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests (Maximum Allowed)</option>
                    </select>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Rapid 5-minute sessions accommodate up to 4 visiting family guests.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {bookingType === 'Resident' ? 'Care Companion / Family Lead *' : 'Department Contact / Supervisor'}
                    </label>
                    <input
                      type="text"
                      required
                      value={familyContact}
                      onChange={(e) => setFamilyContact(e.target.value)}
                      placeholder={bookingType === 'Resident' ? 'e.g. Linda Jenkins (Daughter / Care Companion)' : 'e.g. Charge Nurse Lead'}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
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
                      placeholder="contact@email.com"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
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
                  <span>Resident requires wheelchair ramp / zero-threshold staging assist</span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  <span>
                    Selected: <strong>{timeSlot}</strong> on <strong>{selectedDate}</strong> (5-Minute Rapid Slot)
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-holiday-red hover:bg-holiday-reddark text-white font-extrabold text-sm rounded-xl shadow-lg transition transform hover:scale-[1.02]"
                >
                  Confirm 5-Minute Photo Shoot →
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
              Enter your Pass Code (e.g. {facility.abbr}-101), Resident/Staff Name, or Cell Phone to view open 5-minute slots.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-2 max-w-md mx-auto mb-6">
            <input
              type="text"
              required
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder={`Enter ${facility.abbr}-101, Name, or Phone...`}
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
                    Current Scheduled Slot ({matchedBooking.bookingType})
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {matchedBooking.residentName} {matchedBooking.bookingType === 'Resident' && `(Room ${matchedBooking.roomNumber})`}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Contact: {matchedBooking.familyContact} • {matchedBooking.familyPhone} • {matchedBooking.guestCount} Guests
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

              {/* Open 5-Min Slots for Rescheduling */}
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Click an Open 5-Minute Slot to Switch (Frees Previous Slot Automatically)
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-10 gap-1.5 mb-4 max-h-60 overflow-y-auto p-1">
                {ALL_BOOKABLE_SLOTS.filter((s) => s !== matchedBooking.timeSlot).map((slot) => {
                  const isTaken = bookedSlots.includes(slot);
                  const isSelected = rescheduleSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setRescheduleSlot(slot)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition ${
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
    </div>
  );
}
