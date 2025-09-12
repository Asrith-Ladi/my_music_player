import { Search, X } from "lucide-react";

export default function SearchModal({
  searchTerm,
  setSearchTerm,
  filteredSongs,
  handleSongSelect,
  closeModal,
  songs,
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        paddingTop: "20px",
        zIndex: 1000,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          backgroundColor: "white",
          color: "black",
          borderRadius: "12px",
          padding: "20px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
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

        {/* Search Box */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "30%",
              transform: "translateY(-50%)",
              color: "#999",
            }}
          />
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
        </div>

        {/* Scrollable Song List */}
        <ul
          style={{
            flex: 1,
            overflowY: "auto",
            margin: "0",
            padding: "0",
            listStyle: "none",
          }}
        >
          {filteredSongs.length === 0 ? (
            <li
              style={{
                padding: "12px",
                textAlign: "center",
                color: "#666",
              }}
            >
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
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#22c55e22")
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
