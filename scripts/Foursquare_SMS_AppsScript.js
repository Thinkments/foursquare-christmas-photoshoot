/**
 * ============================================================================
 * 🎄 FOURSQUARE HEALTHCARE 2026 CHRISTMAS PHOTO TOUR
 * Project: Foursquare facility photoshoot SMS & Google Sheets sync
 * 
 * Features:
 * 1. Facility-Specific Automated SMS Confirmation Text Dispatch
 * 2. Twilio REST API Integration (Primary - Native SMS to all mobile carriers)
 * 3. Multi-carrier Email-to-SMS Gateway (Fallback)
 * 4. Live Google Sheets Roster Sync across all 12 facilities
 * ============================================================================
 */

// ============================================================================
// 1. TWILIO CREDENTIALS & PHONE NUMBER (Foursquare Healthcare Subaccount)
// ============================================================================
const TWILIO_CONFIG = {
  accountSid: "YOUR_TWILIO_ACCOUNT_SID",
  authToken: "YOUR_TWILIO_AUTH_TOKEN",
  fromNumber: "+18176860300"
};

// ============================================================================
// 2. FACILITY DIRECTORY & METADATA
// ============================================================================
const FACILITIES_CONFIG = {
  "hml": {
    name: "Hillside Medical Lodge",
    abbr: "HML",
    address: "300 S Highway 36 Byp N, Gatesville, TX 76528",
    lounge: "Hillside Fireside Solarium",
    shootDate: "Thursday, Nov 5, 2026",
    sheetId: "1ICSuhXYnnBH5gAaikJyXOuQlAIGa70q3gowZiKxw3j4"
  },
  "wnr": {
    name: "Whitney Nursing & Rehabilitation",
    abbr: "WNR",
    address: "101 S San Marcos St, Whitney, TX 76692",
    lounge: "Whitney Heritage Community Room",
    shootDate: "Friday, Nov 6, 2026",
    sheetId: "1tCTVeltddtPnSVFRdvcaaPZneGJIKn9MASTm4cTwBbQ"
  },
  "cml": {
    name: "Cheyenne Medical Lodge",
    abbr: "CML",
    address: "750 Hwy 352, Mesquite, TX 75149",
    lounge: "Cheyenne Grand Prairie Staging Room",
    shootDate: "Nov 9 & 10, 2026",
    sheetId: "1eCYxLcAEY5ItRn_4LpgH0gGgadCUKz_Cm7xqK8j4Bos"
  },
  "pml": {
    name: "Princeton Medical Lodge",
    abbr: "PML",
    address: "1401 W Princeton Dr, Princeton, TX 75407",
    lounge: "Princeton Courtyard Pavilion",
    shootDate: "Thursday, Nov 12, 2026",
    sheetId: "1W638inRfm4VszJhtomYWPG0ufpperUfnu4ms3uT0NxU"
  },
  "fhr": {
    name: "Farmersville Health & Rehabilitation",
    abbr: "FHR",
    address: "205 Beech St, Farmersville, TX 75442",
    lounge: "Farmersville Evergreen Great Room",
    shootDate: "Friday, Nov 13, 2026",
    sheetId: "1AJMGyZzrGDHxB3N5gBMI435tWdU1aPudeFC29O0Yx-c"
  },
  "lml": {
    name: "Lexington Medical Lodge",
    abbr: "LML",
    address: "2000 W Audie Murphy Pkwy, Farmersville, TX 75442",
    lounge: "Lexington Magnolia Activity Atrium",
    shootDate: "Tuesday, Nov 17, 2026",
    sheetId: "1jms0PsKi1Iy0lcEvipd57JcKA9YdRDQSQdousDQhN7c"
  },
  "tray": {
    name: "Traymore at Park Cities",
    abbr: "T@PC",
    address: "4315 Hopkins Ave, Dallas, TX 75209",
    lounge: "Traymore Highland Park Holiday Studio",
    shootDate: "Tuesday, Nov 24, 2026",
    sheetId: "1HhrpSrtuE_Z_tnQYpGkZMgxR_ytmgGe_tdlnPejweIo"
  },
  "mml": {
    name: "Midland Medical Lodge",
    abbr: "MML",
    address: "3000 Mockingbird, Midland, TX 79705",
    lounge: "Midland Rose Garden Recreation Room",
    shootDate: "Monday, Nov 30, 2026",
    sheetId: "1ytJ_HVCUZCjFHdXpU5lTqaWfmoq5ta6N7SbypFKixcE"
  },
  "mmr": {
    name: "Madison Medical Resort",
    abbr: "MMR",
    address: "5001 Office Park, Odessa, TX 79762",
    lounge: "Madison Grand Ballroom Staging Suite",
    shootDate: "Tuesday, Dec 1, 2026",
    sheetId: "1fhMmZV27mXXfX5jAF5YAERQGjCqFan07GvgNseznAbw"
  },
  "aml": {
    name: "Ashton Medical Lodge",
    abbr: "AML",
    address: "801 S Loop 250 W, Midland, TX 79703",
    lounge: "Ashton Main Fireside Staging Lounge",
    shootDate: "Wednesday, Dec 2, 2026",
    sheetId: "1n9LasYjsQUJGszzPVBlY9KjMqEocG2SoH2tyHbucBkg"
  },
  "sml": {
    name: "Sheridan Medical Lodge",
    abbr: "SML",
    address: "1119 S Red River Expy, Burkburnett, TX 76354",
    lounge: "Sheridan Chisholm Trail Gathering Room",
    shootDate: "Tuesday, Dec 8, 2026",
    sheetId: "13e41eSswwEOar9k9DvWTVTNgvMR7jqTKr3zOZbq0OEk"
  },
  "scwf": {
    name: "Senior Care Wichita Falls",
    abbr: "SCWF",
    address: "910 Midwestern Pkwy, Wichita Falls, TX 76302",
    lounge: "Wichita Falls Red River Sunroom",
    shootDate: "Wednesday, Dec 9, 2026",
    sheetId: "1YwIN107MjS5t4RD1PmhAMB0sivr6wmPWOoaVIveV7CA"
  },
  "cp": {
    name: "Crown Point Health Suites",
    abbr: "CP",
    address: "6640 Iola Ave, Lubbock, TX 79424",
    lounge: "Crown Point Staging Lounge",
    shootDate: "Thursday, Dec 10, 2026",
    sheetId: ""
  }
};

