/**
 * Google Apps Script Web App Webhook Integration
 * Handles live Google Sheets sync and automated Email-to-SMS confirmation text delivery.
 */
export const GOOGLE_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxTLtXCpIl08THpbgviZNa23ath_yCwxV4iKpBDzOBm6LdI-xSBw_mpvypC4u0JWY10/exec';

export interface BookingPayload {
  facilityCode: string;
  facilityName?: string;
  facilityAbbr?: string;
  facilityAddress?: string;
  facilityCity?: string;
  loungeName?: string;
  date: string;
  timeSlot: string;
  bookingType?: 'Resident' | 'Staff';
  residentName: string;
  roomNumber: string;
  bed?: 'Bed A' | 'Bed B' | 'Private' | 'N/A';
  guestCount?: number;
  familyContact: string;
  familyPhone: string;
  familyEmail: string;
  departmentHead?: string;
  callStatus?: string;
  needsWheelchair?: boolean;
  ref: string;
  carrier?: string;
  rescheduleUrl?: string;
}

function padTimeSlot(timeStr: string): string {
  const clean = (timeStr || '').trim();
  const m = clean.match(/^0?(\d+):(\d{2})\s*(AM|PM)$/i);
  if (m) {
    const hr = parseInt(m[1], 10);
    return `${hr < 10 ? '0' + hr : hr}:${m[2]} ${m[3].toUpperCase()}`;
  }
  return clean;
}

export async function syncBookingToGoogle(payload: BookingPayload): Promise<boolean> {
  let sheetSuccess = false;
  const normalizedPayload = {
    ...payload,
    timeSlot: padTimeSlot(payload.timeSlot),
  };

  // 1. Primary: Direct Google Sheets API write via Netlify Serverless Function (supports multi-tab CML & RAW text format)
  try {
    const sheetRes = await fetch('/api/get-bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizedPayload),
    });
    if (sheetRes.ok) {
      sheetSuccess = true;
    }
  } catch (err) {
    console.warn('Direct Google Sheets API sync note:', err);
  }

  // 2. Fallback: Google Apps Script Web App Webhook if direct API did not succeed
  if (!sheetSuccess) {
    try {
      await fetch(GOOGLE_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          ...normalizedPayload,
          smsDispatchedByNetlify: true,
        }),
      });
      sheetSuccess = true;
    } catch (err) {
      console.warn('Google Sheet Webhook sync note:', err);
    }
  }

  // 2. Direct Automated Twilio SMS Dispatch via Netlify Serverless Function
  try {
    const smsRes = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (smsRes.ok) {
      console.log('✓ Confirmation SMS successfully dispatched via Twilio');
    } else {
      console.warn('SMS dispatch response code:', smsRes.status);
    }
  } catch (err) {
    console.warn('Twilio Netlify SMS dispatch note:', err);
  }

  return sheetSuccess;
}
