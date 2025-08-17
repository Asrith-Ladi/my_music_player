// src/components/SearchSongList.jsx
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";

function SearchSongList({ songs, currentIndex, onSelect }) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Filter songs
  const filtered = songs.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  // Download helper
  async function downloadSong(song) {
    try {
      const response = await fetch(
        `https://asrith-music-player.onrender.com/stream/${song.id}`
      );
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${song.name}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert(`✅ ${song.name}.mp3 downloaded to Downloads folder`);
    } catch (err) {
      console.error("❌ Download failed:", err);
      alert("❌ Could not download song. Check console.");
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}>
      {/* Main Search Box - hides once overlay is open */}
      {!searchOpen && (
        <input
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          style={{
            width: "100%",
            padding: "6px 10px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            outline: "none",
            color: "#22c55e",
          }}
        />
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "300px",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "24px",
            padding: "15px",
            zIndex: 999,
            boxShadow: "4px 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Overlay Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2px",
            }}
          >
            {/* Search input inside overlay */}
            <input
              type="text"
              placeholder="Search songs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                color: "#22c55e",
                marginRight: "10px",
              }}
              autoFocus
            />
            {/* Close button */}
            <button
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
              }}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "14px",
                cursor: "pointer",
                color: "#888",
              }}
            >
              ✖
            </button>
          </div>

          {/* Song list */}
          <div
            style={{
              maxHeight: "280px",
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#ccc transparent",
            }}
          >
            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>No songs found</p>
            ) : (
              filtered.map((song) => (
                <div
                  key={song.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {/* Song Name */}
                  <span
                    onClick={() => {
                      onSelect(songs.indexOf(song));
                      setSearchOpen(false);
                      setQuery("");
                    }}
                    style={{
                      flex: 1,
                      marginRight: "10px",
                      color:
                        songs.indexOf(song) === currentIndex
                          ? "#22c55e"
                          : "#000",
                      fontWeight:
                        songs.indexOf(song) === currentIndex ? "bold" : "normal",
                    }}
                  >
                    {song.name}
                  </span>

                  {/* Download Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSong(song);
                    }}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#22c55e",
                    }}
                  >
                    <FaDownload size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchSongList;
