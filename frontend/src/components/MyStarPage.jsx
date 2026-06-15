import React from 'react';
import styles from './MyStarPage.module.css';
import {
  IoArrowBack,
  IoCalendarOutline,
  IoFootballOutline,
  IoInformationCircleOutline,
  IoMedalOutline,
  IoPersonOutline,
  IoStar,
  IoTimeOutline,
  IoTrophyOutline,
} from 'react-icons/io5';

const statItems = [
  { label: 'Matches Played', value: '6', Icon: IoPersonOutline },
  { label: 'Goals', value: '4', Icon: IoFootballOutline },
  { label: 'Assists', value: '3', Icon: IoMedalOutline },
  { label: 'Player of the Match Awards', value: '2', Icon: IoStar },
  { label: 'Minutes Played', value: '540', Icon: IoTimeOutline },
];

function ProgressBar({ value, color = 'blue' }) {
  return (
    <div className={styles.progressTrack}>
      <span className={`${styles.progressFill} ${styles[color]}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function AwardArt({ type }) {
  return (
    <div className={`${styles.awardArt} ${styles[type]}`}>
      <span />
    </div>
  );
}

function StatusBadge({ children, tone = 'green' }) {
  return <span className={`${styles.statusBadge} ${styles[tone]}`}>{children}</span>;
}

function MyStarPage() {
  return (
    <section className={styles.myStarPage}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backButton}>
          <IoArrowBack />
          <span>Back to Players</span>
        </button>
        <button type="button" className={styles.tournamentSelect}>
          <IoTrophyOutline />
          <span>FIFA World Cup 2022</span>
        </button>
      </div>

      <div className={styles.playerHero}>
        <div className={styles.playerPortrait}>
          <div className={styles.playerSilhouette}>
            <span className={styles.captainBand}>C</span>
            <strong>10</strong>
          </div>
        </div>
        <div className={styles.playerInfo}>
          <h2>Player X</h2>
          <div className={styles.metaRow}>
            <span className={styles.argentinaShield} />
            <span>Argentina</span>
            <span>Forward</span>
            <span>Age 31</span>
          </div>
          <div className={styles.statsRow}>
            {statItems.map(({ label, value, Icon }) => (
              <div key={label} className={styles.statItem}>
                <Icon />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <header className={styles.awardsHeader}>
        <IoTrophyOutline />
        <div>
          <h2>Player Awards Dashboard</h2>
          <p>Track your progress across all individual awards in the tournament.</p>
        </div>
        <button type="button"><IoInformationCircleOutline /> How it works</button>
      </header>

      <div className={styles.awardsGrid}>
        <article className={`${styles.awardCard} ${styles.bootCard}`}>
          <div className={styles.awardIntro}>
            <AwardArt type="boot" />
            <div>
              <h3>Golden Boot</h3>
              <p>Awarded to the top goal scorer of the tournament.</p>
            </div>
            <StatusBadge>In Contention</StatusBadge>
          </div>
          <div className={styles.metricBox}>
            <div><span>Goals</span><strong>4</strong></div>
            <div><span>Tournament Leader</span><strong>K. Mbappe</strong><small>(7 goals)</small></div>
            <div><span>Rank</span><strong>#2</strong><small>out of all players</small></div>
            <div><span>Need</span><strong>3 more goals</strong><small>to take the lead</small></div>
          </div>
          <div className={styles.progressBox}>
            <div><span>Your Progress</span><strong>4 / 7</strong></div>
            <ProgressBar value={57} />
            <p>Goals needed to take the lead: 3</p>
          </div>
        </article>

        <article className={`${styles.awardCard} ${styles.ballCard}`}>
          <div className={styles.awardIntro}>
            <AwardArt type="ball" />
            <div>
              <h3>Golden Ball</h3>
              <p>Awarded to the best player of the tournament.</p>
            </div>
            <StatusBadge>In Contention</StatusBadge>
          </div>
          <div className={styles.stageBox}>
            <AwardArt type="stadium" />
            <div><span>Current Stage</span><strong>Quarter-final</strong><small>Team is in the Quarter-final</small></div>
          </div>
          <div className={styles.threeStats}>
            <div><span>Goals</span><strong>4</strong></div>
            <div><span>Assists</span><strong>3</strong></div>
            <div><span>Player of the Match Awards</span><strong>2</strong></div>
          </div>
          <div className={styles.scoreBox}>
            <div><span>Rank</span><strong>#3</strong><small>out of all players</small></div>
            <div>
              <span>Golden Ball Score</span>
              <strong>86.4 <small>/100</small></strong>
              <ProgressBar value={86} color="gold" />
              <small>Top player: K. Mbappe (92.1)</small>
            </div>
          </div>
        </article>

        <article className={`${styles.awardCard} ${styles.gloveCard}`}>
          <div className={styles.awardIntro}>
            <AwardArt type="glove" />
            <div>
              <h3>Golden Glove</h3>
              <p>Awarded to the best goalkeeper of the tournament.</p>
            </div>
            <StatusBadge tone="purple">Not Eligible</StatusBadge>
          </div>
          <div className={styles.lockedAward}>
            <span>🔒</span>
            <h3>Not Eligible</h3>
            <p>This award is only for goalkeepers.<br />Player X is a forward.</p>
          </div>
        </article>

        <article className={`${styles.awardCard} ${styles.youngCard}`}>
          <div className={styles.awardIntro}>
            <AwardArt type="young" />
            <div>
              <h3>Best Young Player</h3>
              <p>Awarded to the best player under 21 years old.</p>
            </div>
            <StatusBadge>Eligible</StatusBadge>
          </div>
          <div className={styles.eligibilityBox}>
            <span>Age Eligibility</span>
            <strong>Eligible</strong>
            <p>Player X is 31 years old.<br />(Must be 21 or younger)</p>
          </div>
          <div className={styles.threeStats}>
            <div><span>Goals</span><strong>4</strong></div>
            <div><span>Assists</span><strong>3</strong></div>
            <div><span>Rank</span><strong>#-</strong><small>not in top 10</small></div>
          </div>
          <div className={styles.progressBox}>
            <div><span>Top 10 Cutoff Score: <b>58.7</b></span><strong>46.2 /100</strong></div>
            <ProgressBar value={46} color="green" />
          </div>
        </article>
      </div>

      <footer className={styles.updateBar}>
        <span><IoCalendarOutline /> Stats and rankings update after every match</span>
        <span>Last updated: Dec 10, 2022 • 10:30 PM</span>
      </footer>
    </section>
  );
}

export default MyStarPage;
