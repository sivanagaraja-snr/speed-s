import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'CORRUPTION.WAV', url: 'https://actions.google.com/sounds/v1/science_fiction/cybernetic_atmosphere.ogg' },
  { id: 2, title: 'NULL_POINTER', url: 'https://actions.google.com/sounds/v1/science_fiction/robot_startup_sequence.ogg' },
  { id: 3, title: 'MEMORY_LEAK', url: 'https://actions.google.com/sounds/v1/science_fiction/alien_breath.ogg' },
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  };

  const track = TRACKS[currentTrack];

  return (
    <div className="border-4 border-cyan-500 bg-black p-6 relative overflow-hidden glitch-border">
      <div className="absolute top-0 right-0 bg-cyan-500 text-black px-3 py-1 text-base font-bold uppercase z-10 border-b-2 border-l-2 border-cyan-900">Audio.Daemon</div>
      
      <div className="mb-8 mt-6">
        <div className="text-magenta-500 uppercase tracking-widest text-lg mb-2 flex items-center gap-2">
            <div className={`w-3 h-3 bg-magenta-500 ${isPlaying ? 'animate-ping' : ''}`}></div>
            {isPlaying ? 'STREAMING' : 'IDLE'} // TRACK 0{currentTrack + 1}
        </div>
        <div className="text-4xl text-white glitch-text truncate font-black mt-2" data-text={track.title}>{track.title}</div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={togglePlay}
          className="flex-1 bg-magenta-600 text-white text-2xl font-black py-4 uppercase hover:bg-magenta-500 border-2 border-magenta-400 cursor-pointer active:translate-y-1 transition-transform tracking-widest shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]"
        >
          {isPlaying ? 'HALT' : 'EXECUTE'}
        </button>
        <button
          onClick={nextTrack}
          className="flex-1 bg-cyan-600 text-black text-2xl font-black py-4 uppercase hover:bg-cyan-500 border-2 border-cyan-400 cursor-pointer active:translate-y-1 transition-transform tracking-widest shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
        >
          BYPASS
        </button>
      </div>

      <audio
        ref={audioRef}
        src={track.url}
        onEnded={nextTrack}
        loop={false}
        className="hidden"
      />
    </div>
  );
}
