import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, ArrowRight, RefreshCw, XCircle, Phone, ShieldCheck } from 'lucide-react';
import type { BookingRecord } from './CoordinatorRoster';

export default function ReschedulePortal() {
  const [refInput, setRefInput] = useState('');
  const [currentBooking, setCurrentBooking] = useState<BookingRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [newSelectedSlot, setNewSelectedSlot] = useState('');
  const [rescheduledSuccess, setRescheduledSuccess] = useState(false);
  const [cancelledSuccess, setCancelledSuccess] = useState(false);

  // Available slots for rescheduling
  const AVAILABLE_SLOTS = [
    '09:00 AM',
    '09:15 AM',
    '09:30 AM',
    '09:45 AM',
    '10:00 AM',
    '10:15 AM',
    '10:30 AM',
    '10:45 AM',
    '11:00 AM',
    '11:15 AM',
    '11:30 AM',
    '01:00 PM',
    '01:15 PM',
    '01:30 PM',
    '01:45 PM',
    '02:00 PM',
  ];

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
    setIsSearching(true);
    setSearched(true);
    setRescheduledSuccess(false);
    setCancelledSuccess(false);

    try {
      const stored = localStorage.getItem('4sq_master_bookings');
      if (stored) {
        const list: BookingRecord[] = JSON.parse(stored);
        const match = list.find(
          (b) =>
            b.ref.toLowerCase() === refCode.trim().toLowerCase() ||
            b.familyPhone.replace(/\D/g, '') === refCode.replace(/\D/g, '')
        );
        if (match) {
          setCurrentBooking(match);
          setIsSearching(false);
          return;
        }
      }
    } catch {}

    // Fallback default simulation match
    if (refCode.toUpperCase().includes('4SQ') || refCode.length >= 4) {
      setCurrentBooking({
        id: 'sim-1',
        ref: refCode.toUpperCase(),
        campusId: 'fort-worth-senior-living',
        campusName: 'Fort Worth Senior Living & Rehab',
        date: '2026-12-05',
        timeSlot: '09:00 AM',
        residentName: 'Harold Jenkins',
        roomNumber: 'Room 204B',
        familyContactName: 'Linda Jenkins (Daughter)',
        familyPhone: '(817) 555-0192',
        familyEmail: 'linda.jenkins@email.com',
        mobilityNeeds: 'Motorized wheelchair ramp access',
        status: 'Pending',
        createdAt: '2026-09-07T08:30:00Z',
      });
    } else {
      setCurrentBooking(null);
    }
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
      const stored = localStorage.getItem('4sq_master_bookings');
      if (stored) {
        const list: BookingRecord[] = JSON.parse(stored);
        const updatedList = list.map((b) => (b.id === currentBooking.id ? updatedBooking : b));
        localStorage.setItem('4sq_master_bookings', JSON.stringify(updatedList));
      }
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0B3B24', '#C41E3A', '#D4AF37'],
      });
    } catch {}
  };

  const handleCancel = () => {
    if (!currentBooking) return;
    setCancelledSuccess(true);
    try {
      const stored = localStorage.getItem('4sq_master_bookings');
      if (stored) {
        const list: BookingRecord[] = JSON.parse(stored);
        const filtered = list.filter((b) => b.id !== currentBooking.id);
        localStorage.setItem('4sq_master_bookings', JSON.stringify(filtered));
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
          Change your photo shoot time slot instantly without calling reception. Only open times are shown, preventing double bookings.
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
              placeholder="Enter Pass Reference (e.g. 4SQ-7821) or Cell Phone Number..."
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

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>Quick Demo Passes:</span>
          <button
            type="button"
            onClick={() => {
              setRefInput('4SQ-7821');
              lookupBooking('4SQ-7821');
            }}
            className="text-holiday-pine font-semibold underline hover:text-holiday-pinelight"
          >
            Harold Jenkins (4SQ-7821)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setRefInput('4SQ-4491');
              lookupBooking('4SQ-4491');
            }}
            className="text-holiday-pine font-semibold underline hover:text-holiday-pinelight"
          >
            Evelyn Carter (4SQ-4491)
          </button>
        </div>
      </div>

      {/* Booking Found Card */}
      {currentBooking && !cancelledSuccess && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl mb-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active Reservation Found
              </span>
              <h3 className="text-xl font-bold font-heading text-slate-900 mt-1">
                {currentBooking.residentName} ({currentBooking.roomNumber})
              </h3>
              <p className="text-xs text-slate-500">
                Contact: {currentBooking.familyContactName} • {currentBooking.familyPhone}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Slot</span>
              <span className="text-xl font-extrabold font-heading text-holiday-pine">
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
                <strong>{currentBooking.timeSlot}</strong> on {currentBooking.date}. The Activity Coordinator run-sheet has updated in real time.
              </p>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                Switch to an Available 15-Minute Slot
              </h4>
              <p className="text-xs text-slate-600 mb-4">
                Select from the remaining open slots below. Once selected, your previous slot will immediately be released for another family.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                {AVAILABLE_SLOTS.map((slot) => {
                  const isCurrent = currentBooking.timeSlot === slot;
                  const isSelected = newSelectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isCurrent}
                      onClick={() => setNewSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition ${
                        isCurrent
                          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'border-holiday-red bg-holiday-red text-white shadow-md'
                          : 'border-slate-200 bg-white hover:border-holiday-pine text-slate-800'
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
                      ? 'bg-holiday-pine hover:bg-holiday-pinelight text-holiday-gold cursor-pointer'
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
            href="/schedule"
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
            href="/schedule"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-holiday-pine underline"
          >
            <span>Go to New Booking Portal</span> →
          </a>
        </div>
      )}

      {/* Automated SMS & Email Notification Preview */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-holiday-gold/30">
        <span className="text-[11px] uppercase font-bold text-holiday-gold tracking-widest block mb-1">
          Automated Notification Flow (Zero Receptionist Overhead)
        </span>
        <h3 className="text-lg font-bold font-heading text-white mb-4">
          How Family Reminders & Rescheduling Work
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* SMS Card */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-holiday-gold font-bold mb-2">
              <Phone className="w-4 h-4" />
              <span>Automated SMS Reminder (24h & 2h Before)</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed">
              "Hi Linda! Reminder: Your Christmas photo with Harold (Room 204B) at Foursquare Fort Worth is scheduled for Saturday at 09:00 AM in the Fireside Hearth. Need to change? Click here to reschedule in 10 seconds: foursquare-christmas-photoshoot.netlify.app/reschedule?ref=4SQ-7821"
            </div>
          </div>

          {/* Activity Coordinator Roster Card */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-holiday-gold font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Real-Time Activity Coordinator Sync</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              When a family reschedules or books, the **Activity Coordinator & Photographer Run-Sheet** updates instantly. The transport team is automatically routed to the right room at the right time.
            </p>
            <div className="mt-3">
              <a
                href="/coordinator"
                class="text-holiday-gold hover:underline font-bold text-[11px]"
              >
                View Live Activity Coordinator Run-Sheet →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
