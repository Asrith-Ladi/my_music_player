from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.auth.transport.requests import Request as GoogleAuthRequest
import os
import io
import requests
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()
app = FastAPI()

# Allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: set your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache directory
CACHE_DIR = "/tmp/song_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

FOLDER_ID = os.getenv("FOLDER_ID")


def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        os.getenv("GOOGLE_APPLICATION_CREDENTIALS"),
        scopes=["https://www.googleapis.com/auth/drive"]
    )
    if creds.expired:
        creds.refresh(GoogleAuthRequest())
    return build("drive", "v3", credentials=creds)


def list_files_recursively(service, folder_id):
    songs = []
    page_token = None
    while True:
        response = service.files().list(
            q=f"'{folder_id}' in parents and mimeType='audio/mpeg'",
            spaces="drive",
            fields="nextPageToken, files(id, name)",
            pageToken=page_token
        ).execute()
        for file in response.get("files", []):
            songs.append({"id": file["id"], "name": file["name"]})
        page_token = response.get("nextPageToken", None)
        if page_token is None:
            break
    return songs


@app.get("/songs")
def list_songs():
    service = get_drive_service()
    return list_files_recursively(service, FOLDER_ID)


def fast_stream_from_drive(file_id):
    """Streams directly from Drive (fast start) while saving to cache."""
    service = get_drive_service()
    file = service.files().get(fileId=file_id, fields="name").execute()
    download_url = f"https://www.googleapis.com/drive/v3/files/{file_id}?alt=media"

    headers = {"Authorization": f"Bearer {service._http.credentials.token}"}
    cache_path = os.path.join(CACHE_DIR, f"{file_id}.mp3")

    with requests.get(download_url, headers=headers, stream=True) as r:
        r.raise_for_status()
        with open(cache_path, "wb") as cache_file:
            for chunk in r.iter_content(chunk_size=1024 * 256):  # 256KB chunks
                if chunk:
                    cache_file.write(chunk)
                    yield chunk


@app.get("/stream/{file_id}")
def stream_song(file_id: str):
    try:
        cached_file_path = os.path.join(CACHE_DIR, f"{file_id}.mp3")

        # Serve from cache if exists
        if os.path.exists(cached_file_path):
            return StreamingResponse(open(cached_file_path, "rb"), media_type="audio/mpeg")

        # Otherwise stream from Google Drive instantly and cache
        return StreamingResponse(fast_stream_from_drive(file_id), media_type="audio/mpeg")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health_check():
    return {"status": "ok"}
