import React, { useState } from "react";

export default function ProgressBar({ currentTime, duration, onSeek }) {
  const [previewTime, setPreviewTime] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleChange = (value) => {
    setPreviewTime(value);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    if (previewTime !== null) onSeek(previewTime);
    setIsDragging(false);
    setPreviewTime(null);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      {/* Progress Slider */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={isDragging && previewTime !== null ? previewTime : currentTime}
        onChange={(e) => handleChange(Number(e.target.value))}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        style={{
          width: "110%",
          height: "8px",
          borderRadius: "4px",
          cursor: "pointer",
          background: `linear-gradient(to right, #3b82f6 ${
            duration
              ? ((isDragging && previewTime !== null ? previewTime : currentTime) / duration) * 100
              : 0
          }%, #555 ${
            duration
              ? ((isDragging && previewTime !== null ? previewTime : currentTime) / duration) * 100
              : 0
          }%)`,
        }}
      />

      {/* Time Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          fontSize: "0.85rem",
          color: "white",
          marginTop: "4px",
        }}
      >
        <span>{formatTime(isDragging && previewTime !== null ? previewTime : currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
