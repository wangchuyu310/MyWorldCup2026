import React from 'react';
import styles from './UpcomingMatches.module.css';
import Flag from './Flag';

const UpcomingMatches = ({ matches, timeZone, onViewSchedule }) => {
  const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const today = getLocalDateString(tz);
  
  const nextMatchDate = matches
    .map((match) => match.date || getMatchDateInZone(match.kickoff_at, tz))
    .filter((matchDate) => matchDate > today)
    .sort()[0];

  let upcoming = nextMatchDate
    ? matches.filter((match) => (match.date || getMatchDateInZone(match.kickoff_at, tz)) === nextMatchDate)
    : [];

  if (upcoming.length === 0) {
    const firstMatchDate = matches
      .map((match) => match.date || getMatchDateInZone(match.kickoff_at, tz))
      .sort()[0];

    upcoming = firstMatchDate
      ? matches.filter((match) => (match.date || getMatchDateInZone(match.kickoff_at, tz)) === firstMatchDate)
      : matches;
  }

  return (
    <div className={styles.upcomingMatches}>
        <div className={styles.header}>
            <h2>UPCOMING MATCHES</h2>
            <button type="button" onClick={onViewSchedule}>View Full Schedule &gt;</button>
        </div>
      <div className={styles.matchesGrid}>
        {upcoming.map((match) => (
          <div key={match.id} className={styles.matchCard}>
            <div className={styles.time}>{formatMatchTime(match.kickoff_at, tz)}</div>
            <div className={styles.teams}>
                <div className={styles.teamInfo}>
                    <Flag country={match.home_team} compact />
                    <span className={styles.teamName}>{match.home_team}</span>
                </div>
                <span className={styles.vsText}>VS</span>
                <div className={styles.teamInfo}>
                    <Flag country={match.away_team} compact />
                    <span className={styles.teamName}>{match.away_team}</span>
                </div>
            </div>
            <div className={styles.venue}>{match.venue}</div>
            <div className={styles.location}>{match.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getLocalDateString(tz) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: tz
  }).formatToParts(now);
  const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${partMap.year}-${partMap.month}-${partMap.day}`;
}

function getMatchDateInZone(value, tz) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '9999-99-99';
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: tz
  }).formatToParts(date);
  const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${partMap.year}-${partMap.month}-${partMap.day}`;
}

function formatMatchTime(value, tz) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'TBD';

  const parts = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz
  }).formatToParts(date);
  const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return `${partMap.month.toUpperCase()} ${partMap.day}, ${partMap.hour}:${partMap.minute}`;
}

export default UpcomingMatches;
