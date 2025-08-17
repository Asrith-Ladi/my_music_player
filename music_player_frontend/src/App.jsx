// src/App.jsx
import { useState, useRef, useEffect } from "react";
import "./App.css";
import PlayerBar from "./components/PlayerBar";
import SongInfo from "./components/SongInfo";
import SearchSongList from "./components/SearchSongList";
import ThemeSwitcher from "./components/ThemeSwitcher";
import ThemeBackground from "./components/ThemeBg";
import ProgressBar from "./components/ProgressBar";
import ModeToggle from "./components/ModeToggle";

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
  const [mode, setMode] = useState("online");
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const audioRef = useRef(null);

  const darkGradient = "linear-gradient(135deg, #232526, #414345, #181818)";
  const lightGradient = `linear-gradient(135deg, #d1fae5, ${lightColor}, #6ee7b7)`;

  // Fetch songs whenever mode changes
  useEffect(() => {
    if (mode === "online") {
      fetch("https://asrith-music-player.onrender.com/songs")
        .then((res) => res.json())
        .then((data) => setSongs(data))
        .catch((err) => console.error("❌ Online fetch failed:", err));
    } else {
      setSongs([]); // placeholder until offline is finalized
    }
  }, [mode]);

  // Audio element events
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

  // Controls
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
      {/* Mode Toggle */}
      <ModeToggle mode={mode} setMode={setMode} />

      {/* Background */}
      <ThemeBackground
        theme={theme}
        darkGradient={darkGradient}
        lightGradient={lightGradient}
      />

      <div className="flex flex-col items-center justify-center w-full min-h-screen p-4">
        {/* Theme Switcher */}
        <ThemeSwitcher
          theme={theme}
          setTheme={setTheme}
          lightColor={lightColor}
          setLightColor={setLightColor}
        />

        <h1 className="text-3xl font-bold mb-4 text-center text-white mt-24">
          🎧 Asrith's Music Player
        </h1>

        {/* Search */}
        <SearchSongList
          songs={songs}
          currentIndex={currentIndex}
          onSelect={handleSongSelect}
        />

        {/* Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          onSeekStart={handleSeekStart}
          onSeekChange={handleSeekChange}
          onSeekEnd={handleSeekEnd}
        />

        {/* Song Info (no download here anymore) */}
        <SongInfo song={songs[currentIndex]} />

        {/* Audio Player */}
        <audio
          ref={audioRef}
          autoPlay
          src={
            songs[currentIndex]
              ? mode === "online"
                ? `https://asrith-music-player.onrender.com/stream/${songs[currentIndex]?.id}`
                : songs[currentIndex]?.blobUrl
              : undefined
          }
          onEnded={playNext}
        />

        {/* Player Controls */}
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
      </div>
    </>
  );
}
