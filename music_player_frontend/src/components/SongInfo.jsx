// src/components/SongInfo.jsx
import React from "react";

function SongInfo({ song }) {
  if (!song) return null;

  let displayName = song?.name || "No song selected";
  displayName = displayName.replace(/^\s*\d+\s*-\s*/, "");
  displayName = displayName.replace(/\s*-\s*SenSongsMp3\.Co\.mp3$/i, "");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", marginBottom: "12px" }}>
      <div style={{ flex: 1, minWidth: 10 }}>
        <h2
          style={{
            fontWeight: "bold",
            fontSize: "16px",
            margin: 0,
            color: "#111",
          }}
        >
          {displayName}
        </h2>
      </div>
    </div>
  );
}

export default SongInfo;
