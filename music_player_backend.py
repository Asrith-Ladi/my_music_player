from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google.oauth2 import service_account
from googleapiclient.discovery import build
from google.auth.transport.requests import Request as GoogleAuthRequest
import os
import requests
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Ensure logs folder exists
os.makedirs("logs", exist_ok=True)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s]: %(message)s",
    handlers=[
        logging.FileHandler("logs/app.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FOLDER_ID = os.getenv("FOLDER_ID")


def get_drive_service():
    logger.info("Initializing Google Drive service")
    creds = service_account.Credentials.from_service_account_file(
        os.getenv("GOOGLE_APPLICATION_CREDENTIALS"),
        scopes=["https://www.googleapis.com/auth/drive"]
    )
    if creds.expired:
        creds.refresh(GoogleAuthRequest())
    return build("drive", "v3", credentials=creds)


def list_files_recursively(service, folder_id, depth=0):
    logger.info(f"{'  ' * depth}Listing folder id: {folder_id}")

    songs = []
    page_token = None
    while True:
        response = service.files().list(
            q=f"'{folder_id}' in parents",
            spaces="drive",
            fields="nextPageToken, files(id, name, mimeType)",
            pageToken=page_token
        ).execute()

        for file in response.get("files", []):
            logger.info(f"{'  ' * depth}Found: {file['name']} (MIME: {file['mimeType']})")

            if file["mimeType"] == "audio/mpeg":
                logger.info(f"{'  ' * depth}Adding song: {file['name']}")
                songs.append({"id": file["id"], "name": file["name"]})
            elif file["mimeType"] == "application/vnd.google-apps.folder":
                logger.info(f"{'  ' * depth}Found subfolder: {file['name']} - Recursing...")
                songs.extend(list_files_recursively(service, file["id"], depth + 1))

        page_token = response.get("nextPageToken", None)
        if page_token is None:
            break

    return songs


@app.get("/songs")
def list_songs():
    try:
        service = get_drive_service()
        songs = list_files_recursively(service, FOLDER_ID)
        logger.info(f"Total songs found: {len(songs)}")
        return songs
    except Exception as e:
        logger.error(f"Error listing songs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def fast_stream_from_drive(file_id):
    logger.info(f"Streaming file {file_id}")
    download_url = f"https://www.googleapis.com/drive/v3/files/{file_id}?alt=media"
    service = get_drive_service()
    headers = {"Authorization": f"Bearer {service._http.credentials.token}"}

    with requests.get(download_url, headers=headers, stream=True) as r:
        r.raise_for_status()
        for chunk in r.iter_content(chunk_size=1024 * 32):
            if chunk:
                yield chunk


@app.get("/stream/{file_id}")
def stream_song(file_id: str):
    try:
        return StreamingResponse(
            fast_stream_from_drive(file_id),
            media_type="audio/mpeg"
        )
    except Exception as e:
        logger.error(f"Error streaming file {file_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health_check():
    return {"status": "ok"}
