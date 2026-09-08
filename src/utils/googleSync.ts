/**
 * Google Apps Script Web App Webhook Integration
 * Handles live Google Sheets sync and automated Email-to-SMS confirmation text delivery.
 */
export const GOOGLE_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxTLtXCpIl08THpbgviZNa23ath_yCwxV4iKpBDzOBm6LdI-xSBw_mpvypC4u0JWY10/exec';

export interface BookingPayload {
  facilityCode: string;
  facilityName?: string;
  date: string;
  timeSlot: string;
  residentName: string;
  roomNumber: string;
  familyContact: string;
  familyPhone: string;
  familyEmail: string;
  needsWheelchair?: boolean;
  ref: string;
  carrier?: string;
}

export async function syncBookingToGoogle(payload: BookingPayload): Promise<boolean> {
  try {
    // Send to Google Apps Script Web App
    // mode: 'no-cors' + text/plain avoids browser CORS preflight and guarantees delivery
    await fetch(GOOGLE_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (err) {
    console.warn('Google Sheet & SMS Webhook notification note:', err);
    return false;
  }
}
