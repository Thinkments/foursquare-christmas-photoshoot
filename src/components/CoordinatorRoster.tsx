import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Printer, CheckCircle, AlertCircle, Search, ShieldCheck, Phone, RefreshCw } from 'lucide-react';

export interface BookingRecord {
  id: string;
  ref: string;
  campusId: string;
  campusName: string;
  date: string;
  timeSlot: string;
  residentName: string;
  roomNumber: string;
  familyContactName: string;
  familyPhone: string;
  familyEmail: string;
  mobilityNeeds: string;
  status: 'Pending' | 'Checked In' | 'Shooting' | 'Completed';
  createdAt: string;
}

// Initial realistic default bookings across the day (10-minute slots)
const DEFAULT_BOOKINGS: BookingRecord[] = [
  {
    id: 'b1',
    ref: 'AML-101',
    campusId: 'ashton-medical-lodge',
    campusName: 'Ashton Medical Lodge',
    date: 'Wednesday, December 2, 2026',
    timeSlot: '10:00 AM',
    residentName: 'Harold Jenkins',
    roomNumber: 'Room 204B',
    familyContactName: 'Linda Jenkins (Daughter)',
    familyPhone: '(432) 555-0192',
    familyEmail: 'linda.jenkins@email.com',
    mobilityNeeds: 'Motorized wheelchair - needs zero-threshold ramp',
    status: 'Checked In',
    createdAt: '2026-09-07T08:30:00Z',
  },
  {
    id: 'b2',
    ref: 'AML-102',
    campusId: 'ashton-medical-lodge',
    campusName: 'Ashton Medical Lodge',
    date: 'Wednesday, December 2, 2026',
    timeSlot: '10:10 AM',
    residentName: 'Evelyn Carter',
    roomNumber: 'Room 112A',
    familyContactName: 'David Carter (Son)',
    familyPhone: '(432) 555-3841',
    familyEmail: 'd.carter@email.com',
    mobilityNeeds: 'Transfer assist bench requested',
    status: 'Shooting',
    createdAt: '2026-09-07T08:45:00Z',
  },
  {
    id: 'b3',
    ref: 'AML-103',
    campusId: 'ashton-medical-lodge',
    campusName: 'Ashton Medical Lodge',
    date: 'Wednesday, December 2, 2026',
    timeSlot: '10:20 AM',
    residentName: 'Robert Vance',
    roomNumber: 'Room 305C',
    familyContactName: 'Angela Vance (Spouse)',
    familyPhone: '(432) 555-9012',
    familyEmail: 'avance@email.com',
    mobilityNeeds: 'Low-stimulation sensory lighting',
    status: 'Pending',
    createdAt: '2026-09-07T09:10:00Z',
  },
  {
    id: 'b4',
    ref: 'AML-104',
    campusId: 'ashton-medical-lodge',
    campusName: 'Ashton Medical Lodge',
    date: 'Wednesday, December 2, 2026',
    timeSlot: '10:30 AM',
    residentName: 'Mary Higgins',
    roomNumber: 'Room 108B',
    familyContactName: 'Patricia Higgins (Daughter)',
    familyPhone: '(432) 555-6671',
    familyEmail: 'phiggins@email.com',
    mobilityNeeds: 'Walker user, needs seated posing chair',
    status: 'Pending',
    createdAt: '2026-09-07T09:20:00Z',
  },
];

