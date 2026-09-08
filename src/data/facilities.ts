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

// 10-Minute slot schedule rules
// 10:00 AM - 1:00 PM (with 12:00 PM blocked for Dept Head Picture)
export const MORNING_SLOTS = [
  '10:00 AM', '10:10 AM', '10:20 AM', '10:30 AM', '10:40 AM', '10:50 AM',
  '11:00 AM', '11:10 AM', '11:20 AM', '11:30 AM', '11:40 AM', '11:50 AM',
  '12:00 PM', // Locked for Dept Head Picture
  '12:10 PM', '12:20 PM', '12:30 PM', '12:40 PM', '12:50 PM',
];

// Photographer Lunch Break: 1:00 PM - 1:45 PM
export const LUNCH_BREAK = {
  start: '01:00 PM',
  end: '01:45 PM',
  label: 'Photographer Lunch Break & Studio Reset (1:00 PM – 1:45 PM)',
};

// Dept Head Picture Slot: 12:00 PM
export const DEPT_HEAD_SLOT = '12:00 PM';

// 1:45 PM - 7:00 PM
export const AFTERNOON_SLOTS = [
  '01:45 PM', '01:55 PM',
  '02:05 PM', '02:15 PM', '02:25 PM', '02:35 PM', '02:45 PM', '02:55 PM',
  '03:05 PM', '03:15 PM', '03:25 PM', '03:35 PM', '03:45 PM', '03:55 PM',
  '04:05 PM', '04:15 PM', '04:25 PM', '04:35 PM', '04:45 PM', '04:55 PM',
  '05:05 PM', '05:15 PM', '05:25 PM', '05:35 PM', '05:45 PM', '05:55 PM',
  '06:05 PM', '06:15 PM', '06:25 PM', '06:35 PM', '06:45 PM', '06:55 PM',
];

export const ALL_BOOKABLE_SLOTS = [
  ...MORNING_SLOTS.filter((s) => s !== DEPT_HEAD_SLOT),
  ...AFTERNOON_SLOTS,
];
