import { useState } from "react";
import NotificationBar from "@/components/NotificationBar";
import LeetCodeTracker from "@/components/LeetCodeTracker";
import PomodoroTimer from "@/components/PomodoroTimer";
import YouTubePlaylistTracker from "@/components/YouTubePlaylistTracker";
import MusicPlayer from "@/components/MusicPlayer";
import GamificationStats from "@/components/GamificationStats";
import DailySummary from "@/components/DailySummary";
import WeeklyProgressChart from "@/components/WeeklyProgressChart";
import MotivationHeader from "@/components/MotivationHeader";
import FocusModeOverlay from "@/components/FocusModeOverlay";
import LiquidEther from "@/components/LiquidEther";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Sparkles, Target, Code, Play, Music, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [focusMode, setFocusMode] = useState(false);
  const [userProgress] = useLocalStorage('user-progress', {
    id: 'user1',
    level: 1,
    xp: 0,
    streak: 0,
    todayXP: 0,
    lastActiveDate: new Date().toISOString().split('T')[0]
  });

  const [pomodoroData] = useLocalStorage('pomodoro-data', {
    sessionsToday: 0,
    totalSessions: 0
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0">
          <LiquidEther
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            mouseForce={15}
            cursorSize={80}
            isViscous={true}
            viscous={25}
            iterationsViscous={28}
            iterationsPoisson={28}
            resolution={0.7}
            isBounce={true}
            autoDemo={true}
            autoSpeed={0.3}
            autoIntensity={1.8}
            takeoverDuration={0.3}
            autoResumeDelay={4000}
            autoRampDuration={0.8}
          />
        </div>
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 z-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-chart-3/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <NotificationBar />
      
      {focusMode && (
        <FocusModeOverlay onExit={() => setFocusMode(false)} />
      )}

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pt-8 pb-28">
        {/* Header Section */}
        <div className="mb-12">
          <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-3xl p-8 shadow-2xl">
            <MotivationHeader />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Your Progress</h2>
            </div>
            <GamificationStats 
              level={userProgress.level}
              xp={userProgress.xp}
              streak={userProgress.streak}
              todayXP={userProgress.todayXP}
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* LeetCode Tracker */}
          <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-chart-1/20 border border-chart-1/30">
                  <Code className="w-5 h-5 text-chart-1" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Coding Progress</h3>
              </div>
            </div>
            <div className="p-2">
              <LeetCodeTracker username="Aditya_J07" />
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-chart-3/20 border border-chart-3/30">
                  <Target className="w-5 h-5 text-chart-3" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Focus Timer</h3>
              </div>
            </div>
            <div className="p-2">
              <PomodoroTimer 
                onEnterFocusMode={() => setFocusMode(true)}
                sessionsToday={pomodoroData.sessionsToday}
              />
            </div>
          </div>

          {/* Daily Summary */}
          <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-chart-5/20 border border-chart-5/30">
                  <TrendingUp className="w-5 h-5 text-chart-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Daily Summary</h3>
              </div>
            </div>
            <div className="p-2">
              <DailySummary />
            </div>
          </div>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* YouTube Playlist */}
          <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/30">
                  <Play className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Learning Videos</h3>
              </div>
            </div>
            <div className="p-2">
              <YouTubePlaylistTracker playlistId="PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" />
            </div>
          </div>

          {/* Weekly Progress Chart */}
          <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-chart-2/20 border border-chart-2/30">
                  <TrendingUp className="w-5 h-5 text-chart-2" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Weekly Analytics</h3>
              </div>
            </div>
            <div className="p-2">
              <WeeklyProgressChart />
            </div>
          </div>
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
}
