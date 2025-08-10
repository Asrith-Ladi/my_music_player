export default function SongList({ songs, currentIndex, onSelect, searchTerm }) {
  // Helper to highlight search matches
  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-yellow-200 text-black font-semibold rounded px-1">{part}</span> : part
    );
  }
  return (
    <div className="w-full mb-6">
      {searchTerm.trim() ? (
        <ul className="max-h-56 overflow-y-auto bg-[#222] rounded-md border border-[#282828] shadow list-none">
          {songs.length === 0 ? (
            <li className="p-3 text-gray-400 text-center">No songs found.</li>
          ) : (
            songs.map((song, idx) => {
              let displayName = song.name;
              displayName = displayName.replace(/^\s*([\[\(]?\d+[\]\)]?\s*[-.]?\s*)+/, "");
              displayName = displayName.replace(/\s*-\s*SenSongsMp3\.Co\.mp3$/i, "");
              displayName = displayName.replace(/\s*\[.*?SenSongsMp3\.[^\]]*\]\.mp3$/i, "");
              displayName = displayName.replace(/\.mp3$/i, "");
              return (
                <li
                  key={song.id}
                  className={[
                    "p-3 cursor-pointer transition-colors rounded-md border-b border-gray-300",
                    idx === currentIndex ? "bg-green-700/80 text-white font-bold" : "",
                    idx === songs.length - 1 ? "border-b-0" : "",
                    "hover:bg-gray-300 hover:text-black"
                  ].join(" ")}
                  onClick={() => onSelect(idx)}
                >
                  {highlightMatch(displayName, searchTerm)}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
