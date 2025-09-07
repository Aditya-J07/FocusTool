import { Card, CardContent } from "@/components/ui/card";

interface GamificationStatsProps {
  level: number;
  xp: number;
  streak: number;
  todayXP: number;
}

const levelTitles = [
  "Newbie",
  "Beginner",
  "Apprentice", 
  "Consistency Builder",
  "Focus Seeker",
  "Progress Maker",
  "Consistency Ninja",
  "Productivity Master",
  "Efficiency Expert",
  "Achievement Unlocked"
];

export default function GamificationStats({ level, xp, streak, todayXP }: GamificationStatsProps) {
  const maxXpForLevel = level * 200; // Each level requires more XP
  const xpProgress = (xp % maxXpForLevel) / maxXpForLevel * 100;
  const currentLevelTitle = levelTitles[Math.min(level - 1, levelTitles.length - 1)];

  return (
    <Card className="mb-6" data-testid="gamification-stats">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="level-badge text-white px-4 py-2 rounded-full font-bold text-sm" data-testid="level-badge">
              Level {level} - {currentLevelTitle}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">XP:</span>
              <div className="bg-secondary rounded-full h-3 w-32">
                <div 
                  className="bg-accent h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${xpProgress}%` }}
                  data-testid="progress-bar-xp"
                />
              </div>
              <span className="text-sm font-medium" data-testid="text-xp-progress">
                {xp} / {maxXpForLevel}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="streak-flame text-2xl">🔥</span>
              <span className="font-bold text-lg" data-testid="text-streak">{streak}</span>
              <span className="text-sm text-muted-foreground">day streak</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Today's XP</div>
              <div className="font-bold text-lg text-accent" data-testid="text-today-xp">+{todayXP} XP</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
