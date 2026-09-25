import os
import json
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

SCRATCH_DIR = r"C:\Users\Corey\.gemini\antigravity-ide\brain\29e1a2b9-4cdd-4bc5-8a06-22aaf1b354e4\scratch"
SA_KEY_PATH = os.path.join(SCRATCH_DIR, "sa-key.json")

SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets"
]

creds = Credentials.from_service_account_file(SA_KEY_PATH, scopes=SCOPES)
drive = build("drive", "v3", credentials=creds)

res = drive.files().list(
    q="mimeType='application/vnd.google-apps.script' and trashed=false",
    fields="files(id, name, modifiedTime)"
).execute()

files = res.get("files", [])
print(f"Found {len(files)} Apps Script projects:")
for f in files:
    print(f"ID: {f['id']} | Name: {f['name']} | Modified: {f['modifiedTime']}")
