/**
 * Netlify Serverless Function: get-bookings
 * Real-time Google Sheets reader for Foursquare Christmas Photo Tour 2026.
 * Fetches live confirmed bookings across all 12 facilities directly from Google Sheets.
 */
import crypto from 'crypto';
import fs from 'fs';

// Facility Spreadsheet Map matching production sheet_links.json
const FACILITIES = {
  hml: {
    code: 'hml',
    name: 'Hillside Medical Lodge',
    abbr: 'HML',
    shootDate: 'Thursday, November 5, 2026',
    sheetId: '1ICSuhXYnnBH5gAaikJyXOuQlAIGa70q3gowZiKxw3j4',
    tabs: ['Schedule & Roster'],
  },
  wnr: {
    code: 'wnr',
    name: 'Whitney Nursing & Rehabilitation',
    abbr: 'WNR',
    shootDate: 'Friday, November 6, 2026',
    sheetId: '1tCTVeltddtPnSVFRdvcaaPZneGJIKn9MASTm4cTwBbQ',
    tabs: ['Schedule & Roster'],
  },
  cml: {
    code: 'cml',
    name: 'Cheyenne Medical Lodge',
    abbr: 'CML',
    shootDate: 'Monday, November 9 & Tuesday, November 10, 2026',
    sheetId: '1eCYxLcAEY5ItRn_4LpgH0gGgadCUKz_Cm7xqK8j4Bos',
    tabs: ['Day 1 (Nov 9)', 'Day 2 (Nov 10)'],
  },
  pml: {
    code: 'pml',
    name: 'Princeton Medical Lodge',
    abbr: 'PML',
    shootDate: 'Thursday, November 12, 2026',
    sheetId: '1W638inRfm4VszJhtomYWPG0ufpperUfnu4ms3uT0NxU',
    tabs: ['Schedule & Roster'],
  },
  fhr: {
    code: 'fhr',
    name: 'Farmersville Health & Rehabilitation',
    abbr: 'FHR',
    shootDate: 'Friday, November 13, 2026',
    sheetId: '1AJMGyZzrGDHxB3N5gBMI435tWdU1aPudeFC29O0Yx-c',
    tabs: ['Schedule & Roster'],
  },
  lml: {
    code: 'lml',
    name: 'Lexington Medical Lodge',
    abbr: 'LML',
    shootDate: 'Tuesday, November 17, 2026',
    sheetId: '1jms0PsKi1Iy0lcEvipd57JcKA9YdRDQSQdousDQhN7c',
    tabs: ['Schedule & Roster'],
  },
  tray: {
    code: 'tray',
    name: 'Traymore at Park Cities',
    abbr: 'TRAY',
    shootDate: 'Tuesday, November 24, 2026',
    sheetId: '1HhrpSrtuE_Z_tnQYpGkZMgxR_ytmgGe_tdlnPejweIo',
    tabs: ['Schedule & Roster'],
  },
  mml: {
    code: 'mml',
    name: 'Midland Medical Lodge',
    abbr: 'MML',
    shootDate: 'Monday, November 30, 2026',
    sheetId: '1ytJ_HVCUZCjFHdXpU5lTqaWfmoq5ta6N7SbypFKixcE',
    tabs: ['Schedule & Roster'],
  },
  mmr: {
    code: 'mmr',
    name: 'Madison Medical Resort',
    abbr: 'MMR',
    shootDate: 'Tuesday, December 1, 2026',
    sheetId: '1fhMmZV27mXXfX5jAF5YAERQGjCqFan07GvgNseznAbw',
    tabs: ['Schedule & Roster'],
  },
  aml: {
    code: 'aml',
    name: 'Ashton Medical Lodge',
    abbr: 'AML',
    shootDate: 'Wednesday, December 2, 2026',
    sheetId: '1n9LasYjsQUJGszzPVBlY9KjMqEocG2SoH2tyHbucBkg',
    tabs: ['Schedule & Roster'],
  },
  sml: {
    code: 'sml',
    name: 'Sheridan Medical Lodge',
    abbr: 'SML',
    shootDate: 'Tuesday, December 8, 2026',
    sheetId: '13e41eSswwEOar9k9DvWTVTNgvMR7jqTKr3zOZbq0OEk',
    tabs: ['Schedule & Roster'],
  },
  scwf: {
    code: 'scwf',
    name: 'Senior Care Wichita Falls',
    abbr: 'SCWF',
    shootDate: 'Wednesday, December 9, 2026',
    sheetId: '1YwIN107MjS5t4RD1PmhAMB0sivr6wmPWOoaVIveV7CA',
    tabs: ['Schedule & Roster'],
  },
};

// Cached Google OAuth Access Token
let cachedToken = null;
let tokenExpiresAt = 0;

function getServiceAccount() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY.trim();
      if (raw.startsWith('{')) {
        return JSON.parse(raw);
      }
      return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    } catch (e) {
      console.error('Error parsing GOOGLE_SERVICE_ACCOUNT_KEY env var:', e);
    }
  }

  // Local fallback
  const localPaths = [
    'C:\\Users\\Corey\\.gemini\\antigravity-ide\\brain\\29e1a2b9-4cdd-4bc5-8a06-22aaf1b354e4\\scratch\\sa-key.json',
    './sa-key.json',
  ];
  for (const p of localPaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) {}
    }
  }
  return null;
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && tokenExpiresAt > now + 60) {
    return cachedToken;
  }

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  ).toString('base64url');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${claim}`);
  const signature = sign.sign(sa.private_key, 'base64url');
  const jwt = `${header}.${claim}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Failed to obtain Google access token: ' + JSON.stringify(data));
  }
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600);
  return cachedToken;
}

