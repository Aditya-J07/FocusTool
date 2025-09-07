import { z } from "zod";

export const leetcodeStatsSchema = z.object({
  username: z.string(),
  todaysSolved: z.number().default(0),
  currentStreak: z.number().default(0),
  totalSolved: z.number().default(0),
  dailyTarget: z.number().default(2),
});

export const userProgressSchema = z.object({
  id: z.string(),
  level: z.number().default(1),
  xp: z.number().default(0),
  streak: z.number().default(0),
  todayXP: z.number().default(0),
  lastActiveDate: z.string().optional(),
});

export const pomodoroSessionSchema = z.object({
  id: z.string(),
  date: z.string(),
  sessionsCompleted: z.number().default(0),
  totalFocusTime: z.number().default(0),
});

export const playlistProgressSchema = z.object({
  playlistId: z.string(),
  videoId: z.string(),
  title: z.string(),
  completed: z.boolean().default(false),
  completedAt: z.string().optional(),
});

export type LeetcodeStats = z.infer<typeof leetcodeStatsSchema>;
export type UserProgress = z.infer<typeof userProgressSchema>;
export type PomodoroSession = z.infer<typeof pomodoroSessionSchema>;
export type PlaylistProgress = z.infer<typeof playlistProgressSchema>;
