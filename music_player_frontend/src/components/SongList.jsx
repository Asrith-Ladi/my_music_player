export default function SongList({ songs, currentIndex, onSelect, searchTerm, onSearch }) {
  return (
    <div className="w-full mb-6">
      <input
        type="text"
        placeholder="Search songs..."
        className="w-full p-2 mb-3 rounded-full text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
        value={searchTerm}
        onChange={e => onSearch(e.target.value)}
      />
      {searchTerm.trim() ? (
        <ul className="max-h-48 overflow-y-auto bg-[#222] rounded-md border border-[#282828] shadow list-none">
          {songs.length === 0 ? (
            <li className="p-2 text-gray-400">No songs found.</li>
          ) : (
            songs.map((song, idx) => (
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
                {song.name}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
