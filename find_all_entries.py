from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

key_path = r'C:\Users\Corey\.gemini\antigravity-ide\brain\29e1a2b9-4cdd-4bc5-8a06-22aaf1b354e4\scratch\sa-key.json'
creds = Credentials.from_service_account_file(key_path, scopes=['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'])
sheets_service = build('sheets', 'v4', credentials=creds)
drive_service = build('drive', 'v3', credentials=creds)

query = "'1uRdb99V71B6CBGmQhpmyJlIqesLkEWqc' in parents and trashed=false"
res = drive_service.files().list(q=query, fields='files(id, name, modifiedTime)').execute()
files = res.get('files', [])

for f in files:
    try:
        data = sheets_service.spreadsheets().values().get(spreadsheetId=f['id'], range='A5:L100').execute()
        rows = data.get('values', [])
        for r_idx, r in enumerate(rows):
            if len(r) > 3 and r[3]:
                clean_r = [str(x).encode('ascii', 'replace').decode('ascii') for x in r]
                print(f"[{f['name']}] Row {r_idx+5}: {clean_r}")
    except Exception as e:
        pass
