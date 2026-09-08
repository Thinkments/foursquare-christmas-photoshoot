/**
 * ============================================================================
 * 🎄 FOURSQUARE HEALTHCARE 2026 CHRISTMAS PHOTO TOUR
 * Project: Foursquare facility photoshoot sms appscript
 * 
 * NOTE: This script strictly uses the EXISTING 12 spreadsheets.
 * It does NOT create any new spreadsheets.
 * ============================================================================
 */

// Mapping of the 12 existing facility Google Sheets
const FACILITY_SHEET_IDS = {
  "hml": "1ICSuhXYnnBH5gAaikJyXOuQlAIGa70q3gowZiKxw3j4", // Hillside Medical Lodge
  "wnr": "1tCTVeltddtPnSVFRdvcaaPZneGJIKn9MASTm4cTwBbQ", // Whitney Nursing & Rehab
  "cml": "1eCYxLcAEY5ItRn_4LpgH0gGgadCUKz_Cm7xqK8j4Bos", // Cheyenne Medical Lodge
  "pml": "1W638inRfm4VszJhtomYWPG0ufpperUfnu4ms3uT0NxU", // Princeton Medical Lodge
  "fhr": "1AJMGyZzrGDHxB3N5gBMI435tWdU1aPudeFC29O0Yx-c", // Farmersville Health & Rehab
  "lml": "1jms0PsKi1Iy0lcEvipd57JcKA9YdRDQSQdousDQhN7c", // Lexington Medical Lodge
  "tray": "1HhrpSrtuE_Z_tnQYpGkZMgxR_ytmgGe_tdlnPejweIo", // Traymore at Park Cities
  "mml": "1ytJ_HVCUZCjFHdXpU5lTqaWfmoq5ta6N7SbypFKixcE", // Midland Medical Lodge
  "mmr": "1fhMmZV27mXXfX5jAF5YAERQGjCqFan07GvgNseznAbw", // Madison Medical Resort
  "aml": "1n9LasYjsQUJGszzPVBlY9KjMqEocG2SoH2tyHbucBkg", // Ashton Medical Lodge
  "sml": "13e41eSswwEOar9k9DvWTVTNgvMR7jqTKr3zOZbq0OEk", // Sheridan Medical Lodge
  "scwf": "1YwIN107MjS5t4RD1PmhAMB0sivr6wmPWOoaVIveV7CA"  // Senior Care Wichita Falls
};

// Carrier SMS Gateways
const CARRIER_GATEWAYS = {
  "verizon": "@vtext.com",
  "att": "@txt.att.net",
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

function dispatchSms(phoneNumber, carrier, messageText) {
  const cleanPhone = cleanPhoneNumber(phoneNumber);
  if (!cleanPhone) return false;

  const normalizedCarrier = String(carrier || "").toLowerCase().replace(/[^a-z]/g, "");
  const targetGateway = CARRIER_GATEWAYS[normalizedCarrier];

  let recipients = [];
  if (targetGateway) {
    recipients.push(cleanPhone + targetGateway);
  } else {
    // Broadcast to top carriers
    recipients.push(cleanPhone + CARRIER_GATEWAYS["verizon"]);
    recipients.push(cleanPhone + CARRIER_GATEWAYS["att"]);
    recipients.push(cleanPhone + CARRIER_GATEWAYS["tmobile"]);
  }

  recipients.forEach(function(recipientAddress) {
    try {
      MailApp.sendEmail({
        to: recipientAddress,
        subject: "",
        body: messageText
      });
      Logger.log("✓ SMS sent to: " + recipientAddress);
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
    const sheetId = FACILITY_SHEET_IDS[facilityCode] || FACILITY_SHEET_IDS["aml"];
    const timeSlot = data.timeSlot || "";
    const residentName = data.residentName || "";
    const roomNumber = data.roomNumber || "";
    const familyContact = data.familyContact || "";
    const familyPhone = data.familyPhone || "";
    const familyEmail = data.familyEmail || "";
    const mobilityNeeds = data.needsWheelchair ? "Wheelchair assistance requested" : (data.mobilityNeeds || "Standard seating");
    const ref = data.ref || ("REF-" + Math.floor(100 + Math.random() * 900));
    const carrier = data.carrier || "";

    // 1. Write to the EXISTING Google Sheet
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
      ws.getRange(targetRow, 11).setValue("https://foursquare-christmas-photoshoot.netlify.app/reschedule");
      ws.getRange(targetRow, 12).setValue("📲 Web Confirmed: " + timestamp);
    }

    // 2. Dispatch SMS confirmation text
    if (familyPhone) {
      const smsMessage = "🎄 Foursquare Photo Confirmed! " + residentName + " is scheduled for " + timeSlot + ". Need to change time? Reschedule anytime here: https://foursquare-christmas-photoshoot.netlify.app/reschedule";
      dispatchSms(familyPhone, carrier, smsMessage);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", ref: ref }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log("doPost Error: " + err.message);
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testMyPhone() {
  const phone = "9403151023";
  const message = "🎄 Foursquare Christmas Photo Tour: Test SMS confirmation! https://foursquare-christmas-photoshoot.netlify.app/reschedule";
  dispatchSms(phone, "", message);
}
