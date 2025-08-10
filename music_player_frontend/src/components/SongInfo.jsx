export default function SongInfo({ song, stroke }) {
  // Extract main song name: remove leading track number and trailing site/extension
  let displayName = song?.name || "No song selected";
  // Remove leading track number and dash (e.g., '04 - ')
  displayName = displayName.replace(/^\s*\d+\s*-\s*/, "");
  // Remove trailing ' - SenSongsMp3.Co.mp3' or similar
  displayName = displayName.replace(/\s*-\s*SenSongsMp3\.Co\.mp3$/i, "");

  return (
    <div className="flex items-center gap-4 w-full mb-6">
      <div className="flex-1 min-w-0">
        {/* <div className="text-gray-400 text-xs"><h3>Now Playing</h3></div> */}
        <div
          className="font-bold text-lg sm:text-xl mb-1"
          style={stroke ? {
            WebkitTextStroke: '1px #111',
            textStroke: '1px #111',
            fontFamily: 'Aptos, Arial, sans-serif',
            textShadow: '0 2px 8px rgba(0,0,0,0.18)',
            color: '#111',
          } : { fontFamily: 'Aptos, Arial, sans-serif' }}
        >
          <h2>{displayName}</h2>
        </div>
        <div className="text-gray-400 text-xs truncate max-w-[180px]" style={{ fontFamily: 'Aptos, Arial, sans-serif' }}>
          {/* {song?.artist || "Unknown Artist"} */}
        </div>
      </div>
    </div>
  );
}
