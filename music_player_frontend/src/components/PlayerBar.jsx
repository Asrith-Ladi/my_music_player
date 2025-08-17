import { Play, Pause, SkipBack, SkipForward, Shuffle, Volume2, VolumeX, Heart } from "lucide-react";

export default function PlayerBar({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onShuffle,
  shuffle,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  liked,
  onLike
}) {
  // Format time mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Progress bar drag
  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    onSeek(percent * duration);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Progress Bar (no time display) */}
      <div className="flex items-center w-full select-none">
        <div className="flex-1 mx-2 relative group cursor-pointer" onClick={handleSeek}>
          <div className="h-1.5 bg-[#222] rounded-full w-full" />
          <div
            className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full absolute top-0 left-0"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
          />
          {/* Thumb */}
          {duration > 0 && (
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: duration ? `calc(${(currentTime / duration) * 100}% - 7px)` : "-7px" }}
            >
              <div className="w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full shadow-md opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200" />
            </div>
          )}
        </div>
      </div>
      {/* Main Controls Centered, with Favorite to the right of Next */}
      <div className="flex items-center justify-center gap-2 mt-2 w-full">
        <button
          onClick={onShuffle}
          className={`p-2 rounded-full border-2 border-black bg-gray-100 hover:bg-gray-200 active:bg-black active:text-white transition-colors ${shuffle ? "ring-2 ring-green-400" : ""}`}
          title="Shuffle"
          style={{ marginRight: '8px' }}
        >
          <Shuffle size={18} />
        </button>
        {/* <button
            onClick={onShuffle}
            className={`p-2 rounded-full border-2 border-black bg-gray-100 hover:bg-gray-200 active:bg-black active:text-white transition-colors ${shuffle ? "ring-2 ring-green-400" : ""}`}
            title="Shuffle"
            style={{
                color: shuffle ? '#22c55e' : 'white', // green color when active
                fontWeight: shuffle ? 'bold' : 'normal',
                marginRight: '8px'
            }}
            >
            Shuffle
            </button> */}
        <button
          onClick={onPrev}
          className="p-2 rounded-full border-2 border-black bg-gray-100 hover:bg-gray-200 active:bg-black active:text-white transition-colors"
          title="Previous"
          style={{ marginRight: '8px' }}
        >
          <SkipBack size={18} />
        </button>
        <button
          onClick={onPlayPause}
          className="p-4 rounded-full border-2 border-black bg-gray-100 hover:bg-gray-200 active:bg-black active:text-white shadow-lg flex justify-center items-center transition-all"
          title={isPlaying ? "Pause" : "Play"}
          style={{ marginRight: '8px' }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={onNext}
          className="p-2 rounded-full border-2 border-black bg-gray-100 hover:bg-gray-200 active:bg-black active:text-white transition-colors"
          title="Next"
          style={{ marginRight: '8px' }}
        >
          <SkipForward size={18} />
        </button>
        <button
          onClick={onLike}
          className={`p-2 rounded-full border-2 border-black bg-gray-100 hover:bg-gray-200 active:bg-black active:text-white transition-colors ${liked ? "ring-2 ring-pink-400 bg-pink-500 text-white" : ""}`}
          title="Like"
        >
          <Heart size={18} fill={liked ? "#ec4899" : "none"} />
        </button>
      </div>
      {/* Volume Controls Below */}
      <div className="flex items-center justify-center gap-4 w-full" style={{ marginTop: '6px' }}>
        <div className="flex items-center gap-1">
          <button onClick={() => onVolumeChange(volume === 0 ? 1 : 0)} className="text-gray-400">
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => onVolumeChange(Number(e.target.value))}
            className="w-20 h-1 accent-green-500"
          />
        </div>
      </div>
    </div>
  );
}
