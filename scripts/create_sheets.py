import os
import json
import time
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import gspread
from googleapiclient.discovery import build

SCRATCH_DIR = r"C:\Users\Corey\.gemini\antigravity-ide\brain\29e1a2b9-4cdd-4bc5-8a06-22aaf1b354e4\scratch"
ADC_PATH = r"C:\Users\Corey\AppData\Roaming\gcloud\application_default_credentials.json"
TOKEN_PATH = os.path.join(SCRATCH_DIR, "oauth_token.json")
OUTPUT_JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "sheet_links.json")

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

FACILITIES = [
    {
        "code": "hml",
        "abbr": "HML",
        "name": "Hillside Medical Lodge",
        "city": "Beeville, TX",
        "shootDate": "Thursday, November 5, 2026",
        "shortDate": "11/5",
        "dayOfWeek": "Thursday",
        "loungeName": "Hillside Fireside Solarium",
    },
    {
        "code": "wnr",
        "abbr": "WNR",
        "name": "Whitney Nursing & Rehabilitation",
        "city": "Whitney, TX",
        "shootDate": "Friday, November 6, 2026",
        "shortDate": "11/6",
        "dayOfWeek": "Friday",
        "loungeName": "Whitney Heritage Community Room",
    },
    {
        "code": "cml",
        "abbr": "CML",
        "name": "Cheyenne Medical Lodge",
        "city": "Colorado City, TX",
        "shootDate": "Monday, November 9 & Tuesday, November 10, 2026",
        "shortDate": "11/9 & 11/10",
        "dayOfWeek": "Monday & Tuesday (2-Day Session)",
        "dates": [
            {"label": "Day 1 (Nov 9)", "dateStr": "Monday, November 9, 2026", "shortDate": "11/9"},
            {"label": "Day 2 (Nov 10)", "dateStr": "Tuesday, November 10, 2026", "shortDate": "11/10"},
        ],
        "loungeName": "Cheyenne Grand Prairie Staging Room",
    },
    {
        "code": "pml",
        "abbr": "PML",
        "name": "Princeton Medical Lodge",
        "city": "Princeton, TX",
        "shootDate": "Thursday, November 12, 2026",
        "shortDate": "11/12",
        "dayOfWeek": "Thursday",
        "loungeName": "Princeton Courtyard Pavilion",
    },
    {
        "code": "fhr",
        "abbr": "FHR",
        "name": "Farmersville Health & Rehabilitation",
        "city": "Farmersville, TX",
        "shootDate": "Friday, November 13, 2026",
        "shortDate": "11/13",
        "dayOfWeek": "Friday",
        "loungeName": "Farmersville Evergreen Great Room",
    },
    {
        "code": "lml",
        "abbr": "LML",
        "name": "Lexington Medical Lodge",
        "city": "Farmersville, TX",
        "shootDate": "Tuesday, November 17, 2026",
        "shortDate": "11/17",
        "dayOfWeek": "Tuesday",
        "loungeName": "Lexington Magnolia Activity Atrium",
    },
    {
        "code": "tray",
        "abbr": "TRAY",
        "name": "Traymore at Park Cities",
        "city": "Dallas, TX",
        "shootDate": "Tuesday, November 24, 2026",
        "shortDate": "11/24",
        "dayOfWeek": "Tuesday",
        "loungeName": "Traymore Highland Park Holiday Studio",
    },
    {
        "code": "mml",
        "abbr": "MML",
        "name": "Midland Medical Lodge",
        "city": "Midland, TX",
        "shootDate": "Monday, November 30, 2026",
        "shortDate": "11/30",
        "dayOfWeek": "Monday",
        "loungeName": "Midland Rose Garden Recreation Room",
    },
    {
        "code": "mmr",
        "abbr": "MMR",
        "name": "Madison Medical Resort",
        "city": "Odessa, TX",
        "shootDate": "Tuesday, December 1, 2026",
        "shortDate": "12/1",
        "dayOfWeek": "Tuesday",
        "loungeName": "Madison Grand Ballroom Staging Suite",
    },
    {
        "code": "aml",
        "abbr": "AML",
        "name": "Ashton Medical Lodge",
        "city": "Midland, TX",
        "shootDate": "Wednesday, December 2, 2026",
        "shortDate": "12/2",
        "dayOfWeek": "Wednesday",
        "loungeName": "Ashton Main Fireside Staging Lounge",
    },
    {
        "code": "sml",
        "abbr": "SML",
        "name": "Sheridan Medical Lodge",
        "city": "Burleson, TX",
        "shootDate": "Tuesday, December 8, 2026",
        "shortDate": "12/8",
        "dayOfWeek": "Tuesday",
        "loungeName": "Sheridan Chisholm Trail Gathering Room",
    },
    {
        "code": "scwf",
        "abbr": "SCWF",
        "name": "Senior Care Wichita Falls",
        "city": "Wichita Falls, TX",
        "shootDate": "Wednesday, December 9, 2026",
        "shortDate": "12/9",
        "dayOfWeek": "Wednesday",
        "loungeName": "Wichita Falls Red River Sunroom",
    },
]

