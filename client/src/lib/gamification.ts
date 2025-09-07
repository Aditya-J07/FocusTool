interface UserProgress {
  id: string;
  level: number;
  xp: number;
  streak: number;
  todayXP: number;
  lastActiveDate?: string;
}

export function calculateLevel(xp: number): number {
  // Level progression: 200, 400, 800, 1600, 3200, etc.
  let level = 1;
  let requiredXP = 200;
  let currentXP = xp;

  while (currentXP >= requiredXP) {
    currentXP -= requiredXP;
    level++;
    requiredXP = level * 200;
  }

  return level;
}

export function getXPForNextLevel(currentXP: number, currentLevel: number): number {
  const xpSpentOnPreviousLevels = Array.from({ length: currentLevel - 1 }, (_, i) => (i + 1) * 200)
    .reduce((sum, xp) => sum + xp, 0);
  
  const xpInCurrentLevel = currentXP - xpSpentOnPreviousLevels;
  const xpRequiredForCurrentLevel = currentLevel * 200;
  
  return xpRequiredForCurrentLevel - xpInCurrentLevel;
}

export function awardXP(
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void,
  xpAmount: number,
  reason: string
) {
  setUserProgress((prev) => {
    const newXP = prev.xp + xpAmount;
    const newLevel = calculateLevel(newXP);
    const today = new Date().toISOString().split('T')[0];
    
    // Check if this is a new day
    const isNewDay = prev.lastActiveDate !== today;
    const newStreak = isNewDay ? prev.streak + 1 : prev.streak;
    
    const updatedProgress = {
      ...prev,
      xp: newXP,
      level: newLevel,
      streak: newStreak,
      todayXP: isNewDay ? xpAmount : prev.todayXP + xpAmount,
      lastActiveDate: today
    };

    // Show level up notification if level increased
    if (newLevel > prev.level) {
      // You could trigger a toast here
      console.log(`Level Up! You are now level ${newLevel}!`);
    }

    console.log(`+${xpAmount} XP: ${reason}`);
    return updatedProgress;
  });
}

export function updateStreak(
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void
) {
  setUserProgress((prev) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (prev.lastActiveDate === yesterday) {
      // Continuing streak
      return {
        ...prev,
        streak: prev.streak + 1,
        lastActiveDate: today
      };
    } else if (prev.lastActiveDate !== today) {
      // Starting new streak or broken streak
      return {
        ...prev,
        streak: 1,
        lastActiveDate: today
      };
    }
    
    return prev;
  });
}
