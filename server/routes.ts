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

  // Last.fm API routes
  app.get("/api/lastfm/user/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const apiKey = "e49833a1003c14b3b187fa087ef0ed2c";
      
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${apiKey}&format=json`
      );

      if (!response.ok) {
        throw new Error(`Last.fm API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        return res.status(404).json({ error: data.message || 'User not found' });
      }

      res.json({
        username: data.user.name,
        realname: data.user.realname || '',
        playcount: parseInt(data.user.playcount || '0'),
        registered: data.user.registered?.unixtime ? new Date(parseInt(data.user.registered.unixtime) * 1000).toISOString() : null
      });

    } catch (error) {
      console.error('Last.fm API error:', error);
      res.status(500).json({ error: 'Failed to fetch Last.fm user info' });
    }
  });

  app.get("/api/lastfm/user/:username/recent", async (req, res) => {
    try {
      const { username } = req.params;
      const apiKey = "e49833a1003c14b3b187fa087ef0ed2c";
      const limit = req.query.limit || '10';
      
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Last.fm API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        return res.status(404).json({ error: data.message || 'User not found' });
      }

      const tracks = data.recenttracks?.track || [];
      const formattedTracks = Array.isArray(tracks) ? tracks : [tracks];

      const processedTracks = formattedTracks.map((track: any, index: number) => ({
        id: `${track.artist?.['#text'] || 'Unknown'}-${track.name || 'Unknown'}-${index}`,
        title: track.name || 'Unknown Track',
        artist: track.artist?.['#text'] || 'Unknown Artist',
        album: track.album?.['#text'] || '',
        image: track.image?.find((img: any) => img.size === 'medium')?.['#text'] || '',
        nowPlaying: track['@attr']?.nowplaying === 'true',
        playedAt: track.date ? new Date(parseInt(track.date.uts) * 1000).toISOString() : null
      }));

      res.json({
        tracks: processedTracks,
        total: processedTracks.length
      });

    } catch (error) {
      console.error('Last.fm recent tracks API error:', error);
      res.status(500).json({ error: 'Failed to fetch recent tracks' });
    }
  });

  app.get("/api/lastfm/user/:username/toptracks", async (req, res) => {
    try {
      const { username } = req.params;
      const apiKey = "e49833a1003c14b3b187fa087ef0ed2c";
      const limit = req.query.limit || '10';
      const period = req.query.period || '7day'; // overall, 7day, 1month, 3month, 6month, 12month
      
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&format=json&limit=${limit}&period=${period}`
      );

      if (!response.ok) {
        throw new Error(`Last.fm API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        return res.status(404).json({ error: data.message || 'User not found' });
      }

      const tracks = data.toptracks?.track || [];
      const formattedTracks = Array.isArray(tracks) ? tracks : [tracks];

      const processedTracks = formattedTracks.map((track: any, index: number) => ({
        id: `${track.artist?.name || 'Unknown'}-${track.name || 'Unknown'}-${index}`,
        title: track.name || 'Unknown Track',
        artist: track.artist?.name || 'Unknown Artist',
        playcount: parseInt(track.playcount || '0'),
        rank: parseInt(track['@attr']?.rank || index + 1),
        image: track.image?.find((img: any) => img.size === 'medium')?.['#text'] || ''
      }));

      res.json({
        tracks: processedTracks,
        period: period,
        total: processedTracks.length
      });

    } catch (error) {
      console.error('Last.fm top tracks API error:', error);
      res.status(500).json({ error: 'Failed to fetch top tracks' });
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