// Carrier SMS Gateways for fallback
const CARRIER_GATEWAYS = {
  "verizon": "@vtext.com",
  "att": "@mms.att.net",
  "att_txt": "@txt.att.net",
  "tmobile": "@tmomail.net",
  "sprint": "@messaging.sprintpcs.com",
  "cricket": "@mms.cricketwireless.net",
  "metro": "@mymetropcs.com",
  "boost": "@sms.myboostmobile.com",
  "googlefi": "@msg.fi.google.com",
  "uscellular": "@email.uscc.net",
  "consumercellular": "@mailmymobile.net",
  "mint": "@tmomail.net",
  "xfinity": "@vtext.com"
};

function cleanPhoneNumber(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.substring(1);
  }
  return digits.length === 10 ? digits : "";
}

/**
 * Sends SMS via Twilio REST API (with automatic fallback to carrier email-to-sms)
 */
function sendSmsNotification(phoneNumber, messageText, carrier) {
  const cleanPhone = cleanPhoneNumber(phoneNumber);
  if (!cleanPhone) {
    Logger.log("❌ Invalid phone number: " + phoneNumber);
    return false;
  }

  // 1. Check if Twilio is configured
  const isTwilioConfigured = 
    TWILIO_CONFIG.accountSid && 
    !TWILIO_CONFIG.accountSid.includes("YOUR_") &&
    TWILIO_CONFIG.authToken && 
    !TWILIO_CONFIG.authToken.includes("YOUR_") &&
    TWILIO_CONFIG.fromNumber && 
    !TWILIO_CONFIG.fromNumber.includes("YOUR_");

  if (isTwilioConfigured) {
    try {
      const formattedTo = cleanPhone.startsWith("+") ? cleanPhone : ("+1" + cleanPhone);
      const url = "https://api.twilio.com/2010-04-01/Accounts/" + TWILIO_CONFIG.accountSid + "/Messages.json";

      const payload = {
        "To": formattedTo,
        "From": TWILIO_CONFIG.fromNumber,
        "Body": messageText
      };

      const options = {
        "method": "post",
        "headers": {
          "Authorization": "Basic " + Utilities.base64Encode(TWILIO_CONFIG.accountSid + ":" + TWILIO_CONFIG.authToken)
        },
        "payload": payload,
        "muteHttpExceptions": true
      };

      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();
      Logger.log("✓ Twilio Status [" + code + "]: " + response.getContentText());
      if (code === 200 || code === 201) {
        return true;
      }
    } catch (err) {
      Logger.log("⚠️ Twilio failed (" + err.message + "), falling back to email-to-sms...");
    }
  }

  // 2. Fallback to Email-to-SMS
  return dispatchEmailToSms(cleanPhone, carrier, messageText);
}

function dispatchEmailToSms(cleanPhone, carrier, messageText) {
  const normalizedCarrier = String(carrier || "").toLowerCase().replace(/[^a-z]/g, "");
  const targetGateway = CARRIER_GATEWAYS[normalizedCarrier];

  let recipients = [];
  if (targetGateway) {
    recipients.push(cleanPhone + targetGateway);
  } else {
    recipients.push(cleanPhone + "@vtext.com");
    recipients.push(cleanPhone + "@mms.att.net");
    recipients.push(cleanPhone + "@txt.att.net");
    recipients.push(cleanPhone + "@tmomail.net");
    recipients.push(cleanPhone + "@mms.cricketwireless.net");
  }

  recipients.forEach(function(recipientAddress) {
    try {
      MailApp.sendEmail({
        to: recipientAddress,
        subject: "",
        body: messageText
      });
      Logger.log("✓ Email-to-SMS sent to: " + recipientAddress);
    } catch (e) {
      Logger.log("⚠️ Error sending to " + recipientAddress + ": " + e.message);
    }
  });

  return true;
}

