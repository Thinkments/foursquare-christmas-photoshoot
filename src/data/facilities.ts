export interface FacilityConfig {
  code: string;
  abbr: string;
  name: string;
  address: string;
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
    address: '300 S Highway 36 Byp N, Gatesville, TX 76528',
    city: 'Gatesville, TX',
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
    address: '101 S San Marcos St, Whitney, TX 76692',
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
    address: '750 Hwy 352, Mesquite, TX 75149',
    city: 'Mesquite, TX',
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
    address: '1401 W Princeton Dr, Princeton, TX 75407',
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
    address: '205 Beech St, Farmersville, TX 75442',
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
    address: '2000 W Audie Murphy Pkwy, Farmersville, TX 75442',
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
    address: '4315 Hopkins Ave, Dallas, TX 75209',
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
    address: '3000 Mockingbird, Midland, TX 79705',
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
    address: '5001 Office Park, Odessa, TX 79762',
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
    address: '801 S Loop 250 W, Midland, TX 79703',
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
    address: '1119 S Red River Expy, Burkburnett, TX 76354',
    city: 'Burkburnett, TX',
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
    address: '910 Midwestern Pkwy, Wichita Falls, TX 76302',
    city: 'Wichita Falls, TX',
    shootDate: 'Wednesday, December 9, 2026',
    shortDate: '12/9',
    dayOfWeek: 'Wednesday',
    loungeName: 'Wichita Falls Red River Sunroom',
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1YwIN107MjS5t4RD1PmhAMB0sivr6wmPWOoaVIveV7CA/edit',
  },
  cp: {
    code: 'cp',
    abbr: 'CP',
    name: 'Crown Point Health Suites',
    address: '6640 Iola Ave, Lubbock, TX 79424',
    city: 'Lubbock, TX',
    shootDate: 'Thursday, December 10, 2026',
    shortDate: '12/10',
    dayOfWeek: 'Thursday',
    loungeName: 'Crown Point Staging Lounge',
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
    hourLabel: '2:00 PM – 2:50 PM',
    slots: [
      '2:00 PM', '2:05 PM', '2:10 PM', '2:15 PM', '2:20 PM',
      '2:25 PM', '2:30 PM', '2:35 PM', '2:40 PM', '2:45 PM',
    ],
    bufferLabel: '2:50 PM – 3:00 PM (10-Min Studio Reset)',
  },
  {
    hourLabel: '3:00 PM – 3:50 PM',
    slots: [
      '3:00 PM', '3:05 PM', '3:10 PM', '3:15 PM', '3:20 PM',
      '3:25 PM', '3:30 PM', '3:35 PM', '3:40 PM', '3:45 PM',
    ],
    bufferLabel: '3:50 PM – 4:00 PM (10-Min Studio Reset)',
  },
  {
    hourLabel: '4:00 PM – 4:50 PM',
    slots: [
      '4:00 PM', '4:05 PM', '4:10 PM', '4:15 PM', '4:20 PM',
      '4:25 PM', '4:30 PM', '4:35 PM', '4:40 PM', '4:45 PM',
    ],
    bufferLabel: '4:50 PM – 5:00 PM (10-Min Studio Reset)',
  },
  {
    hourLabel: '5:00 PM – 5:50 PM',
    slots: [
      '5:00 PM', '5:05 PM', '5:10 PM', '5:15 PM', '5:20 PM',
      '5:25 PM', '5:30 PM', '5:35 PM', '5:40 PM', '5:45 PM',
    ],
    bufferLabel: '5:50 PM – 6:00 PM (10-Min Studio Reset)',
  },
  {
    hourLabel: '6:00 PM – 6:50 PM',
    slots: [
      '6:00 PM', '6:05 PM', '6:10 PM', '6:15 PM', '6:20 PM',
      '6:25 PM', '6:30 PM', '6:35 PM', '6:40 PM', '6:45 PM',
    ],
    bufferLabel: '6:50 PM – 7:00 PM (Day Wrap-Up & Pack-Down)',
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
