import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function NotificationBar() {
  const { data: leetcodeData } = useQuery({
    queryKey: ['/api/leetcode/Aditya_J07'],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const [playlistProgress] = useLocalStorage('playlist-progress', []);
  const [pomodoroData] = useLocalStorage('pomodoro-data', { sessionsToday: 0 });

  const isLeetCodeComplete = (leetcodeData as any)?.todaysSolved >= ((leetcodeData as any)?.dailyTarget || 2);
  const completedVideos = playlistProgress.filter((v: any) => v.completed).length;
  const totalVideos = playlistProgress.length;
  const isPlaylistComplete = totalVideos > 0 && completedVideos === totalVideos;
  const hasPomodoroSessions = pomodoroData.sessionsToday > 0;

  const allTasksComplete = isLeetCodeComplete && isPlaylistComplete && hasPomodoroSessions;
  const pendingTasks = [
    !isLeetCodeComplete && 'LeetCode problems',
    !isPlaylistComplete && 'Video playlist',
    !hasPomodoroSessions && 'Pomodoro session'
  ].filter(Boolean);

  return (
    <div 
      className={`w-full px-6 py-3 text-center font-medium shadow-sm ${
        allTasksComplete 
          ? 'bg-green-500 text-white' 
          : 'bg-destructive text-destructive-foreground'
      }`}
      data-testid="notification-bar"
    >
      {allTasksComplete ? (
        <>
          <i className="fas fa-check-circle mr-2"></i>
          All daily tasks completed! Great job! 🎉
        </>
      ) : (
        <>
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} pending for today - Keep pushing forward! 💪
        </>
      )}
    </div>
  );
}
