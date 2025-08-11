import { useEffect, useState, useRef } from "react";
import './App.css';
import PlayerBar from "./components/PlayerBar";
import SongInfo from "./components/SongInfo";
import SearchSongList from "./components/SearchSongList";
import ThemeSwitcher from "./components/ThemeSwitcher";

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function App() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theme, setTheme] = useState('light');
  const [lightColor, setLightColor] = useState('#a7f3d0');
  const [shuffle, setShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [liked, setLiked] = useState(false);
  const audioRef = useRef(null);

  // Background gradients
  const darkGradient = 'linear-gradient(135deg, #232526, #414345, #181818)';
  const lightGradient = `linear-gradient(135deg, #d1fae5, ${lightColor}, #6ee7b7)`;

  // Fetch songs
  useEffect(() => {
    fetch("https://asrith-music-player.onrender.com/songs")
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.error(err));
  }, []);

  //audio
  useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onLoadedMetadata = () => {
    if (audio.duration && Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
    } else {
      setDuration(0);
    }
  };
  const onTimeUpdate = () => {
    setCurrentTime(audio.currentTime);
  };

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


// useEffect(() => {
//   setDuration(0);
//   setCurrentTime(0);
// }, [currentIndex]);


  useEffect(() => {
    document.body.style.background = theme === 'dark' ? darkGradient : lightGradient;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.margin = '0';  // Remove default margin for full bg
    document.body.style.minHeight = '100vh';  // Ensure full height
  }, [theme, darkGradient, lightGradient]);

  const playNext = () => {
    setCurrentIndex(prev => shuffle
      ? Math.floor(Math.random() * songs.length)
      : (prev + 1) % songs.length
    );
    setLiked(false);
  };
  const playPrevious = () => {
    setCurrentIndex(prev => shuffle
      ? Math.floor(Math.random() * songs.length)
      : (prev - 1 + songs.length) % songs.length
    );
    setLiked(false);
  };
  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  const handlePlayPause = () => {
  if (!audioRef.current) return;
  if (audioRef.current.paused) audioRef.current.play();
  else audioRef.current.pause();
};

  const handleVolumeChange = (v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };
  const handleLike = () => setLiked(l => !l);

  // onSelect receives filteredIndex, map it to actual song index
  const handleSongSelect = (filteredIndex) => {
    if (filteredIndex < 0 || filteredIndex >= songs.length) return;
    setCurrentIndex(filteredIndex);
    setLiked(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-screen p-4"
      style={{
        background: 'transparent', // bg handled by body now
        transition: 'background 0.5s',
      }}
    >
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

      {/* SEARCH BAR & SONG LIST */}
      <SearchSongList
        songs={songs}
        currentIndex={currentIndex}
        onSelect={handleSongSelect}
      />

      {/* Progress Bar */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={e => handleSeek(Number(e.target.value))}
        className="w-full max-w-md mt-40 h-2 rounded-full cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${(duration ? (currentTime / duration) * 100 : 0)}%, #555 ${(duration ? (currentTime / duration) * 100 : 0)}%)`
        }}
      />
      <div className="flex justify-between w-full max-w-md text-sm mt-1 text-white">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <SongInfo song={songs[currentIndex]} />

      <audio
        ref={audioRef}
        autoPlay
        src={songs[currentIndex] ? `https://asrith-music-player.onrender.com/stream/${songs[currentIndex]?.id}` : undefined}
        onEnded={playNext}
      />
      {/* {songs.length > 0 && (
  <audio
    ref={audioRef}
    autoPlay
    src={`https://asrith-music-player.onrender.com/stream/${songs[currentIndex].id}`}
    onEnded={playNext}
  />
)} */}


      <PlayerBar
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={playNext}
        onPrev={playPrevious}
        onShuffle={() => setShuffle(s => !s)}
        shuffle={shuffle}        // <-- pass shuffle here
        volume={volume}
        onVolumeChange={handleVolumeChange}
        liked={liked}
        onLike={handleLike}
      />
    </div>
  );
}

export default App;
