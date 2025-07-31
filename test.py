import streamlit as st
import requests

file_id = "YOUR_FILE_ID"
drive_url = f"https://drive.google.com/uc?export=preview&id=17lBXnyq31rkyJPC38LpofpL2QbKqtcCa"

# Fetch file from Drive
response = requests.get(drive_url) #Downloaded the MP3 as raw binary data using requests.

if response.status_code == 200:
    st.audio(response.content)
else:
    st.error("Failed to load audio.")
