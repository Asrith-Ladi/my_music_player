import { Search } from "lucide-react";

export default function SearchModal({ searchTerm, setSearchTerm, filteredSongs, handleSongSelect, closeModal, songs }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white text-black rounded-lg p-4 w-96 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Box with Icon */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search songs..."
            className="w-full pl-10 p-2 rounded-full border border-gray-300 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Search Results */}
        <ul className="max-h-48 overflow-y-auto mt-2">
          {filteredSongs.map((song) => (
            <li
              key={song.id}
              className="p-2 cursor-pointer hover:bg-gray-200 rounded"
              onClick={() => handleSongSelect(songs.indexOf(song))}
            >
              {song.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
