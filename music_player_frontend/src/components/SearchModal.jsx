import React from "react";
import { Search, X, Mic } from "lucide-react";

export default function SearchModal({
  searchTerm,
  setSearchTerm,
  filteredSongs,
  handleSongSelect,
  closeModal,
  songs,
  startVoiceSearch,
  listening,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        paddingTop: "40px",
        zIndex: 100,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: "12px",
          padding: "16px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "calc(100vh - 80px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Centered Close Button */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <button
            onClick={closeModal}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            title="Close"
          >
            <X size={24} color="#333" />
          </button>
        </div>

        {/* Search Box with Voice Search */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          {Search ? (
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
              }}
            />
          ) : (
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
                fontSize: "16px",
              }}
            >
              🔍
            </span>
          )}

          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
            }}
            autoFocus
          />

          <button
            onClick={startVoiceSearch}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            title="Voice Search"
          >
            <Mic size={20} color={listening ? "red" : "gray"} />
          </button>
        </div>

        {/* Scrollable Song List */}
        <ul
          style={{
            maxHeight: "calc(100vh - 200px)", // Fill rest of screen
            overflowY: "auto",
            margin: "0",
            padding: "0",
            listStyle: "none",
          }}
        >
          {filteredSongs.length === 0 ? (
            <li style={{ padding: "12px", textAlign: "center", color: "#666" }}>
              No songs found
            </li>
          ) : (
            filteredSongs.map((song) => (
              <li
                key={song.id}
                onClick={() => handleSongSelect(songs.indexOf(song))}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  backgroundColor: "#f9f9f9",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e5f3ff")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9f9f9")
                }
              >
                {song.name}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
