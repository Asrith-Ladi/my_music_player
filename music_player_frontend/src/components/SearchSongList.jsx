import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";

function SearchSongList({ songs, currentIndex, onSelect, hideSettings }) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = songs.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

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

      {searchOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            zIndex: 1000,
            overflowY: "auto",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search songs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "80%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                color: "#22c55e",
              }}
              autoFocus
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
              }}
              style={{
                marginLeft: "10px",
                border: "none",
                background: "transparent",
                fontSize: "24px",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              ✖
            </button>
          </div>

          <div>
            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", color: "#ccc" }}>No songs found</p>
            ) : (
              filtered.map((song) => (
                <div
                  key={song.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #444",
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#22c55e")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => {
                    onSelect(songs.indexOf(song));
                    setSearchOpen(false);
                    setQuery("");
                  }}
                >
                  <span style={{ flex: 1, marginRight: "10px" }}>
                    {song.name}
                  </span>
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