# Standard 10-minute slots schedule
MORNING_SLOTS = [
    '10:00 AM', '10:10 AM', '10:20 AM', '10:30 AM', '10:40 AM', '10:50 AM',
    '11:00 AM', '11:10 AM', '11:20 AM', '11:30 AM', '11:40 AM', '11:50 AM',
    '12:00 PM (LOCKED - Dept Head Picture)',
    '12:10 PM', '12:20 PM', '12:30 PM', '12:40 PM', '12:50 PM',
]
LUNCH_SLOT = ['01:00 PM - 01:45 PM (Photographer Lunch Break & Reset)']
AFTERNOON_SLOTS = [
    '01:45 PM', '01:55 PM',
    '02:05 PM', '02:15 PM', '02:25 PM', '02:35 PM', '02:45 PM', '02:55 PM',
    '03:05 PM', '03:15 PM', '03:25 PM', '03:35 PM', '03:45 PM', '03:55 PM',
    '04:05 PM', '04:15 PM', '04:25 PM', '04:35 PM', '04:45 PM', '04:55 PM',
    '05:05 PM', '05:15 PM', '05:25 PM', '05:35 PM', '05:45 PM', '05:55 PM',
    '06:05 PM', '06:15 PM', '06:25 PM', '06:35 PM', '06:45 PM', '06:55 PM',
]
ALL_SLOTS = MORNING_SLOTS + LUNCH_SLOT + AFTERNOON_SLOTS

HEADERS = [
    "Slot Time",
    "Status",
    "Booking Ref",
    "Resident Name",
    "Room #",
    "Family Contact",
    "Phone Number",
    "Email Address",
    "Mobility & Special Posing Needs",
    "Staff Notes / Internal",
    "Self-Service Reschedule Link",
    "Check-In Timestamp"
]

def get_credentials():
    creds = None
    if os.path.exists(TOKEN_PATH):
        try:
            creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
        except Exception as e:
            print(f"Error loading {TOKEN_PATH}: {e}")
            creds = None

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                print(f"Token refresh failed: {e}")
                creds = None

        if not creds:
            with open(ADC_PATH) as f:
                adc = json.load(f)

            client_config = {
                "installed": {
                    "client_id": adc["client_id"],
                    "client_secret": adc["client_secret"],
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": ["http://localhost"]
                }
            }
            flow = InstalledAppFlow.from_client_config(client_config, scopes=SCOPES)
            print("Opening browser for one-time Google OAuth authorization...", flush=True)
            creds = flow.run_local_server(port=0, open_browser=True)

            with open(TOKEN_PATH, "w") as token_file:
                token_file.write(creds.to_json())
            print(f"Saved OAuth token to {TOKEN_PATH}", flush=True)

    return creds

def format_worksheet(ws, facility, date_str):
    # Prepare rows
    rows = [
        [f"🎄 FOURSQUARE HEALTHCARE 2026 CHRISTMAS PHOTO TOUR — {facility['name'].upper()}"],
        [f"📍 Location: {facility['city']} | 📅 Shoot Date: {date_str} | 🛋️ Staging: {facility['loungeName']}"],
        [f"🔗 Live Portal: https://foursquare-christmas-photoshoot.netlify.app/{facility['code']} | 📞 Reception Desk Coordinator Live Sheet"],
        [], # blank line
        HEADERS
    ]

    for slot in ALL_SLOTS:
        is_locked_dept = "Dept Head Picture" in slot
        is_lunch = "Lunch Break" in slot
        status = "LOCKED" if is_locked_dept else ("BREAK" if is_lunch else "Open")
        notes = "Reserved for Dept Heads Group Portrait" if is_locked_dept else ("Photographer meal & studio lighting reset" if is_lunch else "")
        rows.append([
            slot,
            status,
            "", # Booking Ref
            "", # Resident Name
            "", # Room #
            "", # Family Contact
            "", # Phone
            "", # Email
            "", # Mobility
            notes, # Notes
            "", # Reschedule Link
            ""  # Check-in timestamp
        ])

    ws.update("A1", rows)

def create_facility_sheets():
    creds = get_credentials()
    gc = gspread.authorize(creds)
    drive_service = build("drive", "v3", credentials=creds)

    results = {}

    share_emails = ["jeremy@thinkments.com"]

    print(f"\n🚀 Creating Google Sheets for {len(FACILITIES)} Foursquare facilities...\n", flush=True)

    for idx, fac in enumerate(FACILITIES, 1):
        sheet_title = f"Foursquare Photo Tour 2026 - {fac['name']} ({fac['abbr']})"
        print(f"[{idx}/{len(FACILITIES)}] Creating '{sheet_title}'...", flush=True)

        # Create spreadsheet
        sh = gc.create(sheet_title)

        if "dates" in fac and len(fac["dates"]) > 1:
            # Multi-day facility (like CML)
            for d_idx, d in enumerate(fac["dates"]):
                if d_idx == 0:
                    ws = sh.sheet1
                    ws.update_title(d["label"])
                else:
                    ws = sh.add_worksheet(title=d["label"], rows=60, cols=15)
                format_worksheet(ws, fac, d["dateStr"])
        else:
            ws = sh.sheet1
            ws.update_title("Schedule & Roster")
            format_worksheet(ws, fac, fac["shootDate"])

        # Share spreadsheet with Jeremy
        for email in share_emails:
            try:
                sh.share(email, perm_type="user", role="writer", notify=False)
                print(f"   ✓ Shared with {email} (Writer)", flush=True)
            except Exception as e:
                print(f"   ⚠️ Share warning for {email}: {e}", flush=True)

        sheet_info = {
            "facilityCode": fac["code"],
            "facilityAbbr": fac["abbr"],
            "facilityName": fac["name"],
            "city": fac["city"],
            "shootDate": fac["shootDate"],
            "sheetTitle": sheet_title,
            "spreadsheetId": sh.id,
            "spreadsheetUrl": sh.url,
        }
        results[fac["code"]] = sheet_info
        print(f"   ✓ URL: {sh.url}\n", flush=True)
        time.sleep(1) # brief pause to respect rate limits

    # Save output JSON
    os.makedirs(os.path.dirname(OUTPUT_JSON_PATH), exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n✅ All {len(FACILITIES)} sheets created and saved to {OUTPUT_JSON_PATH}!", flush=True)

if __name__ == "__main__":
    create_facility_sheets()
