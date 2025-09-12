// src/App.jsx
import { useState, useRef, useEffect } from "react";
import "./App.css";
import PlayerBar from "./components/PlayerBar";
import SongInfo from "./components/SongInfo";
import SearchSongList from "./components/SearchSongList";
import ThemeSwitcher from "./components/ThemeSwitcher";
import ThemeBackground from "./components/ThemeBg";
import ProgressBar from "./components/ProgressBar";
import { Settings } from "lucide-react";
import SettingsMenu from "./components/SettingsMenu";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theme, setTheme] = useState("light");
  const [lightColor, setLightColor] = useState("#a7f3d0");
  const [shuffle, setShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [liked, setLiked] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [showTheme, setShowTheme] = useState(false);
  const audioRef = useRef(null);

  const darkGradient = "linear-gradient(135deg, #232526, #414345, #181818)";
  const lightGradient = `linear-gradient(135deg, #d1fae5, ${lightColor}, #6ee7b7)`;
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredSongs = songs.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  useEffect(() => {
    fetch("https://asrith-music-player.onrender.com/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("❌ Online fetch failed:", err));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoadedMetadata = () =>
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [currentIndex]);

  const playNext = () => {
    setCurrentIndex((prev) =>
      shuffle
        ? Math.floor(Math.random() * songs.length)
        : (prev + 1) % songs.length
    );
    setLiked(false);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const playPrevious = () => {
    setCurrentIndex((prev) =>
      shuffle
        ? Math.floor(Math.random() * songs.length)
        : (prev - 1 + songs.length) % songs.length
    );
    setLiked(false);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const handleSeek = (time) => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSeekStart = () => setIsSeeking(true);
  const handleSeekChange = (value) => setSeekValue(value);
  const handleSeekEnd = (value) => {
    setIsSeeking(false);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  useEffect(() => {
    if (!isSeeking) setSeekValue(currentTime);
  }, [currentTime, isSeeking]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play() : audio.pause();
  };

  const handleVolumeChange = (v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleLike = () => setLiked((l) => !l);

  const handleSongSelect = (index) => {
    if (index < 0 || index >= songs.length) return;
    setCurrentIndex(index);
    setLiked(false);
  };

  return (
    <>
      <ThemeBackground
        theme={theme}
        darkGradient={darkGradient}
        lightGradient={lightGradient}
      />
      <SearchSongList
        songs={songs}
        currentIndex={currentIndex}
        onSelect={handleSongSelect}
        style={{ marginTop: "20px", width: "100%", maxWidth: "600px" }}
        inputStyle={{ height: "36px", fontSize: "14px", padding: "0 10px", borderRadius: "8px" }}
      />


      {/* Fixed SettingsMenu at top-right */}
      <div style={{ position: "fixed", top: "20px", right: "16px", zIndex: 100 }}>
        <SettingsMenu
          theme={theme}
          setTheme={setTheme}
          lightColor={lightColor}
          setLightColor={setLightColor}
        />
      </div>


      {/* Theme options dropdown/modal */}
      {showTheme && (
        <div className="absolute top-20 right-8 z-50 bg-gray-900 rounded-lg shadow-lg p-4 flex flex-col items-center">
          <SettingsMenu
            theme={theme}
            setTheme={setTheme}
            lightColor={lightColor}
            setLightColor={setLightColor}
          />
        </div>
      )}

      <h1
        className="text-5xl font-bold mb-8 text-center mt-24"
        style={{
          color: "#fff",
          letterSpacing: "0.02em",
          textShadow: "0 2px 16px #000, 0 1px 0 #222",
          fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif",
          background: "linear-gradient(90deg, #232526 0%, #414345 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 900,
        }}
      >
        Music Box
      </h1>

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onSeekStart={handleSeekStart}
        onSeekChange={handleSeekChange}
        onSeekEnd={handleSeekEnd}
      />

      <SongInfo song={songs[currentIndex]} />

      <audio
        ref={audioRef}
        autoPlay
        src={
          songs.length > 0 && songs[currentIndex]
            ? `http://localhost:8000/stream/${songs[currentIndex]?.id}`
            : undefined
        }
        onEnded={playNext}
      />

      <PlayerBar
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={playNext}
        onPrev={playPrevious}
        onShuffle={() => setShuffle((s) => !s)}
        shuffle={shuffle}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        liked={liked}
        onLike={handleLike}
      />
    </>
  );
}
