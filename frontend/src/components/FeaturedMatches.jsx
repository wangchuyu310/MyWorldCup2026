import React from 'react';
import styles from './FeaturedMatches.module.css';
import Flag from './Flag';

const FeaturedMatches = ({ matches, loading, timeZone }) => {
  const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const today = getLocalDateString(tz);
  
  let featured = matches.filter(match => {
    const matchDate = match.date || getMatchDateInZone(match.kickoff_at, tz);
    return matchDate === today;
  });
  
  if (featured.length === 0) {
    featured = matches.slice(0, 2);
  }

  return (
    <div className={styles.featuredMatches}>
      {featured.map((match) => (
        <div key={match.id} className={styles.matchCard}>
          <div className={styles.matchInfo}>
            <span className={styles.matchTime}>{formatMatchTime(match.kickoff_at, tz)}</span>
            {match.status === 'completed' && match.home_score !== null && (
              <span className={styles.score}>{match.home_score} - {match.away_score}</span>
            )}
            {match.status === 'live' && (
              <span className={styles.liveBadge}>LIVE</span>
            )}
          </div>
          <div className={`${styles.team} ${styles.homeTeam}`}>
            <span>{match.home_team}</span>
            <Flag country={match.home_team} />
          </div>
          <div className={styles.vs}>VS.</div>
          <div className={`${styles.team} ${styles.awayTeam}`}>
            <span>{match.away_team}</span>
            <Flag country={match.away_team} />
          </div>
        </div>
      ))}
      {loading && <div className={styles.loadingLine}>Syncing match data...</div>}
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
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz
  }).format(date);
}

export default FeaturedMatches;
