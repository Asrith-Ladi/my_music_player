import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000'; // Backend URL

export const getSongs = async () => {
  const res = await axios.get(`${API_BASE}/songs`);
  return res.data;
};

export const getSongStreamUrl = (fileId) => {
  return `${API_BASE}/stream/${fileId}`;
};
