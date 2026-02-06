
import React, { useEffect, useRef, useState } from 'react';

interface PodcastPlayerProps {
  base64Audio: string;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ base64Audio }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const play = () => {
    if (!audioRef.current) return;
    void audioRef.current.play();
    setIsPlaying(true);
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      const duration = audioRef.current.duration || 0;
      const current = audioRef.current.currentTime || 0;
      setProgress(duration ? (current / duration) * 100 : 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, [base64Audio]);

  return (
    <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex items-center space-x-6">
      <audio ref={audioRef} src={base64Audio} preload="metadata" />
      <button 
        onClick={isPlaying ? stop : play}
        className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-all hover:scale-105"
      >
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xl`}></i>
      </button>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-indigo-900 uppercase tracking-wide">Audio Podcast AI</span>
          <span className="text-xs text-indigo-400 font-medium">Auto-généré</span>
        </div>
        <div className="h-2 w-full bg-indigo-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-100" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-indigo-400">Écoutez le résumé audio du cours</span>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer;
