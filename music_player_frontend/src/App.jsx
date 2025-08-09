import { useEffect, useState, useRef } from "react";
import './App.css';

import PlayerBar from "./components/PlayerBar";
import SongInfo from "./components/SongInfo";
import SongList from "./components/SongList";

// Add Aptos font import (Google Fonts CDN)
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Aptos:wght@400;700&display=swap';
document.head.appendChild(fontLink);

// Format time as mm:ss
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

  // Theme gradients
  const darkGradient = 'linear-gradient(135deg, #232526 0%, #414345 50%, #181818 100%)';
  // Light theme color state and gradient
  const [lightColor, setLightColor] = useState('#a7f3d0');
  const lightGradient = `linear-gradient(135deg, #d1fae5 0%, ${lightColor} 50%, #6ee7b7 100%)`;
  const [shuffle, setShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);

  // Fetch songs from backend
  useEffect(() => {
    fetch("https://asrith-music-player.onrender.com/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Audio element event listeners
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

  // Player controls
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

  // Filter and select
  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSongSelect = (filteredIndex) => {
    // Find the actual index in the full songs array
    const songId = filteredSongs[filteredIndex]?.id;
    const realIndex = songs.findIndex((s) => s.id === songId);
    if (realIndex !== -1) {
      setCurrentIndex(realIndex);
      setLiked(false);
      setSearchTerm(""); // Clear search to close the list
    }
  };

  return (

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
      {/* Theme Toggle Top-Right */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex gap-2 items-center bg-white/80 dark:bg-black/80 rounded-full p-1 shadow-lg">
          <button
            className={`px-4 py-1 rounded-full font-semibold transition-colors border-2 ${theme === 'light' ? 'bg-green-400 text-white border-green-500 shadow' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-green-100'}`}
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
          >
            Light
          </button>
          <button
            className={`px-4 py-1 rounded-full font-semibold transition-colors border-2 ${theme === 'dark' ? 'bg-green-400 text-white border-green-500 shadow' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-green-100'}`}
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
          >
            Dark
          </button>
          {/* Color Picker for Light Theme */}
          {theme === 'light' && (
            <label className="flex items-center gap-1 ml-2 cursor-pointer">
              <span className="text-xs text-gray-700">Pick color:</span>
              <input
                type="color"
                value={lightColor}
                onChange={e => setLightColor(e.target.value)}
                className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
                title="Choose main light color"
              />
            </label>
          )}
        </div>
      </div>

      <div
        style={{
          display: "table-cell",
          verticalAlign: "middle",
          textAlign: "center"
        }}
      >
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
                {/* Progress Bar below search and song time numbers */}
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={e => {
                    const time = Number(e.target.value);
                    if (audioRef.current) {
                      audioRef.current.currentTime = time;
                    }
                  }}
                  className="w-full mt-2 mb-4 h-2 rounded-full cursor-pointer border border-black"
                  style={{
                    appearance: 'none',
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(duration ? (currentTime / duration) * 100 : 0)}%, #fff ${(duration ? (currentTime / duration) * 100 : 0)}%, #fff 100%)`,
                    outline: 'none',
                    borderRadius: '9999px',
                    height: '0.6rem',
                    border: '2px solid #000',
                  }}
                />
                <div className="flex justify-between text-xs text-gray-700 font-mono mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            <audio
              ref={audioRef}
              autoPlay
              src={songs[currentIndex] ? `https://asrith-music-player.onrender.com/stream/${songs[currentIndex]?.id}` : undefined}
              onEnded={handleSongEnd}
            />
            <div className="w-full flex flex-col items-center">
              <PlayerBar
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={playNext}
                onPrev={playPrevious}
                onShuffle={() => setShuffle((s) => !s)}
                shuffle={shuffle}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                volume={volume}
                onVolumeChange={handleVolumeChange}
                liked={liked}
                onLike={handleLike}
              />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          border: 3px solid #fff;
          box-shadow: 0 0 4px #3b82f6aa;
          margin-top: -4px;
          transition: box-shadow 0.2s;
        }
        input[type="range"]:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px #3b82f633;
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          border: 3px solid #fff;
          box-shadow: 0 0 4px #3b82f6aa;
          transition: box-shadow 0.2s;
        }
        input[type="range"]:focus::-moz-range-thumb {
          box-shadow: 0 0 0 4px #3b82f633;
        }
        input[type="range"]::-ms-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          border: 3px solid #fff;
          box-shadow: 0 0 4px #3b82f6aa;
          transition: box-shadow 0.2s;
        }
        input[type="range"]:focus::-ms-thumb {
          box-shadow: 0 0 0 4px #3b82f633;
        }
        input[type="range"]::-webkit-slider-thumb { box-shadow: 0 0 0 2px #3b82f6; }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 0.6rem;
          border-radius: 9999px;
        }
        input[type="range"]::-ms-fill-lower {
          background: #3b82f6;
          border-radius: 9999px;
        }
        input[type="range"]::-ms-fill-upper {
          background: #222;
          border-radius: 9999px;
        }
        input[type="range"]:focus { outline: none; }
      `}</style>
    </div>
  );
}

export default App;
