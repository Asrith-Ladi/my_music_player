// src/utils/offlineStorage.js
import { openDB } from 'idb';

// Open IndexedDB
const DB_NAME = "asrith_music_player";
const STORE_NAME = "songs";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

// Save decrypted song into IndexedDB
export async function saveSong(id, name, blob) {
  const db = await getDB();
  await db.put(STORE_NAME, { id, name, blob });
}

// Get all saved songs
export async function getAllSongs() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

// Delete a song (optional)
export async function deleteSong(id) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
