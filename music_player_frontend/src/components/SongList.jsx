import React from 'react';

const SongList = ({ songs, onSelect }) => {
  return (
    <ul>
      {songs.map(song => (
        <li
          key={song.id}
          style={{ cursor: 'pointer', margin: '5px 0' }}
          onClick={() => onSelect(song)}
        >
          🎵 {song.name}
        </li>
      ))}
    </ul>
  );
};

export default SongList;
