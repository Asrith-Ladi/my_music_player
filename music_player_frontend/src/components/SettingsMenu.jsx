import React, { useState, useEffect, useRef } from "react";
import { Settings } from "lucide-react"; // Gear icon
import ThemeSwitcher from "./ThemeSwitcher";

export default function SettingsMenu({ theme, setTheme, lightColor, setLightColor }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "fixed", top: "5px", right: "1px", zIndex: 30 }}>
      <button
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => setOpen((v) => !v)}
        title="Theme Settings"
      >
        <Settings color="#000" size={24} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "0",
            background: "#fff",
            padding: "12px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <ThemeSwitcher
            theme={theme}
            setTheme={setTheme}
            lightColor={lightColor}
            setLightColor={setLightColor}
          />
        </div>
      )}
    </div>
  );
}


