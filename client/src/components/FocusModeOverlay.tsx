import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/hooks/useTimer";
import { X, Pause, Play } from "lucide-react";

interface FocusModeOverlayProps {
  onExit: () => void;
}

export default function FocusModeOverlay({ onExit }: FocusModeOverlayProps) {
  const { timeLeft, isRunning, start, pause, reset } = useTimer(25 * 60); // 25 minutes
  const [currentMode, setCurrentMode] = useState<'focus' | 'break'>('focus');

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalTime = currentMode === 'focus' ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const circumference = 2 * Math.PI * 45; // radius is 45%
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      if (currentMode === 'focus') {
        setCurrentMode('break');
        reset(5 * 60); // 5 minute break
      } else {
        setCurrentMode('focus');
        reset(25 * 60); // 25 minute focus
      }
    }
  }, [timeLeft, isRunning, currentMode, reset]);

  useEffect(() => {
    // Start timer immediately when focus mode opens
    start();
  }, [start]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 z-50 flex items-center justify-center" data-testid="focus-mode-overlay">
      <div className="text-center text-white">
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="8" 
              fill="transparent" 
              r="45%" 
              cx="50%" 
              cy="50%"
            />
            <circle
              stroke="#ffffff"
              strokeWidth="8"
              fill="transparent"
              r="45%"
              cx="50%"
              cy="50%"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: 'stroke-dashoffset 1s linear'
              }}
              data-testid="progress-circle-focus"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold" data-testid="text-focus-timer">{displayTime}</div>
              <div className="text-xl opacity-80" data-testid="text-focus-mode">
                {currentMode === 'focus' ? 'Focus Session' : 'Break Time'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isRunning ? pause : start}
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            data-testid="button-pause-focus"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Resume
              </>
            )}
          </Button>
          
          <Button
            onClick={onExit}
            className="bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            data-testid="button-exit-focus"
          >
            <X className="w-5 h-5 mr-2" />
            Exit Focus Mode
          </Button>
        </div>
      </div>
    </div>
  );
}
