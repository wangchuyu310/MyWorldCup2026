import React from 'react';
import styles from './FeaturedMatches.module.css';
import Flag from './Flag';

const FeaturedMatches = ({ matches, loading }) => {
  const featured = matches.slice(0, 2);

  return (
    <div className={styles.featuredMatches}>
      {featured.map((match) => (
        <div key={match.id} className={styles.matchCard}>
          <div className={styles.team}>
            <span>Country Name</span>
            <Flag country={match.home_team} />
          </div>
          <div className={styles.vs}>VS.</div>
          <div className={styles.team}>
            <span>Country Name</span>
            <Flag country={match.away_team} />
          </div>
        </div>
      ))}
      {loading && <div className={styles.loadingLine}>Syncing match data...</div>}
    </div>
  );
};

export default FeaturedMatches;
