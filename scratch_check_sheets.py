from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import json

key_path = r'C:\Users\Corey\.gemini\antigravity-ide\brain\29e1a2b9-4cdd-4bc5-8a06-22aaf1b354e4\scratch\sa-key.json'
creds = Credentials.from_service_account_file(key_path, scopes=['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'])
drive_service = build('drive', 'v3', credentials=creds)
sheets_service = build('sheets', 'v4', credentials=creds)

query = "'1uRdb99V71B6CBGmQhpmyJlIqesLkEWqc' in parents and trashed=false"
res = drive_service.files().list(q=query, fields='files(id, name, modifiedTime)').execute()
files = res.get('files', [])

print(f"Total files in folder: {len(files)}")
for f in sorted(files, key=lambda x: x.get('modifiedTime', ''), reverse=True):
    print(f"{f['modifiedTime']} | {f['name']} | ID: {f['id']}")
    # Read any recent values
    try:
        data = sheets_service.spreadsheets().values().get(spreadsheetId=f['id'], range='A5:L60').execute()
        for r_idx, r in enumerate(data.get('values', [])):
            if len(r) > 3 and r[3] and 'Harold' not in str(r[3]):
                print(f"   -> Entry on row {r_idx+5}: {r}")
    except Exception as e:
        print(f"   -> Error reading sheet: {e}")
