import { useState, useRef, useCallback } from 'react';

export function useAudio(src: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>();

  const play = useCallback(async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.addEventListener('ended', () => setIsPlaying(false));
        audioRef.current.addEventListener('loadstart', () => setIsLoading(true));
        audioRef.current.addEventListener('canplaythrough', () => setIsLoading(false));
      }
      
      setIsPlaying(true);
      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  }, [src]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  return {
    play,
    pause,
    stop,
    isPlaying,
    isLoading
  };
}
