import { useEffect, useState, useRef } from "react";
import PlayerBar from "./components/PlayerBar";
import SongInfo from "./components/SongInfo";
import SongList from "./components/SongList";
import './App.css';

const THEME_BUTTON_SIZE = 38;
const THEME_BUTTON_GAP = 14;

function ThemeButton({ active, onClick, children, width = THEME_BUTTON_SIZE * 2.1, height = THEME_BUTTON_SIZE, fontSize = 16, style = {} }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        width,
        height,
        fontSize,
        margin: 0,
        borderRadius: 9999,
        border: `2px solid ${active ? '#22c55e' : '#d1d5db'}`,
        background: active ? '#22c55e' : '#f3f4f6',
        color: active ? '#fff' : '#222',
        fontWeight: 600,
        boxShadow: active ? '0 2px 8px #22c55e44' : 'none',
        transition: 'all 0.2s',
        cursor: 'pointer',
        outline: 'none',
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Add Aptos font import (Google Fonts CDN)
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Aptos:wght@400;700&display=swap';
document.head.appendChild(fontLink);

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function App() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [lightColor, setLightColor] = useState('#a7f3d0');
  const [shuffle, setShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);

  const darkGradient = 'linear-gradient(135deg, #232526 0%, #414345 50%, #181818 100%)';
  const lightGradient = `linear-gradient(135deg, #d1fae5 0%, ${lightColor} 50%, #6ee7b7 100%)`;

  useEffect(() => {
    fetch("https://asrith-music-player.onrender.com/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const setTotalDuration = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolume = () => setVolume(audio.volume);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setTotalDuration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("volumechange", onVolume);
    audio.volume = volume;
    audio.play().catch(() => {});
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setTotalDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("volumechange", onVolume);
    };
    // eslint-disable-next-line
  }, [currentIndex, volume]);

  const playNext = () => {
    setCurrentIndex((prev) => {
      if (shuffle) return Math.floor(Math.random() * songs.length);
      return prev + 1 < songs.length ? prev + 1 : 0;
    });
    setLiked(false);
  };
  const playPrevious = () => {
    setCurrentIndex((prev) => {
      if (shuffle) return Math.floor(Math.random() * songs.length);
      return prev - 1 >= 0 ? prev - 1 : songs.length - 1;
    });
    setLiked(false);
  };
  const handleSongEnd = () => playNext();
  const handleSeek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  };
  const handleVolumeChange = (v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };
  const handleLike = () => setLiked((l) => !l);

  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSongSelect = (filteredIndex) => {
    const songId = filteredSongs[filteredIndex]?.id;
    const realIndex = songs.findIndex((s) => s.id === songId);
    if (realIndex !== -1) {
      setCurrentIndex(realIndex);
      setLiked(false);
      setSearchTerm("");
    }
  };

  return (
    <>
      <div>
        {/* Theme Toggle Top-Right */}
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
            <ThemeButton
              active={theme === 'light'}
              onClick={() => setTheme('light')}
              style={{}}
            >
              Light
            </ThemeButton>
            <ThemeButton
              active={theme === 'dark'}
              onClick={() => setTheme('dark')}
              style={{}}
            >
              Dark
            </ThemeButton>
            {theme === 'light' && (
              <button
                className="flex items-center gap-2 rounded-full font-semibold transition-colors border-2 bg-gray-200 text-gray-700 border-gray-300 hover:bg-green-100 shadow"
                style={{
                  minWidth: 0,
                  alignItems: 'center',
                  display: 'inline-flex',
                  height: THEME_BUTTON_SIZE,
                  fontSize: 16,
                  borderRadius: 9999,
                  padding: `0 ${THEME_BUTTON_SIZE / 2}px`,
                  gap: 8,
                }}
                title="Pick theme color"
                tabIndex={0}
              >
                <span className="text-xs" style={{ lineHeight: '1.5rem' }}>Theme Color</span>
                <input
                  type="color"
                  value={lightColor}
                  onChange={e => setLightColor(e.target.value)}
                  className="w-4 h-4 p-0 border-0 bg-transparent cursor-pointer"
                  style={{ minWidth: 0, marginTop: '2px', height: THEME_BUTTON_SIZE - 10, width: THEME_BUTTON_SIZE - 10 }}
                  title="Choose theme color"
                />
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            display: "table",
            position: "absolute",
            height: "99%",
            width: "99%",
            top: 0,
            left: 0,
            background: theme === 'dark' ? darkGradient : lightGradient,
            transition: 'background 0.5s',
            fontFamily: 'Aptos, Arial, sans-serif',
          }}
        >
          <div
            style={{
              display: "table-cell",
              verticalAlign: "middle",
              textAlign: "center"
            }}
          >
            <div className="searchbar-container">
              <div className="searchbar-inner">
                <input
                  type="text"
                  placeholder="Search songs..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="searchbar-input"
                />
                <span className="searchbar-icon">
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/></svg>
                </span>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="searchbar-clear"
                    tabIndex={-1}
                    aria-label="Clear search"
                  >
                    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd"/></svg>
                  </button>
                )}
              </div>
            </div>
            <style>{`
              .searchbar-container {
                width: 100vw;
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
                margin-top: 8px;
              }
              .searchbar-inner {
                position: relative;
                width: 96vw;
                max-width: 420px;
              }
              .searchbar-input {
                width: 100%;
                height: 44px;
                border-radius: 9999px;
                border: 2px solid #d1d5db;
                font-size: 16px;
                padding-left: 48px;
                padding-right: 44px;
                background: #f3f4f6;
                color: #222;
                font-weight: 600;
                outline: none;
                box-shadow: 0 2px 8px #0001;
                transition: border 0.2s;
              }
              .searchbar-icon {
                position: absolute;
                left: 18px;
                top: 50%;
                transform: translateY(-50%);
                color: #888;
                font-size: 20px;
                pointer-events: none;
              }
              .searchbar-clear {
                position: absolute;
                right: 14px;
                top: 50%;
                transform: translateY(-50%);
                color: #888;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
              }
              @media (max-width: 600px) {
                .searchbar-inner {
                  max-width: 99vw;
                  min-width: 0;
                }
                .searchbar-input {
                  height: 40px;
                  font-size: 15px;
                  padding-left: 44px;
                  padding-right: 40px;
                }
              }
            `}</style>
            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6 sm:mb-8 text-center w-full"
              style={{
                WebkitTextStroke: '2px #111',
                textStroke: '2px #111',
                fontFamily: 'Aptos, Arial, sans-serif',
                letterSpacing: '0.01em',
                textShadow: '0 2px 8px rgba(0,0,0,0.18)',
                color: '#111',
              }}
            >
              <span className="align-middle mr-2">🎧</span>Asrith's Music Player
            </h1>
            <div className="flex flex-col items-center w-full">
              <SongInfo song={songs[currentIndex]} stroke />
              <div className="w-full flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <div className="w-[60%] min-w-[200px] max-w-[500px] mx-auto">
                    <SongList
                      songs={filteredSongs}
                      currentIndex={currentIndex}
                      onSelect={handleSongSelect}
                      searchTerm={searchTerm}
                      onSearch={setSearchTerm}
                    />
                    <input
                      type="range"
                      min={0}
                      max={songs.length - 1}
                      value={currentIndex}
                      onChange={e => handleSongSelect(Number(e.target.value))}
                      className="w-full mt-4"
                      style={{ accentColor: theme === 'dark' ? '#fff' : lightColor }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
