export default function SongInfo({ song }) {
  return (
    <div className="flex items-center gap-4 w-full mb-6">
      <div className="flex-1 min-w-0">
        {/* <div className="text-gray-400 text-xs"><h3>Now Playing</h3></div> */}
      <div className="text-white font-bold text-lg sm:text-xl mb-1">
        <h2>{song?.name || "No song selected"}</h2>
        </div>
        <div className="text-gray-400 text-xs truncate max-w-[180px]">
          {/* {song?.artist || "Unknown Artist"} */}
        </div>
      </div>
    </div>
  );
}
