import React from 'react';

const Player = ({ currentSong }) => {
  if (!currentSong) return <p>Select a song to play</p>;

  return (
    <div>
      <h3>{currentSong.name}</h3>
      <audio controls autoPlay style={{ width: '100%' }}>
        <source src={currentSong.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Player;
