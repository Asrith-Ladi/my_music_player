import { useState, useEffect, useRef } from "react";

export default function SongList({ songs, currentIndex, onSelect, searchTerm, onSearch }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selection when search term changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Auto-scroll highlighted item into view
  useEffect(() => {
    if (listRef.current) {
      const activeItem = listRef.current.querySelector(".active-item");
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  // Highlight matched text
  const highlightMatch = (name, query) => {
    if (!query) return name;
    const regex = new RegExp(`(${query})`, "ig");
    return name.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            fontWeight: "bold",
            padding: "0 2px",
            borderRadius: "4px"
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const maxIndex = Math.min(songs.length, 7) - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    }
    if (e.key === "Enter" && songs.length > 0) {
      onSelect(selectedIndex);
      setShowResults(false);
    }
  };

  return (
    <div className="w-full mb-6 relative" ref={wrapperRef}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search songs..."
        className={`w-full py-3 px-4 mb-3 rounded-full border focus:outline-none focus:ring-2 text-base ${
          searchTerm
            ? "bg-green-100 border-green-400 focus:ring-green-500 text-black placeholder-gray-700"
            : "bg-transparent border-gray-300 focus:ring-green-400 text-black placeholder-black"
        }`}
        value={searchTerm}
        onChange={(e) => {
          onSearch(e.target.value);
          setShowResults(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowResults(true)}
      />

      {searchTerm.trim() && showResults ? (
        <ul
          ref={listRef}
          className="absolute w-full max-h-48 overflow-y-auto bg-white rounded-md border border-gray-300 shadow list-none z-50"
        >
          {songs.length === 0 ? (
            <li className="p-2 text-gray-400">No songs found.</li>
          ) : (
            songs
              .slice(0, 7) // Top 7 results
              .map((song, idx) => {
                // Clean filename
                let displayName = song.name;
                displayName = displayName.replace(/^\s*([\[\(]?\d+[\]\)]?\s*[-.]?\s*)+/, "");
                displayName = displayName.replace(/\s*-\s*SenSongsM?p?3\.[^.]+\.mp3$/i, "");
                displayName = displayName.replace(/\s*\[.*?SenSongsM?p?3\.[^\]]*\]\.mp3$/i, "");
                displayName = displayName.replace(/\s*-\s*SenSongsM?p?3\.[^.]+$/i, "");
                displayName = displayName.replace(/\.mp3$/i, "");
                displayName = displayName.trim();

                return (
                  <li
                    key={song.id}
                    className={[
                      "p-2 cursor-pointer transition-colors rounded-md border-b border-gray-300",
                      idx === currentIndex ? "bg-green-700 text-white font-bold" : "",
                      idx === songs.length - 1 ? "border-b-0" : "",
                      selectedIndex === idx ? "active-item bg-green-200" : "",
                      "hover:bg-gray-300 hover:text-black"
                    ].join(" ")}
                    style={{
                      backgroundColor: selectedIndex === idx ? "#bbf7d0" : "white",
                      color: "black"
                    }}
                    onClick={() => {
                      onSelect(idx);
                      setShowResults(false);
                    }}
                  >
                    {highlightMatch(displayName, searchTerm)}
                  </li>
                );
              })
          )}
        </ul>
      ) : null}
    </div>
  );
}
