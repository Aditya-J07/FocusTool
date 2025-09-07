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
    <div className="liquid-ether-container cyber-grid min-h-screen font-sans">
      {/* LiquidEther Background */}
      <div className="fixed inset-0 z-0">
        <LiquidEther
          colors={['#EDE0D4', '#E6CCB2', '#DDB892']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      
      {/* Floating particles */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <NotificationBar />
      
      {focusMode && (
        <FocusModeOverlay onExit={() => setFocusMode(false)} />
      )}

      <div className="container mx-auto px-4 py-6 pb-24 relative z-10">
        <div className="glass-morphism interactive-card hover-lift p-6 mb-6 holographic-border">
          <MotivationHeader />
        </div>
        
        <div className="glass-morphism interactive-card hover-lift p-6 mb-6 data-stream">
          <GamificationStats 
            level={userProgress.level}
            xp={userProgress.xp}
            streak={userProgress.streak}
            todayXP={userProgress.todayXP}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-morphism interactive-card hover-lift p-1 neon-glow-blue holographic-border">
            <LeetCodeTracker username="Aditya_J07" />
          </div>
          <div className="glass-morphism interactive-card hover-lift p-1 neon-glow-purple data-stream">
            <PomodoroTimer 
              onEnterFocusMode={() => setFocusMode(true)}
              sessionsToday={pomodoroData.sessionsToday}
            />
          </div>
          <div className="glass-morphism interactive-card hover-lift p-1 neon-glow-green holographic-border">
            <DailySummary />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="glass-morphism interactive-card hover-lift p-1 data-stream">
            <YouTubePlaylistTracker playlistId="PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz" />
          </div>
          <div className="glass-morphism interactive-card hover-lift p-1 holographic-border">
            <WeeklyProgressChart />
          </div>
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}
