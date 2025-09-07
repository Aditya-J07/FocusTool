import { type UserProgress, type PomodoroSession, type PlaylistProgress } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUserProgress(id: string): Promise<UserProgress | undefined>;
  updateUserProgress(progress: UserProgress): Promise<UserProgress>;
  getPomodoroSession(date: string): Promise<PomodoroSession | undefined>;
  updatePomodoroSession(session: PomodoroSession): Promise<PomodoroSession>;
  getPlaylistProgress(playlistId: string): Promise<PlaylistProgress[]>;
  updatePlaylistProgress(progress: PlaylistProgress): Promise<PlaylistProgress>;
}

export class MemStorage implements IStorage {
  private userProgress: Map<string, UserProgress> = new Map();
  private pomodoroSessions: Map<string, PomodoroSession> = new Map();
  private playlistProgress: Map<string, PlaylistProgress[]> = new Map();

  async getUserProgress(id: string): Promise<UserProgress | undefined> {
    return this.userProgress.get(id);
  }

  async updateUserProgress(progress: UserProgress): Promise<UserProgress> {
    this.userProgress.set(progress.id, progress);
    return progress;
  }

  async getPomodoroSession(date: string): Promise<PomodoroSession | undefined> {
    return this.pomodoroSessions.get(date);
  }

  async updatePomodoroSession(session: PomodoroSession): Promise<PomodoroSession> {
    this.pomodoroSessions.set(session.date, session);
    return session;
  }

  async getPlaylistProgress(playlistId: string): Promise<PlaylistProgress[]> {
    return this.playlistProgress.get(playlistId) || [];
  }

  async updatePlaylistProgress(progress: PlaylistProgress): Promise<PlaylistProgress> {
    const existing = this.playlistProgress.get(progress.playlistId) || [];
    const index = existing.findIndex(p => p.videoId === progress.videoId);
    
    if (index >= 0) {
      existing[index] = progress;
    } else {
      existing.push(progress);
    }
    
    this.playlistProgress.set(progress.playlistId, existing);
    return progress;
  }
}

export const storage = new MemStorage();
