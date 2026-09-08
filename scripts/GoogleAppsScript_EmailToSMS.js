/**
 * ============================================================================
 * 🎄 FOURSQUARE HEALTHCARE 2026 CHRISTMAS PHOTO TOUR
 * Free Email-to-SMS Gateway Automation (No Twilio Required)
 *
 * HOW IT WORKS:
 * Major US cellular carriers provide free Email-to-SMS gateways.
 * Google Apps Script sends a lightweight email to: [10-digits]@gateway.net
 * The carrier converts it into a native SMS and delivers it to the recipient's phone.
 *
 * CARRIER GATEWAYS SUPPORTED:
 * - Verizon / Visible / Xfinity Mobile: @vtext.com
 * - AT&T / Cricket: @txt.att.net
 * - T-Mobile / Mint Mobile: @tmomail.net
 * - Sprint / Boost: @messaging.sprintpcs.com
 * - Google Fi: @msg.fi.google.com
 * - US Cellular: @email.uscc.net
 * ============================================================================
 */

// Carrier Gateway Dictionary
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

/**
 * Normalizes phone numbers to 10 clean digits (e.g., '(432) 555-0192' -> '4325550192')
 */
function cleanPhoneNumber(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.substring(1);
  }
  return digits.length === 10 ? digits : "";
}

/**
 * Core SMS Dispatcher via Carrier Gateways
 * If carrier is provided, sends to that carrier gateway.
 * If carrier is unknown/auto, broadcasts to the Top 3 US networks (Verizon, AT&T, T-Mobile).
 */
function dispatchSms(phoneNumber, carrier, messageText) {
  const cleanPhone = cleanPhoneNumber(phoneNumber);
  if (!cleanPhone) {
    Logger.log("❌ Invalid phone number: " + phoneNumber);
    return false;
  }

  const normalizedCarrier = String(carrier || "").toLowerCase().replace(/[^a-z]/g, "");
  const targetGateway = CARRIER_GATEWAYS[normalizedCarrier];

  let recipients = [];
  if (targetGateway) {
    // Specific carrier gateway
    recipients.push(cleanPhone + targetGateway);
  } else {
    // Auto-dispatch across the top 3 networks (covers 95%+ of US mobile lines)
    recipients.push(cleanPhone + CARRIER_GATEWAYS["verizon"]);
    recipients.push(cleanPhone + CARRIER_GATEWAYS["att"]);
    recipients.push(cleanPhone + CARRIER_GATEWAYS["tmobile"]);
  }

  recipients.forEach(function(recipientAddress) {
    try {
      MailApp.sendEmail({
        to: recipientAddress,
        subject: "", // Keep subject blank or minimal for SMS
        body: messageText
      });
      Logger.log("✓ SMS dispatched to: " + recipientAddress);
    } catch (e) {
      Logger.log("⚠️ Failed to dispatch to: " + recipientAddress + " - " + e.message);
    }
  });

  return true;
}

/**
 * TEST FUNCTION:
 * Run this to test texting your own phone number!
 * Replace with your mobile number and run directly in Apps Script.
 */
function testSendSms() {
  const TEST_PHONE = "YOUR_PHONE_NUMBER"; // e.g. "4325550192"
  const TEST_CARRIER = "verizon"; // "verizon", "att", "tmobile", or "" for auto
  const message = "🎄 Foursquare Photo Test: Your holiday portrait session is confirmed! Reschedule link: https://foursquare-christmas-photoshoot.netlify.app/reschedule";

  Logger.log("Sending test SMS to: " + TEST_PHONE);
  const success = dispatchSms(TEST_PHONE, TEST_CARRIER, message);
  Logger.log("Result: " + (success ? "Dispatched successfully!" : "Failed"));
}

/**
 * Adds Custom Menu to Google Sheets when opened by staff or Jeremy
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🎄 Foursquare SMS")
    .addItem("📲 Send SMS Reminder (Selected Row)", "sendSmsToSelectedRow")
    .addItem("📲 Send Confirmation SMS (Selected Row)", "sendConfirmationToSelectedRow")
    .addSeparator()
    .addItem("🚀 Send Reminders to ALL Booked Rows", "sendAllDayOfReminders")
    .addToUi();
}

/**
 * Sends SMS Reminder for currently highlighted row in the Google Sheet
 */
function sendSmsToSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveCell().getRow();
  
  if (row < 5) {
    SpreadsheetApp.getUi().alert("Please select a booked resident row (Row 5 or lower).");
    return;
  }

  const rowValues = sheet.getRange(row, 1, 1, 13).getValues()[0];
  const slotTime = rowValues[0];
  const status = rowValues[1];
  const residentName = rowValues[3];
  const contactName = rowValues[5] || "Family";
  const phone = rowValues[6];
  const carrier = rowValues[7]; // If carrier column exists or blank for auto
  const facilityTitle = sheet.getRange("A1").getValue();

  if (!residentName || !phone) {
    SpreadsheetApp.getUi().alert("Row " + row + " is missing Resident Name or Phone Number.");
    return;
  }

  const message = "🎄 Hi " + contactName + "! Reminder: Your 10-min Christmas portrait session for " + residentName + " is scheduled for " + slotTime + ". Need to reschedule? Tap: https://foursquare-christmas-photoshoot.netlify.app/reschedule";

  const success = dispatchSms(phone, carrier, message);

  if (success) {
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd hh:mm a");
    sheet.getRange(row, 12).setValue("📲 Reminder Sent: " + timestamp);
    SpreadsheetApp.getUi().alert("✓ SMS Reminder sent to " + contactName + " (" + phone + ")!");
  } else {
    SpreadsheetApp.getUi().alert("❌ Could not send SMS. Check phone number format.");
  }
}

/**
 * Sends Initial Booking Confirmation SMS for selected row
 */
function sendConfirmationToSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveCell().getRow();
  
  if (row < 5) {
    SpreadsheetApp.getUi().alert("Please select a booked resident row.");
    return;
  }

  const rowValues = sheet.getRange(row, 1, 1, 13).getValues()[0];
  const slotTime = rowValues[0];
  const residentName = rowValues[3];
  const contactName = rowValues[5] || "Family";
  const phone = rowValues[6];
  const carrier = rowValues[7];

  if (!residentName || !phone) {
    SpreadsheetApp.getUi().alert("Row " + row + " is missing Resident Name or Phone Number.");
    return;
  }

  const message = "🎄 Foursquare Healthcare: Holiday portrait confirmed for " + residentName + " at " + slotTime + "! Self-service reschedule link: https://foursquare-christmas-photoshoot.netlify.app/reschedule";

  const success = dispatchSms(phone, carrier, message);

  if (success) {
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd hh:mm a");
    sheet.getRange(row, 12).setValue("📲 Confirmation Sent: " + timestamp);
    SpreadsheetApp.getUi().alert("✓ Confirmation SMS sent to " + contactName + "!");
  }
}

/**
 * Batch Sends SMS Reminders to ALL Booked Rows on the active sheet
 */
function sendAllDayOfReminders() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 5) {
    SpreadsheetApp.getUi().alert("No bookings found on this sheet.");
    return;
  }

  const range = sheet.getRange(5, 1, lastRow - 4, 12);
  const values = range.getValues();
  let count = 0;

  for (let i = 0; i < values.length; i++) {
    const rowNum = 5 + i;
    const slotTime = values[i][0];
    const residentName = values[i][3];
    const contactName = values[i][5] || "Family";
    const phone = values[i][6];
    const carrier = values[i][7];
    const statusNote = String(values[i][11] || "");

    // Only send if phone exists, slot is booked, and hasn't already sent today
    if (residentName && phone && !statusNote.includes("Reminder Sent")) {
      const message = "🎄 Reminder: Your 10-min Christmas portrait session for " + residentName + " is today at " + slotTime + "! Need to change time? https://foursquare-christmas-photoshoot.netlify.app/reschedule";
      dispatchSms(phone, carrier, message);
      const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd hh:mm a");
      sheet.getRange(rowNum, 12).setValue("📲 Reminder Sent: " + timestamp);
      count++;
      Utilities.sleep(500); // 500ms delay to avoid rate limiting
    }
  }

  SpreadsheetApp.getUi().alert("🎉 Sent " + count + " SMS reminders across the facility roster!");
}
