import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  XCircle,
  Phone,
  ShieldCheck,
  Link2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import type { BookingRecord } from './CoordinatorRoster';
import { ALL_BOOKABLE_SLOTS, FACILITY_LIST, FOURSQUARE_FACILITIES } from '../data/facilities';

export default function ReschedulePortal() {
  const [refInput, setRefInput] = useState('');
  const [currentBooking, setCurrentBooking] = useState<BookingRecord | null>(null);
  const [matchedFacilityCode, setMatchedFacilityCode] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [newSelectedSlot, setNewSelectedSlot] = useState('');
  const [rescheduledSuccess, setRescheduledSuccess] = useState(false);
  const [cancelledSuccess, setCancelledSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper to generate the exact 1-click reschedule link
  const getRescheduleUrl = (refCode: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/reschedule?ref=${encodeURIComponent(refCode)}`;
    }
    return `https://christmasphotos.netlify.app/reschedule?ref=${encodeURIComponent(refCode)}`;
  };

  const handleCopyLink = (refCode: string) => {
    const url = getRescheduleUrl(refCode);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Available 5-minute slots for rescheduling
  const AVAILABLE_SLOTS = ALL_BOOKABLE_SLOTS;

  // Auto-fill from URL query param if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      if (ref) {
        setRefInput(ref);
        lookupBooking(ref);
      }
    }
  }, []);

  const lookupBooking = (refCode: string) => {
    if (!refCode || !refCode.trim()) return;
    setIsSearching(true);
    setSearched(true);
    setRescheduledSuccess(false);
    setCancelledSuccess(false);

    const cleanInput = refCode.trim().toLowerCase();
    const cleanDigits = refCode.replace(/\D/g, '');

    // 1. Check all facility production stores
    for (const fac of FACILITY_LIST) {
      try {
        const stored = localStorage.getItem(`4sq_bookings_prod_v3_${fac.code}`);
        if (stored) {
          const list = JSON.parse(stored);
          const match = list.find(
            (b: any) =>
              (b.ref && b.ref.toLowerCase() === cleanInput) ||
              (b.residentName && b.residentName.toLowerCase().includes(cleanInput)) ||
              (cleanDigits.length >= 7 && b.familyPhone && b.familyPhone.replace(/\D/g, '').includes(cleanDigits))
          );
          if (match) {
            setMatchedFacilityCode(fac.code);
            setCurrentBooking({
              id: match.id,
              ref: match.ref,
              campusId: fac.code,
              campusName: fac.name,
              date: match.date || fac.shootDate,
              timeSlot: match.timeSlot,
              residentName: match.residentName,
              roomNumber: match.roomNumber,
              familyContactName: match.familyContact || match.familyContactName,
              familyPhone: match.familyPhone,
              familyEmail: match.familyEmail,
              mobilityNeeds: match.mobilityNeeds || (match.needsWheelchair ? 'Wheelchair ramp access requested' : 'Standard mobility'),
              status: match.status === 'Checked In' ? 'Checked In' : 'Pending',
              createdAt: match.createdAt || new Date().toISOString(),
            });
            setIsSearching(false);
            return;
          }
        }
      } catch {}
    }

    // 2. Check master bookings
    try {
      const master = localStorage.getItem('4sq_master_bookings_prod');
      if (master) {
        const list: BookingRecord[] = JSON.parse(master);
        const match = list.find(
          (b) =>
            (b.ref && b.ref.toLowerCase() === cleanInput) ||
            (cleanDigits.length >= 7 && b.familyPhone && b.familyPhone.replace(/\D/g, '').includes(cleanDigits))
        );
        if (match) {
          setMatchedFacilityCode(match.campusId || '');
          setCurrentBooking(match);
          setIsSearching(false);
          return;
        }
      }
    } catch {}

    setCurrentBooking(null);
    setIsSearching(false);
  };

  const handleReschedule = () => {
    if (!newSelectedSlot || !currentBooking) return;

    const updatedBooking: BookingRecord = {
      ...currentBooking,
      timeSlot: newSelectedSlot,
    };

    setCurrentBooking(updatedBooking);
    setRescheduledSuccess(true);

    try {
      // Sync facility storage
      if (matchedFacilityCode) {
        const facStorageKey = `4sq_bookings_prod_v3_${matchedFacilityCode}`;
        const stored = localStorage.getItem(facStorageKey);
        if (stored) {
          const list = JSON.parse(stored);
          const updatedList = list.map((b: any) =>
            b.ref.toLowerCase() === currentBooking.ref.toLowerCase()
              ? { ...b, timeSlot: newSelectedSlot }
              : b
          );
          localStorage.setItem(facStorageKey, JSON.stringify(updatedList));
        }
      }

      // Sync master storage
      const storedMaster = localStorage.getItem('4sq_master_bookings_prod');
      if (storedMaster) {
        const list: BookingRecord[] = JSON.parse(storedMaster);
        const updatedList = list.map((b) => (b.ref === currentBooking.ref ? updatedBooking : b));
        localStorage.setItem('4sq_master_bookings_prod', JSON.stringify(updatedList));
      }

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#5A0612', '#9E0E21', '#D4AF37', '#FAF1DC'],
      });
    } catch {}
  };

  const handleCancel = () => {
    if (!currentBooking) return;
    setCancelledSuccess(true);
    try {
      if (matchedFacilityCode) {
        const facStorageKey = `4sq_bookings_prod_v3_${matchedFacilityCode}`;
        const stored = localStorage.getItem(facStorageKey);
        if (stored) {
          const list = JSON.parse(stored);
          const filtered = list.filter((b: any) => b.ref.toLowerCase() !== currentBooking.ref.toLowerCase());
          localStorage.setItem(facStorageKey, JSON.stringify(filtered));
        }
      }
      const storedMaster = localStorage.getItem('4sq_master_bookings_prod');
      if (storedMaster) {
        const list: BookingRecord[] = JSON.parse(storedMaster);
        const filtered = list.filter((b) => b.ref !== currentBooking.ref);
        localStorage.setItem('4sq_master_bookings_prod', JSON.stringify(filtered));
      }
    } catch {}
  };

  return (
    <div className="w-full max-w-4xl mx-auto stable-widget-container">
      {/* Search / Lookup Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">
          Self-Service Resident Family Portal
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">
          Manage or Reschedule Your Holiday Appointment
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Change your photo shoot time slot instantly without calling reception. Only open times are available, preventing double bookings.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookupBooking(refInput);
          }}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1">
            <input
              type="text"
              required
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="Enter Pass Reference (e.g. 4SQ-7821) or Mobile Phone Number..."
              className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold font-bold text-sm rounded-xl shadow-md transition shrink-0"
          >
            Find My Reservation
          </button>
        </form>
      </div>

      {/* Booking Found Card */}
      {currentBooking && !cancelledSuccess && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active Reservation Found • {currentBooking.ref}
              </span>
              <h3 className="text-xl font-bold font-heading text-slate-900 mt-1">
                {currentBooking.residentName} ({currentBooking.roomNumber})
              </h3>
              <p className="text-xs text-slate-500">
                Facility: <strong>{currentBooking.campusName}</strong> • Contact: {currentBooking.familyContactName} ({currentBooking.familyPhone})
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Slot</span>
              <span className="text-xl font-extrabold font-heading text-holiday-crimson">
                {currentBooking.timeSlot}
              </span>
              <span className="text-xs text-slate-500 block">{currentBooking.date}</span>
            </div>
          </div>

          {rescheduledSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-lg font-bold text-emerald-900">
                Time Slot Successfully Rescheduled!
              </h4>
              <p className="text-xs text-emerald-700 mt-1">
                Your appointment is now confirmed for{' '}
                <strong>{currentBooking.timeSlot}</strong> on {currentBooking.date}. The facility activity coordinator and photographer roster have updated in real time.
              </p>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                Switch to an Open 5-Minute Slot
              </h4>
              <p className="text-xs text-slate-600 mb-4">
                Select from the available slots below. Once selected, your previous slot will immediately be released for another family.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {AVAILABLE_SLOTS.map((slot) => {
                  const isCurrent = currentBooking.timeSlot === slot;
                  const isSelected = newSelectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isCurrent}
                      onClick={() => setNewSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                        isCurrent
                          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'border-holiday-gold bg-gradient-to-r from-holiday-wine to-holiday-crimson text-white shadow-md scale-105'
                          : 'border-slate-200 bg-white hover:border-holiday-crimson text-slate-800'
                      }`}
                    >
                      <span>{slot}</span>
                      {isCurrent && <span className="block text-[10px] text-slate-400">(Current)</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Reservation</span>
                </button>

                <button
                  type="button"
                  disabled={!newSelectedSlot}
                  onClick={handleReschedule}
                  className={`inline-flex items-center gap-2 px-6 py-3 font-bold text-xs rounded-xl shadow-md transition ${
                    newSelectedSlot
                      ? 'bg-gradient-to-r from-holiday-wine to-holiday-crimson hover:brightness-110 text-holiday-goldlight border border-holiday-gold/40 cursor-pointer shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Confirm New Slot ({newSelectedSlot || 'Select One'})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cancelled state */}
      {cancelledSuccess && (
        <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center shadow-lg mb-8">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold font-heading text-slate-900">
            Reservation Cancelled
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Your slot has been released back into the open pool for other resident families. If your schedule opens up again, you may book a new slot at any time.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-holiday-pine text-holiday-gold font-bold text-xs rounded-xl"
          >
            <span>Book a New Session</span> →
          </a>
        </div>
      )}

      {/* Not found state */}
      {searched && !currentBooking && !isSearching && (
        <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center shadow-sm mb-8">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-slate-900">No Matching Reservation Found</h3>
          <p className="text-xs text-slate-600 mt-1">
            Please verify your Pass Reference code or phone number. If you haven't reserved yet, you can schedule online now.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-holiday-pine underline"
          >
            <span>Go to Facility Directory</span> →
          </a>
        </div>
      )}
    </div>
  );
}
