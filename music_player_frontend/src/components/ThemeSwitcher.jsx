import React from "react";

const THEME_BUTTON_SIZE = 40;
const THEME_BUTTON_GAP = 10;

export default function ThemeSwitcher({ lightColor, setLightColor }) {
  return (
    <div
      style={{
        position: "fixed",
        top: THEME_BUTTON_GAP,
        right: THEME_BUTTON_GAP,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.8)",
          borderRadius: 9999,
          padding: THEME_BUTTON_GAP / 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        {/* Custom Theme Color Picker */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: 9999,
            fontWeight: 600,
            border: "2px solid #d1d5db",
            background: "#e5e7eb",
            color: "#374151",
            padding: `0 ${THEME_BUTTON_SIZE / 2}px`,
            height: 30,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#d1fae5")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#e5e7eb")
          }
        >
          <span style={{ fontSize: "12px" }}>Theme Color</span>
          <input
            type="color"
            value={lightColor}
            onChange={(e) => setLightColor(e.target.value)}
            style={{
              height: THEME_BUTTON_SIZE - 10,
              width: THEME_BUTTON_SIZE - 10,
              cursor: "pointer",
              border: "none",
              background: "transparent",
            }}
          />
        </button>
      </div>
    </div>
  );
}
