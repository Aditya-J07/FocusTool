import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SkipBack, Play, Pause, SkipForward, Shuffle, Volume2, Music, User, Settings, X } from "lucide-react";

interface LastFmTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  image?: string;
  nowPlaying?: boolean;
  playedAt?: string | null;
  playcount?: number;
}

export default function MusicPlayer() {
  const [lastFmUsername, setLastFmUsername] = useLocalStorage('lastfm-username', '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useLocalStorage('current-track-index', 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Fetch recent tracks from Last.fm
  const { data: recentTracks } = useQuery({
    queryKey: ['lastfm-recent', lastFmUsername],
    queryFn: async () => {
      if (!lastFmUsername) return { tracks: [] };
      const response = await fetch(`/api/lastfm/user/${lastFmUsername}/recent?limit=20`);
      if (!response.ok) throw new Error('Failed to fetch recent tracks');
      return response.json();
    },
    enabled: !!lastFmUsername,
    refetchInterval: 30000,
  });

  const { data: userInfo } = useQuery({
    queryKey: ['lastfm-user', lastFmUsername],
    queryFn: async () => {
      if (!lastFmUsername) return null;
      const response = await fetch(`/api/lastfm/user/${lastFmUsername}`);
      if (!response.ok) throw new Error('Failed to fetch user info');
      return response.json();
    },
    enabled: !!lastFmUsername,
  });

  const tracks = recentTracks?.tracks || [];
  const currentTrack = tracks[currentTrackIndex] || { 
    title: 'Connect Last.fm to see your music', 
    artist: 'No music data', 
    image: '' 
  };

  const previousTrack = () => {
    if (tracks.length === 0) return;
    const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(newIndex);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(newIndex);
  };

  const playRandom = () => {
    if (tracks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * tracks.length);
    setCurrentTrackIndex(randomIndex);
  };

  if (showSettings) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-2xl z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Music Settings</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Last.fm Username
              </label>
              <Input
                value={lastFmUsername}
                onChange={(e) => setLastFmUsername(e.target.value)}
                placeholder="Enter your Last.fm username"
                className="bg-background/50 border-border/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Spotify Playlist
              </label>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-foreground">Coding Focus Playlist</p>
                    <p className="text-sm text-muted-foreground">Your curated focus music</p>
                  </div>
                </div>
                <a 
                  href="https://open.spotify.com/playlist/2LOxEzC4KmoWJ9NhW0kz5M" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-green-400 hover:text-green-300 underline"
                >
                  Open in Spotify →
                </a>
              </div>
            </div>
            
            {userInfo && (
              <div className="p-4 rounded-lg bg-background/30 border border-border/30">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{userInfo.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {userInfo.playcount?.toLocaleString()} total scrobbles
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-2xl z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/30">
              {currentTrack.image ? (
                <img 
                  src={currentTrack.image} 
                  alt={currentTrack.title}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <Music className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-foreground truncate text-base">
                {currentTrack.title}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {currentTrack.artist}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={previousTrack}
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button
              onClick={nextTrack}
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={playRandom}
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shuffle className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => setShowSettings(true)}
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors ml-2"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
