export interface FacilityConfig {
  code: string;
  abbr: string;
  name: string;
  city: string;
  shootDate: string;
  shortDate: string;
  dayOfWeek: string;
  dates?: { label: string; dateStr: string; shortDate: string }[];
  loungeName: string;
  sheetUrl?: string;
}

export const FOURSQUARE_FACILITIES: Record<string, FacilityConfig> = {
  hml: {
    code: 'hml',
    abbr: 'HML',
    name: 'Hillside Medical Lodge',
    city: 'Beeville, TX',
    shootDate: 'Thursday, November 5, 2026',
    shortDate: '11/5',
    dayOfWeek: 'Thursday',
    loungeName: 'Hillside Fireside Solarium',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1ICSuhXYnnBH5gAaikJyXOuQlAIGa70q3gowZiKxw3j4/edit',
  },
  wnr: {
    code: 'wnr',
    abbr: 'WNR',
    name: 'Whitney Nursing & Rehabilitation',
    city: 'Whitney, TX',
    shootDate: 'Friday, November 6, 2026',
    shortDate: '11/6',
    dayOfWeek: 'Friday',
    loungeName: 'Whitney Heritage Community Room',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1tCTVeltddtPnSVFRdvcaaPZneGJIKn9MASTm4cTwBbQ/edit',
  },
  cml: {
    code: 'cml',
    abbr: 'CML',
    name: 'Cheyenne Medical Lodge',
    city: 'Colorado City, TX',
    shootDate: 'Monday, November 9 & Tuesday, November 10, 2026',
    shortDate: '11/9 & 11/10',
    dayOfWeek: 'Monday & Tuesday (2-Day Session)',
    dates: [
      { label: 'Day 1 (Nov 9)', dateStr: 'Monday, November 9, 2026', shortDate: '11/9' },
      { label: 'Day 2 (Nov 10)', dateStr: 'Tuesday, November 10, 2026', shortDate: '11/10' },
    ],
    loungeName: 'Cheyenne Grand Prairie Staging Room',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1eCYxLcAEY5ItRn_4LpgH0gGgadCUKz_Cm7xqK8j4Bos/edit',
  },
  pml: {
    code: 'pml',
    abbr: 'PML',
    name: 'Princeton Medical Lodge',
    city: 'Princeton, TX',
    shootDate: 'Thursday, November 12, 2026',
    shortDate: '11/12',
    dayOfWeek: 'Thursday',
    loungeName: 'Princeton Courtyard Pavilion',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1W638inRfm4VszJhtomYWPG0ufpperUfnu4ms3uT0NxU/edit',
  },
  fhr: {
    code: 'fhr',
    abbr: 'FHR',
    name: 'Farmersville Health & Rehabilitation',
    city: 'Farmersville, TX',
    shootDate: 'Friday, November 13, 2026',
    shortDate: '11/13',
    dayOfWeek: 'Friday',
    loungeName: 'Farmersville Evergreen Great Room',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1AJMGyZzrGDHxB3N5gBMI435tWdU1aPudeFC29O0Yx-c/edit',
  },
  lml: {
    code: 'lml',
    abbr: 'LML',
    name: 'Lexington Medical Lodge',
    city: 'Farmersville, TX',
    shootDate: 'Tuesday, November 17, 2026',
    shortDate: '11/17',
    dayOfWeek: 'Tuesday',
    loungeName: 'Lexington Magnolia Activity Atrium',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1jms0PsKi1Iy0lcEvipd57JcKA9YdRDQSQdousDQhN7c/edit',
  },
  tray: {
    code: 'tray',
    abbr: 'TRAY',
    name: 'Traymore at Park Cities',
    city: 'Dallas, TX',
    shootDate: 'Tuesday, November 24, 2026',
    shortDate: '11/24',
    dayOfWeek: 'Tuesday',
    loungeName: 'Traymore Highland Park Holiday Studio',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1HhrpSrtuE_Z_tnQYpGkZMgxR_ytmgGe_tdlnPejweIo/edit',
  },
  mml: {
    code: 'mml',
    abbr: 'MML',
    name: 'Midland Medical Lodge',
    city: 'Midland, TX',
    shootDate: 'Monday, November 30, 2026',
    shortDate: '11/30',
    dayOfWeek: 'Monday',
    loungeName: 'Midland Rose Garden Recreation Room',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1ytJ_HVCUZCjFHdXpU5lTqaWfmoq5ta6N7SbypFKixcE/edit',
  },
  mmr: {
    code: 'mmr',
    abbr: 'MMR',
    name: 'Madison Medical Resort',
    city: 'Odessa, TX',
    shootDate: 'Tuesday, December 1, 2026',
    shortDate: '12/1',
    dayOfWeek: 'Tuesday',
    loungeName: 'Madison Grand Ballroom Staging Suite',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1fhMmZV27mXXfX5jAF5YAERQGjCqFan07GvgNseznAbw/edit',
  },
  aml: {
    code: 'aml',
    abbr: 'AML',
    name: 'Ashton Medical Lodge',
    city: 'Midland, TX',
    shootDate: 'Wednesday, December 2, 2026',
    shortDate: '12/2',
    dayOfWeek: 'Wednesday',
    loungeName: 'Ashton Main Fireside Staging Lounge',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1n9LasYjsQUJGszzPVBlY9KjMqEocG2SoH2tyHbucBkg/edit',
  },
  sml: {
    code: 'sml',
    abbr: 'SML',
    name: 'Sheridan Medical Lodge',
    city: 'Burleson, TX',
    shootDate: 'Tuesday, December 8, 2026',
    shortDate: '12/8',
    dayOfWeek: 'Tuesday',
    loungeName: 'Sheridan Chisholm Trail Gathering Room',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/13e41eSswwEOar9k9DvWTVTNgvMR7jqTKr3zOZbq0OEk/edit',
  },
  scwf: {
    code: 'scwf',
    abbr: 'SCWF',
    name: 'Senior Care Wichita Falls',
    city: 'Wichita Falls, TX',
    shootDate: 'Wednesday, December 9, 2026',
    shortDate: '12/9',
    dayOfWeek: 'Wednesday',
    loungeName: 'Wichita Falls Red River Sunroom',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1YwIN107MjS5t4RD1PmhAMB0sivr6wmPWOoaVIveV7CA/edit',
  },
};

