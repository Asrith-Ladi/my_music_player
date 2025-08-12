import React from "react";

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function ProgressBar({ currentTime, duration, onSeek }) {
  return (
    <div
      style={{
        width: "90%",       // Flexible but wide
        maxWidth: "800px",  // Limit for large screens
        marginTop: "2rem",
      }}
    >
      {/* Slider */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        style={{
          width: "100%",
          height: "8px",
          borderRadius: "9999px",
          cursor: "pointer",
          appearance: "none",
          background: `linear-gradient(to right, #3b82f6 ${
            duration ? (currentTime / duration) * 100 : 0
          }%, #555 ${duration ? (currentTime / duration) * 100 : 0}%)`,
        }}
      />

      {/* Times */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "6px",
          fontSize: "0.85rem",
          color: "#fff",
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
