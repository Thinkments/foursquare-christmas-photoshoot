/**
 * Netlify Serverless Function: send-sms
 * Dispatches automated Twilio SMS confirmations for Foursquare Christmas Photo Shoot bookings.
 */
export default async (req, context) => {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const data = await req.json();
    const familyPhone = data.familyPhone || data.phone || '';

    // Normalize phone number to E.164 (+1XXXXXXXXXX)
    const digits = String(familyPhone).replace(/\D/g, '');
    let cleanPhone = '';
    if (digits.length === 10) {
      cleanPhone = `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      cleanPhone = `+${digits}`;
    } else if (String(familyPhone).startsWith('+') && digits.length >= 10) {
      cleanPhone = `+${digits}`;
    }

    if (!cleanPhone) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing phone number', phone: familyPhone }),
        { status: 400, headers: corsHeaders }
      );
    }

    const residentName = data.residentName || '';
    const roomNumber = data.roomNumber ? ` (${data.roomNumber.toLowerCase().includes('room') ? data.roomNumber : 'Room ' + data.roomNumber})` : '';
    const residentDisplay = residentName ? `${residentName}${roomNumber}` : 'Your Holiday Session';
    const facilityName = data.facilityName || 'Foursquare Healthcare';
    const facilityAbbr = data.facilityAbbr ? ` (${data.facilityAbbr})` : '';
    const address = data.facilityAddress || '';
    const dateStr = data.date || '';
    const timeSlot = data.timeSlot || '';
    const dateTimeStr = dateStr && timeSlot ? `${dateStr} at ${timeSlot}` : (dateStr || timeSlot || 'Scheduled Time');
    const lounge = data.loungeName || 'Holiday Studio Lounge';
    const ref = data.ref || '4SQ-CONFIRMED';
    const rescheduleUrl = data.rescheduleUrl || `https://christmasphotos.netlify.app/reschedule?ref=${encodeURIComponent(ref)}`;

    const messageText = 
`🎄 Foursquare Photo Confirmed!
Resident: ${residentDisplay}
Facility: ${facilityName}${facilityAbbr}
Address: ${address}
Date/Time: ${dateTimeStr}
Studio: ${lounge}
Pass Ref: ${ref}
Reschedule: ${rescheduleUrl}

Reply STOP to opt out.`;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authUser = process.env.TWILIO_API_KEY || process.env.TWILIO_ACCOUNT_SID;
    const authPass = process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    const fromNumber = process.env.TWILIO_FROM_NUMBER || '+18176860300';

    if (!accountSid || !authUser || !authPass) {
      console.error('Missing Twilio credentials in environment (requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN or TWILIO_API_KEY/SECRET)');
      return new Response(
        JSON.stringify({ error: 'Twilio credentials not configured in environment' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const authHeader = 'Basic ' + Buffer.from(`${authUser}:${authPass}`).toString('base64');
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const params = new URLSearchParams();
    params.append('To', cleanPhone);
    if (messagingServiceSid) {
      params.append('MessagingServiceSid', messagingServiceSid);
    } else {
      params.append('From', fromNumber);
    }
    params.append('Body', messageText);

    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const twilioJson = await twilioRes.json();

    if (!twilioRes.ok) {
      console.error('Twilio dispatch error:', twilioJson);
      return new Response(
        JSON.stringify({ status: 'error', twilioError: twilioJson }),
        { status: 502, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ status: 'success', sid: twilioJson.sid, to: cleanPhone }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('send-sms fatal error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
