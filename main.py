import streamlit as st

st.title("🎵 Streamlit Music Player")

# Dictionary of songs with friendly names and direct Google Drive links
songs = {
    "Song 1": "https://musicplayer12345.s3.amazonaws.com/Samayama.mp3",
}

selected_song = st.selectbox("Choose a song", list(songs.keys()))

audio_url = songs[selected_song]
st.audio(audio_url)
