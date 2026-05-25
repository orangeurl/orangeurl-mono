import { NextResponse } from 'next/server';

// Base starting values
const BASE_LINKS = 100;
const BASE_USERS = 10;
const START_DATE = new Date('2025-11-02').getTime(); // Today - when we started counting

// Seeded random number generator for consistency
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export async function GET() {
  try {
    // Calculate time elapsed since start
    const now = Date.now();
    const elapsedMs = now - START_DATE;
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

    // Calculate increases (same for everyone, but random per day)
    let totalLinksIncrease = 0;
    let totalUsersIncrease = 0;

    // For each day that has passed, add a random amount
    for (let day = 0; day < elapsedDays; day++) {
      // Use day as seed for consistent random values
      const linksSeed = START_DATE + day * 1000;
      const usersSeed = START_DATE + day * 2000;

      // Random increase: Links [0-100], Users [0-9]
      totalLinksIncrease += Math.floor(seededRandom(linksSeed) * 101); // 0-100
      totalUsersIncrease += Math.floor(seededRandom(usersSeed) * 10);  // 0-9
    }

    const linksCreated = BASE_LINKS + totalLinksIncrease;
    const activeUsers = BASE_USERS + totalUsersIncrease;

    return NextResponse.json({
      linksCreated,
      activeUsers,
      lastUpdated: now,
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return NextResponse.json(
      { linksCreated: BASE_LINKS, activeUsers: BASE_USERS, lastUpdated: Date.now() },
      { status: 500 }
    );
  }
}
