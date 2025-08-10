export default function SongList({ songs, currentIndex, onSelect, searchTerm, onSearch }) {
  return (
    <div className="w-full mb-6">
      <input
        type="text"
        placeholder="Search songs..."
        className="w-full py-3 px-4 mb-3 rounded-full text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
        value={searchTerm}
        onChange={e => onSearch(e.target.value)}
      />
      {searchTerm.trim() ? (
        <ul className="max-h-48 overflow-y-auto bg-[#222] rounded-md border border-[#282828] shadow list-none">
          {songs.length === 0 ? (
            <li className="p-2 text-gray-400">No songs found.</li>
          ) : (
            songs.map((song, idx) => {
              // Clean song name: remove leading numbers, brackets, dots, dashes, and trailing site/extension
              let displayName = song.name;
              // Remove leading [brackets], numbers, dots, dashes, spaces
              displayName = displayName.replace(/^\s*([\[\(]?\d+[\]\)]?\s*[-.]?\s*)+/, "");
              // Remove trailing ' - SenSongsMp3.Co.mp3' or similar
              displayName = displayName.replace(/\s*-\s*SenSongsMp3\.Co\.mp3$/i, "");
              // Remove trailing ' [www.SenSongsMp3.co].mp3' or similar
              displayName = displayName.replace(/\s*\[.*?SenSongsMp3\.[^\]]*\]\.mp3$/i, "");
              // Remove trailing '.mp3' (if any remains)
              displayName = displayName.replace(/\.mp3$/i, "");
              return (
                <li
                  key={song.id}
                  className={[
                    "p-2 cursor-pointer transition-colors rounded-md border-b border-gray-300",
                    idx === currentIndex ? "bg-green-700/80 text-white font-bold" : "",
                    idx === songs.length - 1 ? "border-b-0" : "",
                    "hover:bg-gray-300 hover:text-black"
                  ].join(" ")}
                  onClick={() => onSelect(idx)}
                >
                  {displayName}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