// Normalize slot time string to match frontend format (e.g., "2:00 PM" -> "02:00 PM" and vice versa)
function normalizeTimeSlot(timeStr) {
  if (!timeStr) return '';
  const clean = timeStr.trim();
  // Match e.g. "2:05 PM" or "02:05 PM"
  const m = clean.match(/^0?(\d+:\d{2}\s*(?:AM|PM))$/i);
  if (m) {
    const parts = m[1].split(':');
    const hour = parseInt(parts[0], 10);
    const rest = parts[1].toUpperCase();
    // Return both formats for easy inclusion check
    const padded = `${hour < 10 ? '0' + hour : hour}:${rest}`;
    const unpadded = `${hour}:${rest}`;
    return { padded, unpadded };
  }
  return { padded: clean, unpadded: clean };
}

async function fetchFacilityBookings(fac, accessToken) {
  const bookings = [];
  const bookedSlots = new Set();

  for (const tab of fac.tabs) {
    const range = encodeURIComponent(`${tab}!A1:L130`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${fac.sheetId}/values/${range}`;

    try {
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await resp.json();
      const rows = data.values || [];

      // Scan rows from row 5 onwards (1-indexed row 5 = index 4)
      for (let i = 4; i < rows.length; i++) {
        const r = rows[i];
        if (!r || r.length < 2) continue;

        const rawTime = (r[0] || '').trim();
        const status = (r[1] || '').trim();
        const ref = (r[2] || '').trim();
        const residentName = (r[3] || '').trim();
        const roomNumber = (r[4] || '').trim();
        const familyContact = (r[5] || '').trim();
        const familyPhone = (r[6] || '').trim();
        const familyEmail = (r[7] || '').trim();
        const mobilityNeeds = (r[8] || '').trim();

        // If status is Confirmed OR there is a resident name or booking ref
        if (status.toLowerCase() === 'confirmed' || (residentName && status.toLowerCase() !== 'buffer')) {
          const norm = normalizeTimeSlot(rawTime);
          if (norm.padded) bookedSlots.add(norm.padded);
          if (norm.unpadded) bookedSlots.add(norm.unpadded);

          // Determine date
          let dateStr = fac.shootDate;
          if (tab.includes('Day 1')) dateStr = 'Monday, November 9, 2026';
          if (tab.includes('Day 2')) dateStr = 'Tuesday, November 10, 2026';

          bookings.push({
            id: `${fac.code}-${ref || ('row-' + (i + 1))}`,
            ref: ref || `${fac.abbr}-${Math.floor(100 + Math.random() * 900)}`,
            facilityCode: fac.code,
            facilityName: fac.name,
            campusId: fac.code,
            campusName: fac.name,
            date: dateStr,
            timeSlot: norm.unpadded || rawTime,
            timeSlotPadded: norm.padded || rawTime,
            bookingType: roomNumber.toLowerCase().includes('staff') ? 'Staff' : 'Resident',
            residentName: residentName || 'Resident Reserved',
            roomNumber: roomNumber || '101',
            bed: roomNumber.toLowerCase().includes('b') ? 'Bed B' : 'Private',
            guestCount: 2,
            familyContact: familyContact || 'Family Member',
            familyContactName: familyContact || 'Family Member',
            familyPhone,
            familyEmail,
            departmentHead: 'Social Services Director',
            callStatus: 'Spoke - Confirmed',
            callNotes: '',
            needsWheelchair: mobilityNeeds.toLowerCase().includes('wheelchair'),
            mobilityNeeds: mobilityNeeds || 'Standard seating',
            status: 'Scheduled',
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error(`Error reading ${fac.code} tab ${tab}:`, err);
    }
  }

  return { bookings, bookedSlots: Array.from(bookedSlots) };
}

export default async (req, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=5, s-maxage=15', // 5-second browser cache, 15-second CDN cache
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const facilityParam = (url.searchParams.get('facility') || url.searchParams.get('campus') || 'hml').toLowerCase();

    const sa = getServiceAccount();
    if (!sa) {
      return new Response(
        JSON.stringify({ error: 'Google Service Account credentials not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const token = await getAccessToken(sa);

    if (facilityParam === 'all') {
      const allBookings = [];
      const facilitySummaries = {};

      for (const fac of Object.values(FACILITIES)) {
        if (!fac.sheetId) continue;
        const res = await fetchFacilityBookings(fac, token);
        allBookings.push(...res.bookings);
        facilitySummaries[fac.code] = {
          count: res.bookings.length,
          bookedSlots: res.bookedSlots,
        };
      }

      return new Response(
        JSON.stringify({
          status: 'ok',
          facilityCode: 'all',
          totalBookings: allBookings.length,
          facilities: facilitySummaries,
          bookings: allBookings,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    const fac = FACILITIES[facilityParam] || FACILITIES.hml;
    const { bookings, bookedSlots } = await fetchFacilityBookings(fac, token);

    return new Response(
      JSON.stringify({
        status: 'ok',
        facilityCode: fac.code,
        facilityName: fac.name,
        facilityAbbr: fac.abbr,
        shootDate: fac.shootDate,
        totalBookings: bookings.length,
        bookedSlots,
        bookings,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('get-bookings function error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
