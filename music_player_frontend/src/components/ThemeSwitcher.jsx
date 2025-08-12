import React from "react";

const THEME_BUTTON_SIZE = 38;
const THEME_BUTTON_WIDTH = 80; // fixed width for both buttons
const THEME_BUTTON_GAP = 15;

function ThemeButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: THEME_BUTTON_WIDTH,
        height: THEME_BUTTON_SIZE,
        fontSize: 16,
        borderRadius: 9999,
        border: `2px solid ${active ? "#22c55e" : "#d1d5db"}`,
        background: active ? "#22c55e" : "#f3f4f6",
        color: active ? "#fff" : "#222",
        fontWeight: 600,
        boxShadow: active ? "0 2px 8px #22c55e44" : "none",
        transition: "all 0.2s",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {children}
    </button>
  );
}

export default function ThemeSwitcher({
  theme,
  setTheme,
  lightColor,
  setLightColor,
}) {
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
          background: theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
          borderRadius: 9999,
          padding: THEME_BUTTON_GAP / 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          gap: THEME_BUTTON_GAP,
        }}
      >
        {/* Light & Dark buttons with fixed width and gap */}
        <div style={{ display: "flex", gap: "6px" }}>
          <ThemeButton
            active={theme === "light"}
            onClick={() => setTheme("light")}
          >
            Light
          </ThemeButton>
          <ThemeButton
            active={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </ThemeButton>
        </div>

        {/* Light Theme Color Picker */}
        {theme === "light" && (
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
              height: THEME_BUTTON_SIZE,
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
        )}
      </div>
    </div>
  );
}
