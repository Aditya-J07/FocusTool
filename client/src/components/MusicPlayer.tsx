import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/hooks/useAudio";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SkipBack, Play, Pause, SkipForward, Shuffle, Volume2 } from "lucide-react";

const focusTracks = [
  { id: '1', title: 'Lo-Fi Coding Beats', artist: 'Focus Music', src: '/music/lofi-coding.mp3' },
  { id: '2', title: 'Ambient Piano', artist: 'Concentration', src: '/music/ambient-piano.mp3' },
  { id: '3', title: 'Forest Sounds', artist: 'Nature', src: '/music/forest-sounds.mp3' },
  { id: '4', title: 'Rain & Thunder', artist: 'Weather', src: '/music/rain-thunder.mp3' },
  { id: '5', title: 'Electronic Focus', artist: 'Synthwave', src: '/music/electronic-focus.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useLocalStorage('current-track-index', 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = focusTracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const previousTrack = () => {
    const newIndex = currentTrackIndex === 0 ? focusTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
  };

  const nextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % focusTracks.length;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
  };

  const playRandom = () => {
    const randomIndex = Math.floor(Math.random() * focusTracks.length);
    setCurrentTrackIndex(randomIndex);
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40" data-testid="music-player">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
      />
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-music text-accent"></i>
            </div>
            <div>
              <div className="font-medium text-sm" data-testid="text-current-track">{currentTrack.title}</div>
              <div className="text-xs text-muted-foreground" data-testid="text-current-artist">{currentTrack.artist}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={previousTrack}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-secondary"
              data-testid="button-previous-track"
            >
              <SkipBack className="w-4 h-4 text-muted-foreground" />
            </Button>
            
            <Button
              onClick={togglePlay}
              className="p-3 bg-accent hover:bg-accent/90 text-accent-foreground"
              data-testid="button-toggle-play"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={nextTrack}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-secondary"
              data-testid="button-next-track"
            >
              <SkipForward className="w-4 h-4 text-muted-foreground" />
            </Button>
            
            <Button
              onClick={playRandom}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-secondary"
              data-testid="button-random-track"
            >
              <Shuffle className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground" data-testid="text-current-time">
              {formatTime(currentTime)}
            </span>
            <div className="w-24 bg-secondary rounded-full h-1">
              <div 
                className="bg-accent h-1 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
                data-testid="progress-bar-music"
              />
            </div>
            <span className="text-xs text-muted-foreground" data-testid="text-duration">
              {formatTime(duration)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-secondary ml-2"
              data-testid="button-volume"
            >
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
