import React from "react";

const THEME_BUTTON_SIZE = 38;
const THEME_BUTTON_GAP = 14;

function ThemeButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: THEME_BUTTON_SIZE * 2.1,
        height: THEME_BUTTON_SIZE,
        fontSize: 16,
        borderRadius: 9999,
        border: `2px solid ${active ? '#22c55e' : '#d1d5db'}`,
        background: active ? '#22c55e' : '#f3f4f6',
        color: active ? '#fff' : '#222',
        fontWeight: 600,
        boxShadow: active ? '0 2px 8px #22c55e44' : 'none',
        transition: 'all 0.2s',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {children}
    </button>
  );
}

export default function ThemeSwitcher({ theme, setTheme, lightColor, setLightColor }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: THEME_BUTTON_GAP,
        right: THEME_BUTTON_GAP,
        zIndex: 50,
      }}
    >
      <div
        className="flex items-center bg-white/80 dark:bg-black/80 rounded-full p-1 shadow-lg"
        style={{ gap: THEME_BUTTON_GAP, padding: THEME_BUTTON_GAP / 2 }}
      >
        <ThemeButton active={theme === 'light'} onClick={() => setTheme('light')}>
          Light
        </ThemeButton>
        <ThemeButton active={theme === 'dark'} onClick={() => setTheme('dark')}>
          Dark
        </ThemeButton>

        {/* Light Theme Color Picker */}
        {theme === 'light' && (
          <button
            className="flex items-center gap-2 rounded-full font-semibold transition-colors border-2 bg-gray-200 text-gray-700 border-gray-300 hover:bg-green-100 shadow"
            style={{
              height: THEME_BUTTON_SIZE,
              fontSize: 16,
              borderRadius: 9999,
              padding: `0 ${THEME_BUTTON_SIZE / 2}px`,
              gap: 8,
            }}
          >
            <span className="text-xs">Theme Color</span>
            <input
              type="color"
              value={lightColor}
              onChange={e => setLightColor(e.target.value)}
              className="w-4 h-4 cursor-pointer"
              style={{
                height: THEME_BUTTON_SIZE - 10,
                width: THEME_BUTTON_SIZE - 10,
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
}
