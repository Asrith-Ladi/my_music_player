import { useState, useRef, useEffect } from "react";
import "./App.css";
import PlayerBar from "./components/PlayerBar";
import SongInfo from "./components/SongInfo";
import SearchSongList from "./components/SearchSongList";
import ThemeSwitcher from "./components/ThemeSwitcher";
import ThemeBackground from "./components/ThemeBg";
import ProgressBar from "./components/ProgressBar";

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function App() {
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
  const audioRef = useRef(null);

  // Background gradients
  const darkGradient = "linear-gradient(135deg, #232526, #414345, #181818)";
  const lightGradient = `linear-gradient(135deg, #d1fae5, ${lightColor}, #6ee7b7)`;

  // Fetch songs
  useEffect(() => {
    fetch("https://asrith-music-player.onrender.com/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error(err));
  }, []);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
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
  }, [audioRef, currentIndex]);

  // ---- SEEKING ----
  const handleSeek = (time) => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (value) => {
    setSeekValue(value);
  };

  const handleSeekEnd = (value) => {
    setIsSeeking(false);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  // Update slider when not dragging
  useEffect(() => {
    if (!isSeeking) {
      setSeekValue(currentTime);
    }
  }, [currentTime, isSeeking]);


  // ---- PLAY / PAUSE ----
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    };

  // ---- NEXT / PREVIOUS ----
  const playNext = () => {
    setCurrentIndex(prev =>
      shuffle
        ? Math.floor(Math.random() * songs.length)
        : (prev + 1) % songs.length
    );
    setLiked(false);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const playPrevious = () => {
    setCurrentIndex(prev =>
      shuffle
        ? Math.floor(Math.random() * songs.length)
        : (prev - 1 + songs.length) % songs.length
    );
    setLiked(false);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  useEffect(() => {
  if ("mediaSession" in navigator && songs.length > 0) {
    const currentSong = songs[currentIndex];

    // Set metadata for lock screen / notification
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: currentSong.name || "Unknown Title",
      artist: "Asrith's Playlist",
      album: "",
      artwork: [
        { src: "/cover.png", sizes: "512x512", type: "image/png" }
      ]
    });

    // Handle lock screen controls
    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      playNext();
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      playPrevious();
    });
  }
  }, [currentIndex, songs]);

  // ---- JSX ----
  <audio
    ref={audioRef}
    autoPlay
    src={
      songs[currentIndex]
        ? `https://asrith-music-player.onrender.com/stream/${songs[currentIndex]?.id}`
        : undefined
    }
    onEnded={playNext}
  />

  const handleVolumeChange = (v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleLike = () => setLiked((l) => !l);

  const handleSongSelect = (filteredIndex) => {
    if (filteredIndex < 0 || filteredIndex >= songs.length) return;
    setCurrentIndex(filteredIndex);
    setLiked(false);
  };

  return (
    <>
      {/* Background handler */}
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

        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />
        {/* Song Info */}
        <SongInfo song={songs[currentIndex]} />

        {/* Audio Player */}
        <audio
          ref={audioRef}
          autoPlay
          src={
            songs[currentIndex]
              ? `https://asrith-music-player.onrender.com/stream/${songs[currentIndex]?.id}`
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

export default App;
