import os
import json
from google.oauth2.service_account import Credentials
from google.oauth2.credentials import Credentials as UserCredentials
from googleapiclient.discovery import build

SCRATCH_DIR = r"C:\Users\Corey\.gemini\antigravity-ide\brain\29e1a2b9-4cdd-4bc5-8a06-22aaf1b354e4\scratch"
SA_KEY_PATH = os.path.join(SCRATCH_DIR, "sa-key.json")
TOKEN_PATH = os.path.join(SCRATCH_DIR, "oauth_token.json")
SHEET_LINKS_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "sheet_links.json")

SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets"
]

def get_drive_service():
    if os.path.exists(SA_KEY_PATH):
        try:
            creds = Credentials.from_service_account_file(SA_KEY_PATH, scopes=SCOPES)
            return build("drive", "v3", credentials=creds)
        except Exception as e:
            print(f"Service account load failed: {e}")
            
    if os.path.exists(TOKEN_PATH):
        try:
            creds = UserCredentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
            return build("drive", "v3", credentials=creds)
        except Exception as e:
            print(f"User token load failed: {e}")
            
    raise RuntimeError("No valid credentials found.")

def share_with_email(target_email, role="writer"):
    drive = get_drive_service()
    
    with open(SHEET_LINKS_PATH, "r") as f:
        data = json.load(f)
        
    folder_id = "1uRdb99V71B6CBGmQhpmyJlIqesLkEWqc"
    files_to_share = [("Tour Google Drive Folder", folder_id)]
    
    for code, fac in data["facilities"].items():
        files_to_share.append((f"{fac['name']} ({fac['abbr']})", fac["spreadsheetId"]))
        
    print(f"\nAdding '{target_email}' as {role.upper()} to {len(files_to_share)} items...\n")
    
    for name, file_id in files_to_share:
        try:
            body = {
                "type": "user",
                "role": role,
                "emailAddress": target_email
            }
            res = drive.permissions().create(
                fileId=file_id,
                body=body,
                fields="id,emailAddress,role",
                sendNotificationEmail=True
            ).execute()
            print(f"[SUCCESS] Shared: {name} (Permission ID: {res.get('id')})")
        except Exception as e:
            print(f"[ERROR] Error sharing {name} ({file_id}): {e}")

if __name__ == "__main__":
    share_with_email("nweatherford@fshc.com", "writer")
