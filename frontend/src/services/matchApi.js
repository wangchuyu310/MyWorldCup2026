import axios from 'axios';
import { matchResultsData } from '../data/matchResultsData';

// Cloudflare Worker API URL (set in environment variable)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let cachedResults = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30000; // 30秒缓存

export async function fetchMatchResults() {
  const now = Date.now();
  if (cachedResults && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedResults;
  }

  // If no API URL is set, use local data (fallback for development)
  if (!API_BASE_URL) {
    console.log('No API_BASE_URL set, using local data');
    cachedResults = matchResultsData;
    lastFetchTime = now;
    return cachedResults;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/schedule/manual-results`);
    cachedResults = response.data;
    lastFetchTime = now;
    return cachedResults;
  } catch (err) {
    console.error('Failed to fetch match results from API, using local data:', err);
    // Fallback to local data if API fails
    cachedResults = matchResultsData;
    lastFetchTime = now;
    return cachedResults;
  }
}

export function clearMatchResultsCache() {
  cachedResults = null;
  lastFetchTime = 0;
}

export function getTeamGroupResults(teamName, scheduleMatches, matchResults) {
  const resultsByMatchNo = matchResults?.resultsByMatchNo || {};

  const teamGroupMatches = scheduleMatches.filter(
    (match) =>
      match.stage === 'Group Stage' &&
      (match.teamA === teamName || match.teamB === teamName)
  );

  let played = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  let points = 0;

  teamGroupMatches.forEach((match) => {
    const result = resultsByMatchNo[String(match.matchNo)];
    if (!result || !result.result) return;

    const isHome = match.teamA === teamName;
    const homeScore = result.homeScore ?? null;
    const awayScore = result.awayScore ?? null;

    if (homeScore === null || awayScore === null) return;

    played++;
    const myScore = isHome ? homeScore : awayScore;
    const oppScore = isHome ? awayScore : homeScore;
    goalsFor += myScore;
    goalsAgainst += oppScore;

    if (myScore > oppScore) {
      wins++;
      points += 3;
    } else if (myScore === oppScore) {
      draws++;
      points += 1;
    } else {
      losses++;
    }
  });

  return {
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points,
    matches: teamGroupMatches,
  };
}

export function getGroupStandings(groupName, scheduleMatches, matchResults) {
  const resultsByMatchNo = matchResults?.resultsByMatchNo || {};

  const groupMatches = scheduleMatches.filter(
    (match) => match.stage === 'Group Stage' && match.group === groupName
  );

  const teamsInGroup = new Set();
  groupMatches.forEach((match) => {
    teamsInGroup.add(match.teamA);
    teamsInGroup.add(match.teamB);
  });

  const standings = [];
  teamsInGroup.forEach((teamName) => {
    const stats = getTeamGroupResults(teamName, scheduleMatches, matchResults);
    standings.push({ team: teamName, ...stats });
  });

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.localeCompare(b.team);
  });

  standings.forEach((team, index) => {
    team.position = index + 1;
  });

  return standings;
}

export function isTeamQualified(teamName, scheduleMatches, matchResults) {
  const groupMatch = scheduleMatches.find(
    (match) =>
      match.stage === 'Group Stage' &&
      (match.teamA === teamName || match.teamB === teamName)
  );

  if (!groupMatch) return false;

  const standings = getGroupStandings(groupMatch.group, scheduleMatches, matchResults);
  const teamStanding = standings.find((s) => s.team === teamName);

  if (!teamStanding) return false;

  // 前2名直接晋级
  if (teamStanding.position <= 2) return true;

  // 第3名需要比较所有小组第3
  if (teamStanding.position === 3) {
    const allThirdPlaces = [];
    const groups = new Set(
      scheduleMatches
        .filter((m) => m.stage === 'Group Stage')
        .map((m) => m.group)
    );

    groups.forEach((group) => {
      const groupStandings = getGroupStandings(group, scheduleMatches, matchResults);
      if (groupStandings[2]) {
        allThirdPlaces.push(groupStandings[2]);
      }
    });

    allThirdPlaces.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.team.localeCompare(b.team);
    });

    const rankAmongThird = allThirdPlaces.findIndex((t) => t.team === teamName) + 1;
    return rankAmongThird <= 8;
  }

  return false;
}
