import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/hooks/useTimer";
import { useAudio } from "@/hooks/useAudio";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Play, Pause, Square, Maximize } from "lucide-react";

interface PomodoroTimerProps {
  onEnterFocusMode: () => void;
  sessionsToday: number;
}

export default function PomodoroTimer({ onEnterFocusMode, sessionsToday }: PomodoroTimerProps) {
  const [settings] = useLocalStorage('pomodoro-settings', {
    focusTime: 25 * 60, // 25 minutes
    breakTime: 5 * 60,  // 5 minutes
  });

  const [currentMode, setCurrentMode] = useState<'focus' | 'break'>('focus');
  const [pomodoroData, setPomodoroData] = useLocalStorage('pomodoro-data', {
    sessionsToday: 0,
    totalSessions: 0,
    lastSessionDate: new Date().toISOString().split('T')[0]
  });

  const initialTime = currentMode === 'focus' ? settings.focusTime : settings.breakTime;
  const { timeLeft, isRunning, start, pause, reset } = useTimer(initialTime);
  const { play: playAlert } = useAudio('/sounds/timer-complete.mp3');

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const progress = ((initialTime - timeLeft) / initialTime) * 100;
  const circumference = 2 * Math.PI * 45; // radius is 45%
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      playAlert();
      
      if (currentMode === 'focus') {
        // Focus session completed
        const today = new Date().toISOString().split('T')[0];
        if (pomodoroData.lastSessionDate === today) {
          setPomodoroData(prev => ({
            ...prev,
            sessionsToday: prev.sessionsToday + 1,
            totalSessions: prev.totalSessions + 1
          }));
        } else {
          setPomodoroData(prev => ({
            ...prev,
            sessionsToday: 1,
            totalSessions: prev.totalSessions + 1,
            lastSessionDate: today
          }));
        }
        setCurrentMode('break');
      } else {
        setCurrentMode('focus');
      }
      reset();
    }
  }, [timeLeft, isRunning, currentMode, playAlert, reset, pomodoroData, setPomodoroData]);

  const handleStart = () => {
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleReset = () => {
    reset();
    setCurrentMode('focus');
  };

  return (
    <Card data-testid="pomodoro-timer">
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center">
            <i className="fas fa-clock text-red-500 mr-2"></i>
            Pomodoro Timer
          </h3>
          
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                stroke="rgba(239, 68, 68, 0.2)" 
                strokeWidth="6" 
                fill="transparent" 
                r="45%" 
                cx="50%" 
                cy="50%"
              />
              <circle
                stroke="#ef4444"
                strokeWidth="6"
                fill="transparent"
                r="45%"
                cx="50%"
                cy="50%"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 1s linear'
                }}
                data-testid="progress-circle-timer"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold" data-testid="text-timer-display">{displayTime}</div>
                <div className="text-xs text-muted-foreground" data-testid="text-timer-mode">
                  {currentMode === 'focus' ? 'Focus' : 'Break'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-center space-x-2">
              <Button
                onClick={handleStart}
                disabled={isRunning}
                className="bg-green-500 hover:bg-green-600 text-white p-3"
                data-testid="button-start-timer"
              >
                <Play className="w-4 h-4" />
              </Button>
              <Button
                onClick={handlePause}
                disabled={!isRunning}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-3"
                data-testid="button-pause-timer"
              >
                <Pause className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white p-3"
                data-testid="button-reset-timer"
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={onEnterFocusMode}
              className="bg-accent hover:bg-accent/90 text-accent-foreground w-full glow"
              data-testid="button-focus-mode"
            >
              <Maximize className="w-4 h-4 mr-2" />
              Focus Mode
            </Button>
            
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Sessions Today</div>
              <div className="font-bold text-accent" data-testid="text-sessions-today">{pomodoroData.sessionsToday}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
