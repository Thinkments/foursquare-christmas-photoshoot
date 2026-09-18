import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Printer,
  CheckCircle,
  AlertCircle,
  Search,
  ShieldCheck,
  Phone,
  RefreshCw,
  ExternalLink,
  FileSpreadsheet,
  MessageSquare,
  Users,
  Briefcase,
  UserCheck,
  Coffee,
  Check,
  Link2,
} from 'lucide-react';
import {
  FOURSQUARE_FACILITIES,
  FACILITY_LIST,
  DEPARTMENT_HEADS,
  CALL_STATUSES,
  type DepartmentHead,
  type CallStatus,
} from '../data/facilities';

export interface BookingRecord {
  id: string;
  ref: string;
  campusId: string;
  campusName: string;
  date: string;
  timeSlot: string;
  bookingType: 'Resident' | 'Staff';
  residentName: string;
  roomNumber: string;
  bed: 'Bed A' | 'Bed B' | 'Private' | 'Staff / Station';
  guestCount: number;
  familyContactName: string; // Care Companion or Contact
  familyPhone: string;
  familyEmail: string;
  departmentHead?: string;
  callStatus?: CallStatus;
  callNotes?: string;
  mobilityNeeds: string;
  status: 'Pending' | 'Checked In' | 'Shooting' | 'Completed';
  createdAt: string;
}

// Initial realistic default bookings with 5-minute slots, Bed A/B, and Care Companions
const DEFAULT_BOOKINGS: BookingRecord[] = [
  {
    id: 'b1',
    ref: 'AML-101',
    campusId: 'aml',
    campusName: 'Ashton Medical Lodge',
    date: 'Wednesday, December 2, 2026',
    timeSlot: '10:00 AM',
    bookingType: 'Resident',
    residentName: 'Harold Jenkins',
    roomNumber: '204',
    bed: 'Bed B',
    guestCount: 2,
    familyContactName: 'Linda Jenkins (Daughter)',
    familyPhone: '(432) 555-0192',
    familyEmail: 'linda.jenkins@email.com',
    departmentHead: 'Director of Nursing (DON)',
    callStatus: 'Spoke - Confirmed',
    mobilityNeeds: 'Motorized wheelchair - needs zero-threshold ramp',
    status: 'Checked In',
    createdAt: '2026-09-07T08:30:00Z',
  },
  {
    id: 'b2',
    ref: 'AML-102',
    campusId: 'aml',
    campusName: 'Ashton Medical Lodge',
    date: 'Wednesday, December 2, 2026',
    timeSlot: '10:05 AM',
    bookingType: 'Resident',
    residentName: 'Evelyn Carter',
    roomNumber: '112',
    bed: 'Bed A',
    guestCount: 1,
    familyContactName: 'David Carter (Son)',
    familyPhone: '(432) 555-3841',
    familyEmail: 'd.carter@email.com',
    departmentHead: 'Social Services Director',
    callStatus: 'To Call',
    mobilityNeeds: 'Transfer assist bench requested',
    status: 'Pending',
    createdAt: '2026-09-07T08:45:00Z',
  },
  {
    id: 'b3',
    ref: 'AML-103',
    campusId: 'aml',
    campusName: 'Ashton Medical Lodge',
    date: 'Wednesday, December 2, 2026',
    timeSlot: '10:10 AM',
    bookingType: 'Staff',
    residentName: 'Sarah Miller, RN',
    roomNumber: 'ICU / Night Shift',
    bed: 'Staff / Station',
    guestCount: 0,
    familyContactName: 'Sarah Miller (Clinical Staff)',
    familyPhone: '(432) 555-8812',
    familyEmail: 'smiller@foursquare.com',
    departmentHead: 'Staff Development Coordinator',
    callStatus: 'Spoke - Confirmed',
    mobilityNeeds: 'Standard staff express session',
    status: 'Pending',
    createdAt: '2026-09-07T09:00:00Z',
  },
  {
    id: 'b4',
    ref: 'AML-104',
    campusId: 'aml',
    campusName: 'Ashton Medical Lodge',
    date: 'Wednesday, December 2, 2026',
    timeSlot: '10:15 AM',
    bookingType: 'Resident',
    residentName: 'Robert Vance',
    roomNumber: '305',
    bed: 'Bed A',
    guestCount: 3,
    familyContactName: 'Angela Vance (Spouse)',
    familyPhone: '(432) 555-9012',
    familyEmail: 'avance@email.com',
    departmentHead: 'Activities Director',
    callStatus: 'Left Voicemail',
    mobilityNeeds: 'Low-stimulation sensory lighting',
    status: 'Pending',
    createdAt: '2026-09-07T09:10:00Z',
  },
  {
    id: 'b5',
    ref: 'AML-105',
    campusId: 'aml',
    campusName: 'Ashton Medical Lodge',
    date: 'Wednesday, December 2, 2026',
    timeSlot: '10:20 AM',
    bookingType: 'Resident',
    residentName: 'Mary Higgins',
    roomNumber: '108',
    bed: 'Bed B',
    guestCount: 4,
    familyContactName: 'Patricia Higgins (Daughter)',
    familyPhone: '(432) 555-6671',
    familyEmail: 'phiggins@email.com',
    departmentHead: 'Dietary & Food Services Manager',
    callStatus: 'To Call',
    mobilityNeeds: 'Walker user, needs seated chair',
    status: 'Pending',
    createdAt: '2026-09-07T09:20:00Z',
  },
  {
    id: 'b6',
    ref: 'CML-201',
    campusId: 'cml',
    campusName: 'Cheyenne Medical Lodge',
    date: 'Monday, November 9, 2026',
    timeSlot: '10:00 AM',
    bookingType: 'Resident',
    residentName: 'Dorothy Miller',
    roomNumber: '104',
    bed: 'Bed A',
    guestCount: 2,
    familyContactName: 'James Miller (Son)',
    familyPhone: '(325) 555-7721',
    familyEmail: 'jmiller@email.com',
    departmentHead: 'Director of Nursing (DON)',
    callStatus: 'Spoke - Confirmed',
    mobilityNeeds: 'Wheelchair ramp assistance',
    status: 'Scheduled' as any,
    createdAt: '2026-09-08T10:00:00Z',
  },
  {
    id: 'b7',
    ref: 'HML-301',
    campusId: 'hml',
    campusName: 'Hillside Medical Lodge',
    date: 'Thursday, November 5, 2026',
    timeSlot: '10:00 AM',
    bookingType: 'Resident',
    residentName: 'Arthur Pendelton',
    roomNumber: '210',
    bed: 'Bed A',
    guestCount: 1,
    familyContactName: 'Clara Pendelton (Wife)',
    familyPhone: '(361) 555-4321',
    familyEmail: 'clara.p@email.com',
    departmentHead: 'Social Services Director',
    callStatus: 'To Call',
    mobilityNeeds: 'Oxygen tank assist',
    status: 'Scheduled' as any,
    createdAt: '2026-09-08T10:15:00Z',
  },
];

