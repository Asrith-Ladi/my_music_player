import React from "react";

export default function ModeToggle({ mode, setMode }) {
  const toggleMode = () => {
    setMode((prev) => (prev === "online" ? "offline" : "online"));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 100,
        background: "#131313cc",
        padding: "6px 14px",
        borderRadius: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: 600,
        cursor: "pointer",
      }}
      onClick={toggleMode}
    >
      <span
        style={{
          display: "inline-block",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: mode === "online" ? "#22c55e" : "#f97316",
        }}
      ></span>
      {mode === "online" ? "Online Mode" : "Offline mode Not Yet Developed"}
    </div>
  );
}
