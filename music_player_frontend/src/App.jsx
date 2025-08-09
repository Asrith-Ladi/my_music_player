import { useEffect, useState, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Shuffle } from "lucide-react";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Fetch songs from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Update progress & duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setTotalDuration = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setTotalDuration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setTotalDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [currentIndex]);

  // Auto-play next
  const handleSongEnd = () => {
    playNext();
  };

  const playNext = () => {
    setCurrentIndex((prev) => {
      if (shuffle) return Math.floor(Math.random() * songs.length);
      return prev + 1 < songs.length ? prev + 1 : 0;
    });
  };

  const playPrevious = () => {
    setCurrentIndex((prev) => {
      if (shuffle) return Math.floor(Math.random() * songs.length);
      return prev - 1 >= 0 ? prev - 1 : songs.length - 1;
    });
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const clickX = e.nativeEvent.offsetX;
    const width = e.target.clientWidth;
    audio.currentTime = (clickX / width) * duration;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {songs.length === 0 ? (
        <p>No songs found.</p>
      ) : (
        <div className="w-full max-w-md bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">🎧 My Music Player</h1>

          <select
            className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white focus:outline-none"
            value={currentIndex}
            onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
          >
            {songs.map((song, index) => (
              <option key={song.id} value={index}>
                {song.name}
              </option>
            ))}
          </select>

          <audio
            ref={audioRef}
            autoPlay
            src={`http://127.0.0.1:8000/stream/${songs[currentIndex]?.id}`}
            onEnded={handleSongEnd}
          />
          {/* Song Info */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {songs[currentIndex]?.name || "Unknown Title"}
            </h2>
            <p className="text-gray-400 text-sm">
              {songs[currentIndex]?.artist || "Unknown Artist"}
            </p>
          </div>
          {/* Progress Bar */}
          <div
            className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-2"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Time */}
          <div className="flex justify-between text-sm text-gray-400 mb-4">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`p-3 rounded-full ${
                shuffle ? "bg-green-500" : "bg-gray-700"
              }`}
            >
              <Shuffle size={20} />
            </button>
            <button
              onClick={playPrevious}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => {
                const audio = audioRef.current;
                if (audio.paused) {
                  audio.play();
                } else {
                  audio.pause();
                }
              }}
              className="p-4 rounded-full bg-green-500 hover:bg-green-400"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={playNext}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