export default function CoordinatorRoster() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptHeadFilter, setDeptHeadFilter] = useState<string>('all');
  const [callStatusFilter, setCallStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params for pre-selected campus
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const fac = params.get('facility') || params.get('campus');
      if (fac && (FOURSQUARE_FACILITIES[fac.toLowerCase()] || fac === 'all')) {
        setSelectedCampus(fac.toLowerCase());
      }
    }

    // Load local bookings if existing, merged with default
    try {
      const stored = localStorage.getItem('4sq_master_bookings_v2');
      if (stored) {
        setBookings(JSON.parse(stored));
      } else {
        setBookings(DEFAULT_BOOKINGS);
        localStorage.setItem('4sq_master_bookings_v2', JSON.stringify(DEFAULT_BOOKINGS));
      }
    } catch {
      setBookings(DEFAULT_BOOKINGS);
    }
  }, []);

  const saveBookings = (updated: BookingRecord[]) => {
    setBookings(updated);
    try {
      localStorage.setItem('4sq_master_bookings_v2', JSON.stringify(updated));
    } catch {}
  };

  const updateStatus = (id: string, newStatus: BookingRecord['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    saveBookings(updated);
  };

  const updateDeptHead = (id: string, newDeptHead: string) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, departmentHead: newDeptHead } : b));
    saveBookings(updated);
  };

  const updateCallStatus = (id: string, newCallStatus: CallStatus) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, callStatus: newCallStatus } : b));
    saveBookings(updated);
  };

  const handleCopyLink = (refCode: string, campusId: string) => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/reschedule?facility=${campusId}&ref=${encodeURIComponent(refCode)}`
      : `https://foursquare-christmas-photoshoot.netlify.app/reschedule?facility=${campusId}&ref=${encodeURIComponent(refCode)}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedRef(refCode);
    setTimeout(() => setCopiedRef(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesCampus = selectedCampus === 'all' || b.campusId === selectedCampus;
    const matchesType = typeFilter === 'all' || b.bookingType === typeFilter;
    const matchesDeptHead = deptHeadFilter === 'all' || b.departmentHead === deptHeadFilter;
    const matchesCallStatus = callStatusFilter === 'all' || b.callStatus === callStatusFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.residentName.toLowerCase().includes(q) ||
      b.roomNumber.toLowerCase().includes(q) ||
      b.familyContactName.toLowerCase().includes(q) ||
      b.ref.toLowerCase().includes(q) ||
      b.familyPhone.includes(q);

    return matchesCampus && matchesType && matchesDeptHead && matchesCallStatus && matchesSearch;
  });

  const activeFacility = selectedCampus !== 'all' ? FOURSQUARE_FACILITIES[selectedCampus] : null;
  const activeSheetUrl = activeFacility?.sheetUrl || 'https://drive.google.com/drive/folders/1uRdb99V71B6CBGmQhpmyJlIqesLkEWqc';

  const callsPending = filteredBookings.filter((b) => b.callStatus === 'To Call').length;
  const callsConfirmed = filteredBookings.filter((b) => b.callStatus === 'Spoke - Confirmed').length;
  const staffSessions = filteredBookings.filter((b) => b.bookingType === 'Staff').length;

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Top Facility Switcher Banner */}
      <div className="bg-holiday-pine text-white p-5 rounded-3xl shadow-xl border border-holiday-gold/40 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold text-holiday-gold tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full border border-holiday-gold/30">
                Neely's Coordinator Console
              </span>
              <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-holiday-gold" /> All Facility Schedules Throughout the Month
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Master Facility Schedules & Status Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
              Backend administrative access to monitor facility booking statuses, care companion outreach, department assignments, and resident slots across all campuses throughout the month.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeFacility && (
              <a
                href={`/${activeFacility.code}`}
                className="px-3 py-2 bg-holiday-red hover:bg-holiday-reddark text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Open {activeFacility.abbr} Booking Page</span>
              </a>
            )}
            <a
              href={activeSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{activeFacility ? `${activeFacility.abbr} Google Sheet` : 'All Facility Sheets'}</span>
            </a>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-holiday-gold font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Roster</span>
            </button>
          </div>
        </div>

        {/* 13 Facility Quick Switcher Tabs */}
        <div>
          <span className="text-[11px] font-bold text-holiday-gold uppercase tracking-wider block mb-2">
            Switch Facility Schedule:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCampus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                selectedCampus === 'all'
                  ? 'bg-holiday-red text-white shadow'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <span>All Facilities</span>
              <span className="text-[10px] opacity-80">({bookings.length})</span>
            </button>

            {FACILITY_LIST.map((fac) => {
              const facCount = bookings.filter((b) => b.campusId === fac.code).length;
              return (
                <button
                  key={fac.code}
                  type="button"
                  onClick={() => setSelectedCampus(fac.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    selectedCampus === fac.code
                      ? 'bg-holiday-red text-white shadow border border-white/40'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  <span>{fac.abbr}</span>
                  <span className="font-mono text-[10px] text-holiday-gold opacity-90">{fac.shortDate}</span>
                  {facCount > 0 && (
                    <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded-full font-extrabold">{facCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sessions Displayed</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{filteredBookings.length}</p>
          <span className="text-[11px] text-slate-500">5-min rapid slots</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Care Companion Calls Pending</span>
          <p className="text-2xl font-extrabold text-amber-900 mt-0.5">{callsPending}</p>
          <span className="text-[11px] text-amber-700">Needs Dept Head Outreach</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Calls Spoke / Confirmed</span>
          <p className="text-2xl font-extrabold text-emerald-900 mt-0.5">{callsConfirmed}</p>
          <span className="text-[11px] text-emerald-700">Care Companion Ready</span>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Staff Express Sessions</span>
          <p className="text-2xl font-extrabold text-blue-900 mt-0.5">{staffSessions}</p>
          <span className="text-[11px] text-blue-700">Included in full schedule</span>
        </div>
      </div>

      {/* Control & Filter Dashboard */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xl mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resident, room, phone, ref..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine font-semibold"
            >
              <option value="all">All Booking Types (Residents & Staff)</option>
              <option value="Resident">Residents Only (Bed A & Bed B)</option>
              <option value="Staff">Staff Only (Express Shift Sessions)</option>
            </select>
          </div>

          {/* Department Head Filter */}
          <div>
            <select
              value={deptHeadFilter}
              onChange={(e) => setDeptHeadFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine font-medium"
            >
              <option value="all">All Department Heads Assigned</option>
              {DEPARTMENT_HEADS.map((dh) => (
                <option key={dh} value={dh}>{dh}</option>
              ))}
            </select>
          </div>

          {/* Call Status Filter */}
          <div>
            <select
              value={callStatusFilter}
              onChange={(e) => setCallStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-holiday-pine font-semibold"
            >
              <option value="all">All Care Companion Call Statuses</option>
              {CALL_STATUSES.map((cs) => (
                <option key={cs} value={cs}>{cs}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Roster & Schedule Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-holiday-pine" />
            <span className="font-bold text-xs text-slate-800">
              {activeFacility ? `${activeFacility.name} — Full 5-Minute Schedule` : 'All Facilities Master Schedule'}
            </span>
            <span className="text-[11px] text-slate-500">
              (5-min rapid increments • 10-min hourly resets)
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong>{filteredBookings.length}</strong> scheduled sessions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b">
                <th className="p-3.5">Facility / Time</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Resident / Staff & Room</th>
                <th className="p-3.5">Guests (Max 4)</th>
                <th className="p-3.5">Care Companion Contact</th>
                <th className="p-3.5">Assigned Dept Head</th>
                <th className="p-3.5">Call Status</th>
                <th className="p-3.5 text-center">Reschedule Link</th>
                <th className="p-3.5 text-right">Photo Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  {/* Facility & Time Slot */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="text-[10px] font-mono font-extrabold bg-holiday-pine/10 text-holiday-pine px-1.5 py-0.5 rounded mr-1.5 uppercase">
                      {b.campusId}
                    </span>
                    <strong className="text-xs text-slate-900">{b.timeSlot}</strong>
                    <span className="block text-[10px] text-slate-400">{b.date}</span>
                  </td>

                  {/* Type Badge */}
                  <td className="p-3.5 whitespace-nowrap">
                    {b.bookingType === 'Staff' ? (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        <Briefcase className="w-3 h-3" /> Staff
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        <Users className="w-3 h-3" /> Resident
                      </span>
                    )}
                  </td>

                  {/* Resident / Room / Bed */}
                  <td className="p-3.5">
                    <strong className="text-slate-900 text-xs block">{b.residentName}</strong>
                    {b.bookingType === 'Resident' ? (
                      <span className="text-[11px] font-bold text-holiday-pine">
                        Room {b.roomNumber} ({b.bed})
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">{b.roomNumber}</span>
                    )}
                    {b.mobilityNeeds && (
                      <span className="block text-[10px] text-amber-700 font-semibold mt-0.5">
                        ♿ {b.mobilityNeeds}
                      </span>
                    )}
                  </td>

                  {/* Guests Dropdown Count */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                      👥 {b.guestCount} {b.guestCount === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </td>

                  {/* Care Companion & Phone */}
                  <td className="p-3.5 text-xs">
                    <div className="font-semibold text-slate-900">{b.familyContactName}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <a
                        href={`tel:${b.familyPhone}`}
                        className="text-[11px] text-blue-700 hover:underline font-bold flex items-center gap-0.5"
                        title="Click to dial Care Companion"
                      >
                        <Phone className="w-3 h-3" /> {b.familyPhone}
                      </a>
                    </div>
                  </td>

                  {/* Department Head Assignment Dropdown */}
                  <td className="p-3.5">
                    <select
                      value={b.departmentHead || DEPARTMENT_HEADS[0]}
                      onChange={(e) => updateDeptHead(b.id, e.target.value)}
                      className="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 font-medium w-full max-w-[170px]"
                    >
                      {DEPARTMENT_HEADS.map((dh) => (
                        <option key={dh} value={dh}>{dh}</option>
                      ))}
                    </select>
                  </td>

                  {/* Care Companion Call Status */}
                  <td className="p-3.5">
                    <select
                      value={b.callStatus || 'To Call'}
                      onChange={(e) => updateCallStatus(b.id, e.target.value as any)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${
                        b.callStatus === 'Spoke - Confirmed'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : b.callStatus === 'Left Voicemail'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : b.callStatus === 'Needs Reschedule'
                          ? 'bg-rose-50 text-rose-900 border-rose-300'
                          : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      {CALL_STATUSES.map((cs) => (
                        <option key={cs} value={cs}>{cs}</option>
                      ))}
                    </select>
                  </td>

                  {/* 1-Click Copy Link */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(b.ref, b.campusId)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-holiday-pine hover:text-holiday-gold text-slate-700 font-bold text-[11px] rounded-lg border border-slate-200 transition"
                      title={`Copy 1-click reschedule link for ${b.residentName}`}
                    >
                      {copiedRef === b.ref ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Photo Session Status */}
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value as any)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${
                        b.status === 'Checked In'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : b.status === 'Shooting'
                          ? 'bg-purple-50 text-purple-900 border-purple-300'
                          : b.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Shooting">Shooting</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="p-10 text-center text-xs text-slate-500">
            No bookings found matching the selected campus and filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
