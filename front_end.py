import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlayCircle, PauseCircle } from 'lucide-react';

const API_URL = 'https://your-fastapi-backend-url.com'; // Replace with your actual backend URL

export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/list-audio`)
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const playSong = (song) => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(`${API_URL}/stream-audio/${song.id}`);
    newAudio.play();
    setSelectedSong(song);
    setAudio(newAudio);
    setIsPlaying(true);

    newAudio.onended = () => setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">🎧 My Music Player</h1>

      {loading ? (
        <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {songs.map(song => (
            <Card key={song.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => playSong(song)}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{song.name}</p>
                  <p className="text-sm text-gray-500">{song.mimeType}</p>
                </div>
                <PlayCircle className="text-blue-500 w-6 h-6" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedSong && (
        <div className="mt-8 text-center">
          <p className="text-xl font-semibold">Now Playing:</p>
          <p className="text-lg mb-2">{selectedSong.name}</p>
          <Button onClick={togglePlay}>
            {isPlaying ? <PauseCircle className="w-5 h-5 mr-2" /> : <PlayCircle className="w-5 h-5 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      )}
    </div>
  );
}
