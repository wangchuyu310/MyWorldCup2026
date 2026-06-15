import React from 'react';
import styles from './UpcomingMatches.module.css';
import Flag from './Flag';

const UpcomingMatches = ({ matches }) => {
  const upcoming = matches.slice(0, 4);

  return (
    <div className={styles.upcomingMatches}>
        <div className={styles.header}>
            <h2>UPCOMING MATCHES</h2>
            <a href="#">View Full Schedule &gt;</a>
        </div>
      <div className={styles.matchesGrid}>
        {upcoming.map((match) => (
          <div key={match.id} className={styles.matchCard}>
            <div className={styles.time}>{formatMatchTime(match.kickoff_at)}</div>
            <div className={styles.teams}>
                <Flag country={match.home_team} compact />
                <span>VS</span>
                <Flag country={match.away_team} compact />
            </div>
            <div className={styles.venue}>{match.venue}</div>
            <div className={styles.location}>{match.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

function formatMatchTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'JUN 14, 13:00';
  }

  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return `${month} ${day}, ${time}`;
}

export default UpcomingMatches;
