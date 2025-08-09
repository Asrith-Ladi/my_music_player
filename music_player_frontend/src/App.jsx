import { useEffect, useState, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Shuffle } from "lucide-react";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const audioRef = useRef(null);

  // Fetch songs from backend
  useEffect(() => {
    fetch("https://asrith-music-player.onrender.com/songs")
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

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setTotalDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setTotalDuration);
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
    setShowSearchResults(false);
    setSearchTerm("");
  };

  const playPrevious = () => {
    setCurrentIndex((prev) => {
      if (shuffle) return Math.floor(Math.random() * songs.length);
      return prev - 1 >= 0 ? prev - 1 : songs.length - 1;
    });
    setShowSearchResults(false);
    setSearchTerm("");
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

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  };

  // Filter songs for search
  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // When user selects a song from search list
  const handleSongSelect = (index) => {
    setCurrentIndex(index);
    setShowSearchResults(false);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900">
      <div className="p-4 max-w-md w-full text-white bg-gray-800 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold underline text-blue-400 mb-4">
          🎧 Asrith's Music Player
        </h1>

        {/* Now Playing */}
        <div className="mb-4">
          <span className="text-gray-400 mr-2">Now Playing:</span>
          <span className="font-bold">{songs[currentIndex]?.name || "No song selected"}</span>
        </div>

        {/* Search box */}
        <input
          type="text"
          placeholder="Search songs..."
          className="w-full p-2 mb-2 rounded-md text-black"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSearchResults(true);
          }}
        />

        {/* Search results dropdown */}
        {showSearchResults && filteredSongs.length > 0 && (
          <ul className="max-h-48 overflow-y-auto mb-4 bg-gray-700 rounded-md">
            {filteredSongs.map((song, index) => (
              <li
                key={song.id}
                className="p-2 cursor-pointer hover:bg-gray-600"
                onClick={() => handleSongSelect(songs.indexOf(song))}
              >
                {song.name}
              </li>
            ))}
          </ul>
        )}

        {songs.length === 0 ? (
          <p>No songs found.</p>
        ) : (
          <>
            <audio
              ref={audioRef}
              autoPlay
              src={`http://127.0.0.1:8000/stream/${songs[currentIndex]?.id}`}
              onEnded={handleSongEnd}
            />

            {/* Progress Bar */}
            <div
              className="w-full h-3 bg-gray-600 rounded-full cursor-pointer mb-2"
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
                onClick={togglePlayPause}
                className="p-4 rounded-full bg-green-500 hover:bg-green-400 flex justify-center items-center"
              >
                {audioRef.current && !audioRef.current.paused ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} />
                )}
              </button>
              <button
                onClick={playNext}
                className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
              >
                <SkipForward size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
