import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { awardXP } from "@/lib/gamification";

interface YouTubePlaylistTrackerProps {
  playlistId: string;
}

export default function YouTubePlaylistTracker({ playlistId }: YouTubePlaylistTrackerProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/youtube/playlist', playlistId],
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const [playlistProgress, setPlaylistProgress] = useLocalStorage<any[]>('playlist-progress', []);
  const [userProgress, setUserProgress] = useLocalStorage('user-progress', {
    id: 'user1',
    level: 1,
    xp: 0,
    streak: 0,
    todayXP: 0
  });

  const handleVideoToggle = (videoId: string, title: string, completed: boolean) => {
    setPlaylistProgress((prev: any[]) => {
      const existing = prev.find(p => p.videoId === videoId);
      const updated = prev.filter(p => p.videoId !== videoId);
      
      if (completed) {
        // Award XP for completing video
        awardXP(setUserProgress, 2, `Completed: ${title}`);
        
        updated.push({
          playlistId,
          videoId,
          title,
          completed: true,
          completedAt: new Date().toISOString()
        });
      } else {
        // Remove XP if unchecking (though this is rare)
        if (existing) {
          updated.push({
            ...existing,
            completed: false,
            completedAt: undefined
          });
        }
      }
      
      return updated;
    });
  };

  const videos = (data as any)?.videos || [];
  const completedCount = playlistProgress.filter((p: any) => 
    p.playlistId === playlistId && p.completed
  ).length;
  const progressPercentage = videos.length > 0 ? (completedCount / videos.length) * 100 : 0;

  if (error) {
    return (
      <Card data-testid="youtube-playlist-tracker">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <i className="fab fa-youtube text-red-500 mr-2"></i>
            Striver's A2Z DSA Course
          </h3>
          <div className="text-center text-destructive">
            <p>Failed to load playlist data</p>
            <p className="text-sm text-muted-foreground mt-1">Check API configuration</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="youtube-playlist-tracker">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <i className="fab fa-youtube text-red-500 mr-2"></i>
          Striver's A2Z DSA Course
        </h3>
        
        {/* YouTube Embed */}
        <div className="mb-4 w-full flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">Striver Playlist</h2>
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/videoseries?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz"
            title="Striver Playlist"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            data-testid="youtube-embed"
          />
        </div>
        
        {/* Progress Checklist */}
        <div className="space-y-2 max-h-48 overflow-y-auto" data-testid="video-checklist">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="w-8 h-4" />
              </div>
            ))
          ) : (
            videos.map((video: any) => {
              const isCompleted = playlistProgress.some((p: any) => 
                p.videoId === video.id && p.completed
              );
              
              return (
                <div 
                  key={video.id}
                  className="flex items-center space-x-3 p-2 hover:bg-secondary rounded-lg transition-colors"
                  data-testid={`video-item-${video.id}`}
                >
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={(checked) => 
                      handleVideoToggle(video.id, video.title, !!checked)
                    }
                    data-testid={`checkbox-video-${video.id}`}
                  />
                  <span className={`text-sm flex-1 ${
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {video.title}
                  </span>
                  <span className={`text-xs ${
                    isCompleted ? 'text-green-500' : 'text-muted-foreground'
                  }`}>
                    +2 XP
                  </span>
                </div>
              );
            })
          )}
        </div>
        
        <div className="mt-4 text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Progress: <span className="font-medium" data-testid="text-playlist-progress">
              {completedCount} / {videos.length} videos
            </span>
          </div>
          <div className="bg-secondary rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
              data-testid="progress-bar-playlist"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
