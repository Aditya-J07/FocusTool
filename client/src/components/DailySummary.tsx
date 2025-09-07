import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function DailySummary() {
  const { data: leetcodeData } = useQuery({
    queryKey: ['/api/leetcode/Aditya_J07'],
  });

  const [playlistProgress] = useLocalStorage('playlist-progress', []);
  const [pomodoroData] = useLocalStorage('pomodoro-data', { sessionsToday: 0 });

  const problemsSolved = (leetcodeData as any)?.todaysSolved || 0;
  const dailyTarget = (leetcodeData as any)?.dailyTarget || 2;
  const videosWatched = playlistProgress.filter((v: any) => v.completed).length;
  const totalVideos = Math.max(playlistProgress.length, 8); // Default to 8 if no data
  const pomodoroSessions = pomodoroData.sessionsToday;

  // Calculate overall daily goal progress
  const problemsProgress = Math.min(problemsSolved / dailyTarget, 1);
  const videosProgress = totalVideos > 0 ? Math.min(videosWatched / totalVideos, 1) : 0;
  const pomodoroProgress = Math.min(pomodoroSessions / 3, 1); // Target: 3 sessions

  const overallProgress = Math.round(((problemsProgress + videosProgress + pomodoroProgress) / 3) * 100);

  return (
    <Card data-testid="daily-summary">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <i className="fas fa-chart-line text-accent mr-2"></i>
          Daily Summary
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Problems Solved</span>
            <span className="font-medium" data-testid="text-problems-solved">
              {problemsSolved} / {dailyTarget} {problemsSolved >= dailyTarget ? '✅' : ''}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Videos Watched</span>
            <span className="font-medium" data-testid="text-videos-watched">{videosWatched} / {totalVideos}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pomodoro Sessions</span>
            <span className="font-medium" data-testid="text-pomodoro-sessions">{pomodoroSessions}</span>
          </div>
          
          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Daily Goal Progress</span>
              <span className="text-sm text-accent" data-testid="text-goal-progress">{overallProgress}%</span>
            </div>
            <div className="bg-secondary rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300" 
                style={{ width: `${overallProgress}%` }}
                data-testid="progress-bar-daily-goal"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
