import os
import json
import time
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

SCRATCH_DIR = r"C:\Users\Corey\.gemini\antigravity-ide\brain\29e1a2b9-4cdd-4bc5-8a06-22aaf1b354e4\scratch"
SA_KEY_PATH = os.path.join(SCRATCH_DIR, "sa-key.json")
SHEET_LINKS_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "sheet_links.json")

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

# Exact facility details matching user prompt
FACILITIES = {
    "hml": {
        "code": "hml",
        "abbr": "HML",
        "name": "Hillside Medical Lodge",
        "address": "300 S Highway 36 Byp N, Gatesville, TX 76528",
        "city": "Gatesville, TX",
        "shootDate": "Thursday, November 5, 2026",
        "loungeName": "Hillside Fireside Solarium",
    },
    "wnr": {
        "code": "wnr",
        "abbr": "WNR",
        "name": "Whitney Nursing & Rehabilitation",
        "address": "101 S San Marcos St, Whitney, TX 76692",
        "city": "Whitney, TX",
        "shootDate": "Friday, November 6, 2026",
        "loungeName": "Whitney Heritage Community Room",
    },
    "cml": {
        "code": "cml",
        "abbr": "CML",
        "name": "Cheyenne Medical Lodge",
        "address": "750 Hwy 352, Mesquite, TX 75149",
        "city": "Mesquite, TX",
        "shootDate": "Monday, November 9 & Tuesday, November 10, 2026",
        "loungeName": "Cheyenne Grand Prairie Staging Room",
    },
    "pml": {
        "code": "pml",
        "abbr": "PML",
        "name": "Princeton Medical Lodge",
        "address": "1401 W Princeton Dr, Princeton, TX 75407",
        "city": "Princeton, TX",
        "shootDate": "Thursday, November 12, 2026",
        "loungeName": "Princeton Courtyard Pavilion",
    },
    "fhr": {
        "code": "fhr",
        "abbr": "FHR",
        "name": "Farmersville Health & Rehabilitation",
        "address": "205 Beech St, Farmersville, TX 75442",
        "city": "Farmersville, TX",
        "shootDate": "Friday, November 13, 2026",
        "loungeName": "Farmersville Evergreen Great Room",
    },
    "lml": {
        "code": "lml",
        "abbr": "LML",
        "name": "Lexington Medical Lodge",
        "address": "2000 W Audie Murphy Pkwy, Farmersville, TX 75442",
        "city": "Farmersville, TX",
        "shootDate": "Tuesday, November 17, 2026",
        "loungeName": "Lexington Magnolia Activity Atrium",
    },
    "tray": {
        "code": "tray",
        "abbr": "T@PC",
        "name": "Traymore at Park Cities",
        "address": "4315 Hopkins Ave, Dallas, TX 75209",
        "city": "Dallas, TX",
        "shootDate": "Tuesday, November 24, 2026",
        "loungeName": "Traymore Highland Park Holiday Studio",
    },
    "mml": {
        "code": "mml",
        "abbr": "MML",
        "name": "Midland Medical Lodge",
        "address": "3000 Mockingbird, Midland, TX 79705",
        "city": "Midland, TX",
        "shootDate": "Monday, November 30, 2026",
        "loungeName": "Midland Rose Garden Recreation Room",
    },
    "mmr": {
        "code": "mmr",
        "abbr": "MMR",
        "name": "Madison Medical Resort",
        "address": "5001 Office Park, Odessa, TX 79762",
        "city": "Odessa, TX",
        "shootDate": "Tuesday, December 1, 2026",
        "loungeName": "Madison Grand Ballroom Staging Suite",
    },
    "aml": {
        "code": "aml",
        "abbr": "AML",
        "name": "Ashton Medical Lodge",
        "address": "801 S Loop 250 W, Midland, TX 79703",
        "city": "Midland, TX",
        "shootDate": "Wednesday, December 2, 2026",
        "loungeName": "Ashton Main Fireside Staging Lounge",
    },
    "sml": {
        "code": "sml",
        "abbr": "SML",
        "name": "Sheridan Medical Lodge",
        "address": "1119 S Red River Expy, Burkburnett, TX 76354",
        "city": "Burkburnett, TX",
        "shootDate": "Tuesday, December 8, 2026",
        "loungeName": "Sheridan Chisholm Trail Gathering Room",
    },
    "scwf": {
        "code": "scwf",
        "abbr": "SCWF",
        "name": "Senior Care Wichita Falls",
        "address": "910 Midwestern Pkwy, Wichita Falls, TX 76302",
        "city": "Wichita Falls, TX",
        "shootDate": "Wednesday, December 9, 2026",
        "loungeName": "Wichita Falls Red River Sunroom",
    },
    "cp": {
        "code": "cp",
        "abbr": "CP",
        "name": "Crown Point Health Suites",
        "address": "6640 Iola Ave, Lubbock, TX 79424",
        "city": "Lubbock, TX",
        "shootDate": "Thursday, December 10, 2026",
        "loungeName": "Crown Point Staging Lounge",
    }
}

