"use client";

import { useState, useEffect } from "react";

interface Stats {
  linksCreated: number;
  activeUsers: number;
  lastUpdated: number;
}

const BASE_LINKS = 100;
const BASE_USERS = 10;

export function useIncreasingStats() {
  const [stats, setStats] = useState<Stats>({
    linksCreated: BASE_LINKS,
    activeUsers: BASE_USERS,
    lastUpdated: Date.now(),
  });

  useEffect(() => {
    // Fetch global stats from server (same for everyone)
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/global');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep using current stats on error
      }
    };

    // Load stats immediately
    fetchStats();

    // Refresh stats every 5 minutes to get updated numbers
    const refreshInterval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  return {
    linksCreated: stats.linksCreated,
    activeUsers: stats.activeUsers,
  };
}