/**
 * Webhook handler for live bookings from the website
 */
function doPost(e) {
  try {
    let data;
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("No payload provided");
    }

    const facilityCode = String(data.facilityCode || "aml").toLowerCase();
    const fac = FACILITIES_CONFIG[facilityCode] || {
      name: data.facilityName || "Foursquare Healthcare",
      abbr: data.facilityAbbr || "4SQ",
      address: data.facilityAddress || "",
      lounge: data.loungeName || "Holiday Studio Lounge",
      shootDate: data.date || "",
      sheetId: ""
    };

    const sheetId = fac.sheetId || "";
    const timeSlot = data.timeSlot || "";
    const residentName = data.residentName || "";
    const roomNumber = data.roomNumber || "";
    const familyContact = data.familyContact || "";
    const familyPhone = data.familyPhone || "";
    const familyEmail = data.familyEmail || "";
    const mobilityNeeds = data.needsWheelchair ? "Wheelchair assistance requested" : (data.mobilityNeeds || "Standard seating");
    const ref = data.ref || ("4SQ-" + Math.floor(1000 + Math.random() * 9000));
    const carrier = data.carrier || "";
    const dateStr = data.date || fac.shootDate;
    const rescheduleUrl = data.rescheduleUrl || ("https://christmasphotos.netlify.app/reschedule?ref=" + encodeURIComponent(ref));

    // 1. Write to the Facility Google Sheet
    if (sheetId) {
      const ss = SpreadsheetApp.openById(sheetId);
      const ws = ss.getActiveSheet();
      const lastRow = ws.getLastRow();
      let matchedRow = -1;

      if (lastRow >= 5) {
        const timeColumn = ws.getRange(5, 1, lastRow - 4, 1).getValues();
        for (let i = 0; i < timeColumn.length; i++) {
          if (String(timeColumn[i][0]).includes(timeSlot)) {
            matchedRow = 5 + i;
            break;
          }
        }
      }

      const targetRow = matchedRow > 0 ? matchedRow : ws.getLastRow() + 1;
      const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd hh:mm a");

      ws.getRange(targetRow, 1).setValue(timeSlot);
      ws.getRange(targetRow, 2).setValue("Confirmed");
      ws.getRange(targetRow, 3).setValue(ref);
      ws.getRange(targetRow, 4).setValue(residentName);
      ws.getRange(targetRow, 5).setValue(roomNumber);
      ws.getRange(targetRow, 6).setValue(familyContact);
      ws.getRange(targetRow, 7).setValue(familyPhone);
      ws.getRange(targetRow, 8).setValue(familyEmail);
      ws.getRange(targetRow, 9).setValue(mobilityNeeds);
      ws.getRange(targetRow, 10).setValue("Booked via Online Portal");
      ws.getRange(targetRow, 11).setValue(rescheduleUrl);
      ws.getRange(targetRow, 12).setValue("📲 Web Confirmed: " + timestamp);
    }

    // 2. Dispatch Facility-Specific SMS confirmation text
    if (familyPhone) {
      const residentDisplay = residentName ? (residentName + (roomNumber ? " (" + roomNumber + ")" : "")) : "Your Session";
      
      const smsMessage = "🎄 Foursquare Photo Confirmed!\n" +
        "Resident: " + residentDisplay + "\n" +
        "Facility: " + fac.name + " (" + fac.abbr + ")\n" +
        "Address: " + fac.address + "\n" +
        "Date/Time: " + (dateStr ? (dateStr + " at ") : "") + timeSlot + "\n" +
        "Studio: " + fac.lounge + "\n" +
        "Pass Ref: " + ref + "\n" +
        "Reschedule anytime: " + rescheduleUrl;

      sendSmsNotification(familyPhone, smsMessage, carrier);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", ref: ref }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("doPost Error: " + err.message);
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify facility-specific SMS dispatch
 */
function testFacilitySmsDispatch() {
  const TEST_RECIPIENT = "9403151023"; // Replace with test phone number
  const sampleMessage = "🎄 Foursquare Photo Confirmed!\n" +
    "Resident: Harold Jenkins (Room 204B)\n" +
    "Facility: Ashton Medical Lodge (AML)\n" +
    "Address: 801 S Loop 250 W, Midland, TX 79703\n" +
    "Date/Time: Wednesday, Dec 2 at 10:15 AM\n" +
    "Studio: Ashton Main Fireside Staging Lounge\n" +
    "Pass Ref: 4SQ-7821\n" +
    "Reschedule anytime: https://christmasphotos.netlify.app/reschedule?ref=4SQ-7821";

  sendSmsNotification(TEST_RECIPIENT, sampleMessage, "");
}