# 5-Minute slots schedule structure with 10-minute resets and 1 hour lunch
SCHEDULE_ROWS = [
    # 10:00 AM block
    {"slot": "10:00 AM", "type": "slot"},
    {"slot": "10:05 AM", "type": "slot"},
    {"slot": "10:10 AM", "type": "slot"},
    {"slot": "10:15 AM", "type": "slot"},
    {"slot": "10:20 AM", "type": "slot"},
    {"slot": "10:25 AM", "type": "slot"},
    {"slot": "10:30 AM", "type": "slot"},
    {"slot": "10:35 AM", "type": "slot"},
    {"slot": "10:40 AM", "type": "slot"},
    {"slot": "10:45 AM", "type": "slot"},
    {"slot": "10:50 AM – 11:00 AM (10-Min Studio Reset Buffer)", "type": "buffer"},

    # 11:00 AM block
    {"slot": "11:00 AM", "type": "slot"},
    {"slot": "11:05 AM", "type": "slot"},
    {"slot": "11:10 AM", "type": "slot"},
    {"slot": "11:15 AM", "type": "slot"},
    {"slot": "11:20 AM", "type": "slot"},
    {"slot": "11:25 AM", "type": "slot"},
    {"slot": "11:30 AM", "type": "slot"},
    {"slot": "11:35 AM", "type": "slot"},
    {"slot": "11:40 AM", "type": "slot"},
    {"slot": "11:45 AM", "type": "slot"},
    {"slot": "11:50 AM – 12:00 PM (10-Min Studio Reset Buffer)", "type": "buffer"},

    # 12:00 PM block
    {"slot": "12:00 PM", "type": "slot"},
    {"slot": "12:05 PM", "type": "slot"},
    {"slot": "12:10 PM", "type": "slot"},
    {"slot": "12:15 PM", "type": "slot"},
    {"slot": "12:20 PM", "type": "slot"},
    {"slot": "12:25 PM", "type": "slot"},
    {"slot": "12:30 PM", "type": "slot"},
    {"slot": "12:35 PM", "type": "slot"},
    {"slot": "12:40 PM", "type": "slot"},
    {"slot": "12:45 PM", "type": "slot"},
    {"slot": "12:50 PM – 01:00 PM (10-Min Transition to Lunch)", "type": "buffer"},

    # Lunch Break
    {"slot": "01:00 PM – 02:00 PM (Photographer Lunch Break & Studio Reset)", "type": "break"},

    # 02:00 PM block
    {"slot": "02:00 PM", "type": "slot"},
    {"slot": "02:05 PM", "type": "slot"},
    {"slot": "02:10 PM", "type": "slot"},
    {"slot": "02:15 PM", "type": "slot"},
    {"slot": "02:20 PM", "type": "slot"},
    {"slot": "02:25 PM", "type": "slot"},
    {"slot": "02:30 PM", "type": "slot"},
    {"slot": "02:35 PM", "type": "slot"},
    {"slot": "02:40 PM", "type": "slot"},
    {"slot": "02:45 PM", "type": "slot"},
    {"slot": "02:50 PM – 03:00 PM (10-Min Studio Reset Buffer)", "type": "buffer"},

    # 03:00 PM block
    {"slot": "03:00 PM", "type": "slot"},
    {"slot": "03:05 PM", "type": "slot"},
    {"slot": "03:10 PM", "type": "slot"},
    {"slot": "03:15 PM", "type": "slot"},
    {"slot": "03:20 PM", "type": "slot"},
    {"slot": "03:25 PM", "type": "slot"},
    {"slot": "03:30 PM", "type": "slot"},
    {"slot": "03:35 PM", "type": "slot"},
    {"slot": "03:40 PM", "type": "slot"},
    {"slot": "03:45 PM", "type": "slot"},
    {"slot": "03:50 PM – 04:00 PM (10-Min Studio Reset Buffer)", "type": "buffer"},

    # 04:00 PM block
    {"slot": "04:00 PM", "type": "slot"},
    {"slot": "04:05 PM", "type": "slot"},
    {"slot": "04:10 PM", "type": "slot"},
    {"slot": "04:15 PM", "type": "slot"},
    {"slot": "04:20 PM", "type": "slot"},
    {"slot": "04:25 PM", "type": "slot"},
    {"slot": "04:30 PM", "type": "slot"},
    {"slot": "04:35 PM", "type": "slot"},
    {"slot": "04:40 PM", "type": "slot"},
    {"slot": "04:45 PM", "type": "slot"},
    {"slot": "04:50 PM – 05:00 PM (10-Min Studio Reset Buffer)", "type": "buffer"},

    # 05:00 PM block
    {"slot": "05:00 PM", "type": "slot"},
    {"slot": "05:05 PM", "type": "slot"},
    {"slot": "05:10 PM", "type": "slot"},
    {"slot": "05:15 PM", "type": "slot"},
    {"slot": "05:20 PM", "type": "slot"},
    {"slot": "05:25 PM", "type": "slot"},
    {"slot": "05:30 PM", "type": "slot"},
    {"slot": "05:35 PM", "type": "slot"},
    {"slot": "05:40 PM", "type": "slot"},
    {"slot": "05:45 PM", "type": "slot"},
    {"slot": "05:50 PM – 06:00 PM (10-Min Studio Reset Buffer)", "type": "buffer"},

    # 06:00 PM block
    {"slot": "06:00 PM", "type": "slot"},
    {"slot": "06:05 PM", "type": "slot"},
    {"slot": "06:10 PM", "type": "slot"},
    {"slot": "06:15 PM", "type": "slot"},
    {"slot": "06:20 PM", "type": "slot"},
    {"slot": "06:25 PM", "type": "slot"},
    {"slot": "06:30 PM", "type": "slot"},
    {"slot": "06:35 PM", "type": "slot"},
    {"slot": "06:40 PM", "type": "slot"},
    {"slot": "06:45 PM", "type": "slot"},
    {"slot": "06:50 PM – 07:00 PM (Day Wrap-Up & Pack-Down)", "type": "buffer"},
]