export default function CoordinatorRoster() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Load local bookings if existing, merged with default
    try {
      const stored = localStorage.getItem('4sq_master_bookings');
      if (stored) {
        setBookings(JSON.parse(stored));
      } else {
        setBookings(DEFAULT_BOOKINGS);
        localStorage.setItem('4sq_master_bookings', JSON.stringify(DEFAULT_BOOKINGS));
      }
    } catch {
      setBookings(DEFAULT_BOOKINGS);
    }
  }, []);

  const updateStatus = (id: string, newStatus: BookingRecord['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    setBookings(updated);
    try {
      localStorage.setItem('4sq_master_bookings', JSON.stringify(updated));
    } catch {}
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesCampus = selectedCampus === 'all' || b.campusId === selectedCampus;
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.residentName.toLowerCase().includes(q) ||
      b.roomNumber.toLowerCase().includes(q) ||
      b.familyContactName.toLowerCase().includes(q) ||
      b.ref.toLowerCase().includes(q);
    return matchesCampus && matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto stable-widget-container">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-holiday-red tracking-wider">
                Shoot Day Operational Roster
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Live Sync Active
              </span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-slate-900 mt-1">
              Activity Coordinator & Photographer Dashboard
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Replaces the paper sign-up sheet at the reception desk. Check residents in, alert transport staff, and keep 10-minute photo sets on schedule.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
            >
              <Printer className="w-4 h-4 text-holiday-gold" />
              <span>Print Day-of Run Sheet</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Campus Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Facility Campus
            </label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
            >
              <option value="all">All DFW Campuses</option>
              <option value="fort-worth-senior-living">Fort Worth Senior Living & Rehab</option>
              <option value="dallas-regional">Dallas Regional Medical Center & Rehab</option>
              <option value="plano-specialty">Plano Specialty Hospital Campus</option>
              <option value="arlington-pavilion">Arlington Emergency Pavilion</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Session Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl bg-slate-50"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending Arrival</option>
              <option value="Checked In">Checked In (In Waiting Area)</option>
              <option value="Shooting">Currently in Studio</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Search Resident / Room / Ref
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resident name or room..."
                className="w-full text-xs px-3 py-2 pl-8 border border-slate-300 rounded-xl bg-slate-50"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-sm text-holiday-gold">
              Today's 10-Minute Scheduled Run-Sheet
            </span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
              {filteredBookings.length} Slots Scheduled
            </span>
          </div>
          <span className="text-xs text-slate-400">Photographer: Marcus Holiday Studio</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="p-3.5">Time Slot</th>
                <th className="p-3.5">Resident & Room</th>
                <th className="p-3.5">Family Contact Lead</th>
                <th className="p-3.5">Mobility & Accessibility</th>
                <th className="p-3.5">Pass Ref</th>
                <th className="p-3.5 text-right">Shoot Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No scheduled sessions match the current filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className={`hover:bg-slate-50 transition ${
                      b.status === 'Shooting' ? 'bg-holiday-pine/5 font-semibold' : ''
                    }`}
                  >
                    {/* Time Slot */}
                    <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-holiday-pine">
                        <Clock className="w-4 h-4 text-holiday-gold" />
                        <span>{b.timeSlot}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{b.date}</span>
                    </td>

                    {/* Resident & Room */}
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 text-sm block">{b.residentName}</span>
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 mt-0.5">
                        {b.roomNumber}
                      </span>
                    </td>

                    {/* Family Contact */}
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block">{b.familyContactName}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" /> {b.familyPhone}
                      </span>
                    </td>

                    {/* Mobility */}
                    <td className="p-3.5">
                      <div className="flex items-start gap-1 text-[11px] text-slate-600 max-w-xs">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{b.mobilityNeeds}</span>
                      </div>
                    </td>

                    {/* Ref */}
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {b.ref}
                    </td>

                    {/* Status Toggle Buttons */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value as any)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border ${
                          b.status === 'Checked In'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : b.status === 'Shooting'
                            ? 'bg-purple-100 text-purple-900 border-purple-300'
                            : b.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Checked In">Checked In</option>
                        <option value="Shooting">Shooting Now</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer instructions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Activity Coordinator Note:</strong> Please verify resident wheelchair transport 10 minutes prior to scheduled slot.
          </span>
          <span className="text-holiday-pine font-semibold">Foursquare Healthcare Life Enrichment Roster</span>
        </div>
      </div>
    </div>
  );
}
