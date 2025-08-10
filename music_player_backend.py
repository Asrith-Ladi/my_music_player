from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from fastapi.responses import StreamingResponse
import io
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()

# Allow React frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
import os

# Constants

SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") 
# Put your service account file in the same folder
FOLDER_ID = os.getenv("FOLDER_ID")
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    return build("drive", "v3", credentials=creds)

def list_files_recursively(service, folder_id):
    all_files = []
    # Query for audio files directly inside the folder
    query_files = f"'{folder_id}' in parents and mimeType contains 'audio/' and trashed = false"
    results_files = service.files().list(q=query_files, fields="files(id, name)").execute()
    all_files.extend(results_files.get("files", []))
    
    # Query for subfolders inside the folder
    query_folders = f"'{folder_id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    results_folders = service.files().list(q=query_folders, fields="files(id)").execute()
    
    for folder in results_folders.get("files", []):
        subfolder_files = list_files_recursively(service, folder["id"])
        all_files.extend(subfolder_files)
        
    return all_files

# @app.get("/songs")
# def list_songs():
#     service = get_drive_service()
#     query = f"'{FOLDER_ID}' in parents and mimeType contains 'audio/'"
#     results = service.files().list(q=query, fields="files(id, name)").execute()
#     files = results.get("files", [])
#     return files
@app.get("/songs")
def list_songs():
    service = get_drive_service()
    all_songs = list_files_recursively(service, FOLDER_ID)
    return all_songs


@app.get("/stream/{file_id}")
def stream_file(file_id: str):
    service = get_drive_service()
    request = service.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        status, done = downloader.next_chunk()
    fh.seek(0)
    return StreamingResponse(fh, media_type="audio/mpeg")