HEADERS = [
    "Slot Time",
    "Status",
    "Booking Ref",
    "Resident Name",
    "Room #",
    "Family Contact",
    "Phone Number",
    "Email Address",
    "Mobility & Posing Needs",
    "Staff Notes / Internal",
    "Self-Service Reschedule Link",
    "Check-In Timestamp"
]

def main():
    creds = Credentials.from_service_account_file(SA_KEY_PATH, scopes=SCOPES)
    sheets_service = build("sheets", "v4", credentials=creds)
    drive_service = build("drive", "v3", credentials=creds)

    with open(SHEET_LINKS_PATH, "r") as f:
        sheet_data = json.load(f)

    folder_id = "1uRdb99V71B6CBGmQhpmyJlIqesLkEWqc"

    # Process all facilities in sheet_links.json
    for code, fac in sheet_data["facilities"].items():
        sheet_id = fac["spreadsheetId"]
        fac_info = FACILITIES.get(code, fac)
        name = fac_info["name"]
        abbr = fac_info["abbr"]
        address = fac_info["address"]
        city = fac_info["city"]
        shoot_date = fac_info["shootDate"]
        lounge = fac_info.get("loungeName", "Activity Lounge")

        print(f"\n==========================================")
        print(f"Updating & Resetting: {name} ({abbr})")
        print(f"Address: {address} ({city})")
        print(f"Spreadsheet ID: {sheet_id}")

        # Build grid data
        values = []

        # Row 1: Main Banner
        values.append([f"🎄 FOURSQUARE HEALTHCARE 2026 CHRISTMAS PHOTO TOUR — {name.upper()} ({abbr})"])

        # Row 2: Subtitle with exact address & link
        portal_url = f"https://foursquare-christmas-photoshoot.netlify.app/{code}"
        values.append([f"📍 Address: {address} ({city})  |  📅 Date: {shoot_date}  |  🛋️ Lounge: {lounge}  |  🔗 Portal: {portal_url}"])

        # Row 3: Blank separator
        values.append([])

        # Row 4: Column Headers
        values.append(HEADERS)

        # Rows 5+: Clean 5-minute slots and reset buffers
        for item in SCHEDULE_ROWS:
            slot_text = item["slot"]
            item_type = item["type"]

            if item_type == "break":
                status = "BREAK"
                notes = "Photographer meal break & studio reset"
                reschedule = ""
            elif item_type == "buffer":
                status = "BUFFER"
                notes = "10-Minute Studio Lighting & Camera Calibration Reset"
                reschedule = ""
            else:
                status = "Open"
                notes = ""
                reschedule = "https://foursquare-christmas-photoshoot.netlify.app/reschedule"

            values.append([
                slot_text,
                status,
                "", # Booking Ref
                "", # Resident Name
                "", # Room #
                "", # Family Contact
                "", # Phone Number
                "", # Email Address
                "", # Mobility Needs
                notes, # Staff Notes
                reschedule, # Reschedule Link
                ""  # Check-In Timestamp
            ])

        # Clear existing data first
        try:
            sheets_service.spreadsheets().values().clear(
                spreadsheetId=sheet_id,
                range="A1:Z200"
            ).execute()

            # Write fresh values
            body = {
                "values": values
            }
            sheets_service.spreadsheets().values().update(
                spreadsheetId=sheet_id,
                range="A1",
                valueInputOption="USER_ENTERED",
                body=body
            ).execute()
            print(f"[SUCCESS] {abbr} reset successfully with {len(values)} rows (80 bookable 5-min slots + reset buffers).")
        except Exception as e:
            print(f"[ERROR] Failed updating {abbr}: {e}")

    print("\nAll facility spreadsheets have been updated with exact addresses and 100% reset for production!")

if __name__ == "__main__":
    main()
