import streamlit as st
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io
import random

# Streamlit UI setup
st.set_page_config(page_title="🎵 Stream Songs from Google Drive")
st.title("🎧 My Music Player")

# Constants
SERVICE_ACCOUNT_FILE = 'my-music-player-467716-54b3c3286bf3.json'
FOLDER_ID = '1W-195_2RqErcF_7XS0dFKC-BFl5oJ1K2'
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']

# Authenticate Drive service
@st.cache_resource
def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)
    return service

# Fetch audio files from Drive folder
@st.cache_data
def fetch_audio_files(_service, folder_id):
    query = f"'{folder_id}' in parents and mimeType contains 'audio/'"
    results = _service.files().list(q=query, fields="files(id, name, mimeType, size)").execute()
    return results.get('files', [])

# Download and stream the selected file
def download_audio_file(service, file_id):
    request = service.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        status, done = downloader.next_chunk()
    fh.seek(0)
    return fh

# Main
try:
    service = get_drive_service()
    files = fetch_audio_files(service, FOLDER_ID)

    if not files:
        st.warning("No audio files found in the folder.")
    else:
        # 🔍 Search bar
        search_term = st.text_input("🔍 Search by song name").lower()
        filtered_files = [f for f in files if search_term in f['name'].lower()] if search_term else files

        # 🎲 Shuffle option
        shuffle = st.checkbox("🔀 Shuffle songs")
        if shuffle:
            random.shuffle(filtered_files)

        # Initialize session state for song index
        if "song_index" not in st.session_state:
            st.session_state.song_index = 0

        # Handle navigation
        if st.button("⏭️ Next"):
            st.session_state.song_index += 1
            if st.session_state.song_index >= len(filtered_files):
                st.session_state.song_index = 0

        if st.button("⏮️ Previous"):
            st.session_state.song_index -= 1
            if st.session_state.song_index < 0:
                st.session_state.song_index = len(filtered_files) - 1

        # Select current song
        current_index = st.session_state.song_index
        selected_file = filtered_files[current_index]
        file_id = selected_file['id']
        file_name = selected_file['name']

        st.markdown(f"**Now Playing:** 🎵 `{file_name}`")

        # 🎼 Show metadata
        st.markdown(f"**MIME Type:** {selected_file['mimeType']}")
        if 'size' in selected_file:
            size_mb = round(int(selected_file['size']) / (1024 * 1024), 2)
            st.markdown(f"**Size:** {size_mb} MB")

        # ▶️ Play audio
        file_bytes = download_audio_file(service, file_id)
        st.audio(file_bytes, format="audio/mpeg")
        st.write("""విశ్వం విష్ణుర్వశట్‌కారో
            భూతభవ్యభవత్త్ప్రభుః।
            భూతకృద్భూతభృన్నాథో
            భూతాత్మా భూతభావనః॥""")

except Exception as e:
    st.error(f"Something went wrong: {e}")


# ✅ Next / Previous song navigation

# ✅ Keeps track of current song in session

# ✅ Still supports search and shuffle

# ❌ Limitation:
# We still can’t auto-play next song without:

# Custom frontend with JavaScript

# Streamlit Components or HTML+JS hacks