export const FACILITY_LIST = Object.values(FOURSQUARE_FACILITIES);

// 5-Minute slot schedule rules:
// Slots run for 50 minutes of each hour in 5-minute increments (:00 through :45).
// The last 10 minutes (:50 to :00) are cut out at the end of every hour for staff transition and camera reset.

export const MORNING_HOURLY_BLOCKS = [
  {
    hourLabel: '10:00 AM – 10:50 AM',
    slots: [
      '10:00 AM', '10:05 AM', '10:10 AM', '10:15 AM', '10:20 AM',
      '10:25 AM', '10:30 AM', '10:35 AM', '10:40 AM', '10:45 AM',
    ],
    bufferLabel: '10:50 AM – 11:00 AM (10-Min Studio Reset)',
  },
  {
    hourLabel: '11:00 AM – 11:50 AM',
    slots: [
      '11:00 AM', '11:05 AM', '11:10 AM', '11:15 AM', '11:20 AM',
      '11:25 AM', '11:30 AM', '11:35 AM', '11:40 AM', '11:45 AM',
    ],
    bufferLabel: '11:50 AM – 12:00 PM (10-Min Studio Reset)',
  },
  {
    hourLabel: '12:00 PM – 12:50 PM',
    slots: [
      '12:00 PM', '12:05 PM', '12:10 PM', '12:15 PM', '12:20 PM',
      '12:25 PM', '12:30 PM', '12:35 PM', '12:40 PM', '12:45 PM',
    ],
    bufferLabel: '12:50 PM – 1:00 PM (10-Min Transition to Lunch)',
  },
];

export const MORNING_SLOTS = MORNING_HOURLY_BLOCKS.flatMap((b) => b.slots);

// Photographer Lunch Break: 1:00 PM - 2:00 PM
export const LUNCH_BREAK = {
  start: '01:00 PM',
  end: '02:00 PM',
  label: 'Photographer Lunch Break & Studio Reset (1:00 PM – 2:00 PM)',
};

export const AFTERNOON_HOURLY_BLOCKS = [
  {
    hourLabel: '02:00 PM – 02:50 PM',
    slots: [
      '02:00 PM', '02:05 PM', '02:10 PM', '02:15 PM', '02:20 PM',
      '02:25 PM', '02:30 PM', '02:35 PM', '02:40 PM', '02:45 PM',
    ],
    bufferLabel: '02:50 PM – 03:00 PM (10-Min Studio Reset)',
  },
  {
    hourLabel: '03:00 PM – 03:50 PM',
    slots: [
      '03:00 PM', '03:05 PM', '03:10 PM', '03:15 PM', '03:20 PM',
      '03:25 PM', '03:30 PM', '03:35 PM', '03:40 PM', '03:45 PM',
    ],
    bufferLabel: '03:50 PM – 04:00 PM (10-Min Studio Reset)',
  },
  {
    hourLabel: '04:00 PM – 04:50 PM',
    slots: [
      '04:00 PM', '04:05 PM', '04:10 PM', '04:15 PM', '04:20 PM',
      '04:25 PM', '04:30 PM', '04:35 PM', '04:40 PM', '04:45 PM',
    ],
    bufferLabel: '04:50 PM – 05:00 PM (10-Min Studio Reset)',
  },
  {
    hourLabel: '05:00 PM – 05:50 PM',
    slots: [
      '05:00 PM', '05:05 PM', '05:10 PM', '05:15 PM', '05:20 PM',
      '05:25 PM', '05:30 PM', '05:35 PM', '05:40 PM', '05:45 PM',
    ],
    bufferLabel: '05:50 PM – 06:00 PM (10-Min Studio Reset)',
  },
  {
    hourLabel: '06:00 PM – 06:50 PM',
    slots: [
      '06:00 PM', '06:05 PM', '06:10 PM', '06:15 PM', '06:20 PM',
      '06:25 PM', '06:30 PM', '06:35 PM', '06:40 PM', '06:45 PM',
    ],
    bufferLabel: '06:50 PM – 07:00 PM (Day Wrap-Up & Pack-Down)',
  },
];

export const AFTERNOON_SLOTS = AFTERNOON_HOURLY_BLOCKS.flatMap((b) => b.slots);

// Staff and residents share the full schedule; all slots are available
export const ALL_BOOKABLE_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS];

// Department Heads responsible for calling care companions
export const DEPARTMENT_HEADS = [
  'Director of Nursing (DON)',
  'Assistant Director of Nursing (ADON)',
  'Social Services Director',
  'Activities Director',
  'Dietary & Food Services Manager',
  'Business Office Manager (BOM)',
  'Rehab & Therapy Director',
  'MDS Coordinator',
  'Facility Administrator',
  'Staff Development Coordinator',
] as const;

export type DepartmentHead = typeof DEPARTMENT_HEADS[number];

// Call Status options for care companion outreach
export const CALL_STATUSES = [
  'To Call',
  'Left Voicemail',
  'Spoke - Confirmed',
  'Needs Reschedule',
  'Declined Session',
] as const;

export type CallStatus = typeof CALL_STATUSES[number];
