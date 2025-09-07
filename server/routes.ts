import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // LeetCode API route
  app.get("/api/leetcode/:username", async (req, res) => {
    try {
      const { username } = req.params;
      
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
          recentSubmissionList(username: $username) {
            title
            timestamp
          }
        }
      `;

      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; ProductivityDashboard/1.0)',
        },
        body: JSON.stringify({
          query,
          variables: { username }
        })
      });

      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.data?.matchedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = data.data.matchedUser;
      const submissions = data.data.recentSubmissionList || [];
      
      // Calculate today's solved problems
      const today = new Date().toDateString();
      const todaysSolved = submissions.filter((sub: any) => 
        new Date(parseInt(sub.timestamp) * 1000).toDateString() === today
      ).length;

      // Calculate total solved
      const totalSolved = user.submitStats.acSubmissionNum.reduce(
        (total: number, item: any) => total + item.count, 0
      );

      // Calculate current streak (simplified - in real app would need more sophisticated logic)
      const currentStreak = calculateStreak(submissions);

      res.json({
        username: user.username,
        todaysSolved,
        currentStreak,
        totalSolved,
        dailyTarget: 2
      });

    } catch (error) {
      console.error('LeetCode API error:', error);
      res.status(500).json({ error: 'Failed to fetch LeetCode stats' });
    }
  });

  // YouTube playlist metadata route
  app.get("/api/youtube/playlist/:playlistId", async (req, res) => {
    try {
      const { playlistId } = req.params;
      const apiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY || "";
      
      if (!apiKey) {
        return res.status(500).json({ error: 'YouTube API key not configured' });
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      const videos = data.items?.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.medium?.url || '',
        position: item.snippet.position
      })) || [];

      res.json({ videos, total: videos.length });

    } catch (error) {
      console.error('YouTube API error:', error);
      res.status(500).json({ error: 'Failed to fetch YouTube playlist' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function calculateStreak(submissions: any[]): number {
  if (!submissions.length) return 0;
  
  const dates = submissions
    .map(sub => new Date(parseInt(sub.timestamp) * 1000).toDateString())
    .filter((date, index, arr) => arr.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  let streak = 0;
  const today = new Date().toDateString();
  let currentDate = new Date();
  
  for (const dateStr of dates) {
    const submissionDate = new Date(dateStr);
    const daysDiff = Math.floor((currentDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
      currentDate = submissionDate;
    } else {
      break;
    }
  }
  
  return streak;
}
