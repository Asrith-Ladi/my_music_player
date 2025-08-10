import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchSongList({ songs, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredSongs = songs
    .filter((song) =>
      song.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
    /*.slice(0, 10); /*limit results to 10 for performance*/

  const cleanName = (name) => {
    let displayName = name;
    displayName = displayName.replace(/^\s*([\[\(]?\d+[\]\)]?\s*[-.]?\s*)+/, "");
    displayName = displayName.replace(/\s*-\s*SenSongsM?p?3\.[^.]+\.mp3$/i, "");
    displayName = displayName.replace(/\s*\[.*?SenSongsM?p?3\.[^\]]*\]\.mp3$/i, "");
    displayName = displayName.replace(/\.mp3$/i, "");
    return displayName.trim();
  };

  const highlightMatch = (name, term) => {
    if (!term) return name;
    const regex = new RegExp(`(${term})`, "gi");
    const parts = name.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            backgroundColor: "#666", // dark grey highlight
            color: "white",
            padding: "0 3px",
            borderRadius: "3px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Close modal on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  const handleKeyDown = (e) => {
    if (!isModalOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % filteredSongs.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i - 1 + filteredSongs.length) % filteredSongs.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredSongs.length) {
        onSelect(highlightedIndex);
        setIsModalOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    }
  };

  return (
    <>
      {/* Small search bar fixed top center */}
      <div
        onClick={() => setIsModalOpen(true)}
        style={{
          position: "fixed",
          top: "70px",
          left: "50%",
          width: "280px",
          maxWidth: "90vw",
          transform: "translateX(-140px)",
          zIndex: 1000,
          backgroundColor: "white",
          borderRadius: "30px",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          cursor: "text",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          userSelect: "none",
        }}
        aria-label="Open search modal"
      >
        <FaSearch style={{ color: "#555", marginRight: "12px" }} size={18} />
        <span style={{ color: "#000", flexGrow: 1, textAlign: "center", userSelect: "none" }}>
          Search songs...
        </span>
      </div>

      {/* Modal overlay */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1500,
            display: "flex",
            justifyContent: "center",
            paddingTop: "0px",
            boxSizing: "border-box",
          }}
        >
          <div
            ref={modalRef}
            style={{
              width: "320px",
              maxWidth: "90vw",
              backgroundColor: "black",
              borderRadius: "24px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.7)",
              padding: "20px",
              color: "white",
              fontFamily: "Arial, sans-serif",
              outline: "none",
            }}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                borderRadius: "30px",
                border: "2px solid #22c55e",
                backgroundColor: "white",
                marginBottom: "12px",
              }}
            >
              <FaSearch style={{ color: "#555", marginRight: "1px" }} size={18} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                aria-label="Search songs"
                autoComplete="off"
                style={{
                  flexGrow: 1,
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  color: "black",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  type="button"
                  style={{
                    marginLeft: "12px",
                    border: "none",
                    background: "none",
                    color: "#555",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "18px",
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results */}
            <ul
              style={{
                maxHeight: "500px",
                overflowY: "auto",
                borderRadius: "24px 24px 24px 24px",
                borderTop: "none",
                border: "2px solid white",
                backgroundColor: "black",
                color: "white",
                listStyle: "none",
                padding: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                margin: 0,
              }}
              role="listbox"
            >
              {filteredSongs.length === 0 ? (
                <li
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    borderBottom: "1px solid white",
                    userSelect: "none",
                    fontSize: "14px",
                  }}
                >
                  No songs found.
                </li>
              ) : (
                filteredSongs.map((song, idx) => {
                  const displayName = cleanName(song.name);
                  const isHighlighted = idx === highlightedIndex;
                  return (
                    <li
                      key={song.id}
                      onMouseDown={() => {
                        onSelect(idx);
                        setIsModalOpen(false);
                        setSearchTerm("");
                        setHighlightedIndex(-1);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      role="option"
                      aria-selected={isHighlighted}
                      style={{
                        padding: "12px",
                        cursor: "pointer",
                        textAlign: "center",
                        borderBottom: idx !== filteredSongs.length - 1 ? "1px solid white" : "none",
                        backgroundColor: isHighlighted ? "#444" : "transparent",
                        fontWeight: isHighlighted ? "600" : "normal",
                        transition: "background-color 0.2s ease",
                        userSelect: "none",
                      }}
                    >
                      {highlightMatch(displayName, debouncedSearchTerm)}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
