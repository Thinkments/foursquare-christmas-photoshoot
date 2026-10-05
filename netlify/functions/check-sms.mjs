/**
 * Netlify Serverless Function: check-sms
 * Diagnoses Twilio account status, incoming numbers, and recent message delivery logs/error codes.
 */
export default async (req, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authUser = process.env.TWILIO_API_KEY || process.env.TWILIO_ACCOUNT_SID;
    const authPass = process.env.TWILIO_API_SECRET || process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER || '+18176860300';
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID || null;

    if (!accountSid || !authUser || !authPass) {
      return new Response(
        JSON.stringify({
          error: 'Missing Twilio credentials in environment',
          envCheck: {
            hasAccountSid: !!accountSid,
            hasAuthUser: !!authUser,
            hasAuthPass: !!authPass,
            fromNumber,
            messagingServiceSid,
          },
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const authHeader = 'Basic ' + Buffer.from(`${authUser}:${authPass}`).toString('base64');

    // 1. Fetch Account Details
    let accountInfo = null;
    try {
      const accRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
        headers: { Authorization: authHeader },
      });
      accountInfo = await accRes.json();
    } catch (e) {
      accountInfo = { error: e.message };
    }

    // 2. Fetch Incoming Phone Numbers
    let phoneNumbers = null;
    try {
      const numRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`, {
        headers: { Authorization: authHeader },
      });
      const numData = await numRes.json();
      phoneNumbers = numData.incoming_phone_numbers ? numData.incoming_phone_numbers.map(n => ({
        phoneNumber: n.phone_number,
        friendlyName: n.friendly_name,
        capabilities: n.capabilities,
        status: n.status,
      })) : numData;
    } catch (e) {
      phoneNumbers = { error: e.message };
    }

    // 3. Fetch Last 10 Messages and Delivery Status / Error Codes
    let recentMessages = null;
    try {
      const msgRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json?PageSize=10`, {
        headers: { Authorization: authHeader },
      });
      const msgData = await msgRes.json();
      recentMessages = msgData.messages ? msgData.messages.map(m => ({
        sid: m.sid,
        to: m.to,
        from: m.from,
        dateSent: m.date_sent || m.date_created,
        status: m.status,
        errorCode: m.error_code,
        errorMessage: m.error_message,
        bodyPreview: m.body ? m.body.substring(0, 60) + '...' : '',
      })) : msgData;
    } catch (e) {
      recentMessages = { error: e.message };
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        account: {
          friendlyName: accountInfo.friendly_name,
          type: accountInfo.type,
          status: accountInfo.status,
        },
        configuredFromNumber: fromNumber,
        configuredMessagingService: messagingServiceSid,
        phoneNumbers,
        recentMessages,
      }, null, 2),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Fatal error diagnosing Twilio' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
