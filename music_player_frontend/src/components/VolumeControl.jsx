import { Volume2, VolumeX } from "lucide-react";

export default function VolumeControl({ volume, onVolumeChange }) {
  return (
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
  );
}
