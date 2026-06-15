import React from 'react';
import styles from './MyTeamPage.module.css';
import {
  IoCheckmark,
  IoFlagOutline,
  IoInformationCircleOutline,
  IoLockClosed,
  IoPeople,
  IoRemove,
  IoTrophyOutline,
} from 'react-icons/io5';

const groupMatches = [
  {
    id: 1,
    title: 'Group Match 1',
    opponent: 'Brazil',
    venue: 'BC Place, Vancouver',
    result: '2 - 0',
    status: 'advanced',
  },
  {
    id: 2,
    title: 'Group Match 2',
    opponent: 'Japan',
    venue: 'Estadio Azteca, Mexico City',
    result: '1 - 1',
    status: 'current',
  },
  {
    id: 3,
    title: 'Group Match 3',
    opponent: 'Morocco',
    venue: 'Lincoln Financial Field, Philadelphia',
    result: '3 - 1',
    status: 'advanced',
  },
];

const knockoutStages = [
  'Round of 32',
  'Round of 16',
  'Quarter-final',
  'Semi-final',
];

const resultSections = [
  {
    title: 'Qualification Checkpoint',
    rows: [
      ['Position in Group', '2nd'],
      ['Qualified', 'Yes'],
    ],
    qualified: true,
  },
  {
    title: 'Round of 32',
    rows: [
      ['Opponent', '-'],
      ['Date', '-'],
      ['Result', '-'],
    ],
  },
  {
    title: 'Round of 16',
    rows: [
      ['Opponent', '-'],
      ['Date', '-'],
      ['Result', '-'],
    ],
  },
  {
    title: 'Quarter-final',
    rows: [
      ['Opponent', '-'],
      ['Date', '-'],
      ['Result', '-'],
    ],
  },
  {
    title: 'Semi-final',
    rows: [
      ['Opponent', '-'],
      ['Date', '-'],
      ['Result', '-'],
    ],
  },
];

function StatusIcon({ status }) {
  if (status === 'advanced') {
    return (
      <span className={`${styles.statusIcon} ${styles.advanced}`}>
        <IoCheckmark />
      </span>
    );
  }

  return (
    <span className={`${styles.statusIcon} ${styles.current}`}>
      <IoRemove />
    </span>
  );
}

function StadiumMark() {
  return (
    <span className={styles.stadiumMark}>
      <span />
    </span>
  );
}

function UkFlag() {
  return <span className={styles.ukFlag} aria-label="United Kingdom flag" />;
}

function LockedStage({ title }) {
  return (
    <div className={styles.lockedStage}>
      <span className={styles.stageIcon}>
        <IoTrophyOutline />
      </span>
      <div>
        <h3>{title}</h3>
        <p>1 Match</p>
      </div>
      <span className={styles.lockIcon}>
        <IoLockClosed />
      </span>
    </div>
  );
}

function MyTeamPage() {
  return (
    <section className={styles.myTeamPage}>
      <div className={styles.leftColumn}>
        <div className={styles.heroPanel}>
          <div>
            <p>Team Journey</p>
            <h2>Road to the Trophy</h2>
            <span>Follow your team's path in the World Cup</span>
          </div>
          <IoTrophyOutline className={styles.heroTrophy} />
        </div>

        <div className={styles.journeyPanel}>
          <div className={styles.groupIntro}>
            <span className={styles.peopleIcon}>
              <IoPeople />
            </span>
            <div>
              <h3>Group Stage</h3>
              <p>Top 2 or Best 8 Third-Place Teams advance to Round of 32</p>
            </div>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineRail} />
            <div className={styles.matchStack}>
              {groupMatches.map((match) => (
                <div key={match.id} className={styles.matchRow}>
                  <StadiumMark />
                  <span className={styles.stepNumber}>{match.id}</span>
                  <div className={styles.matchInfo}>
                    <h3>{match.title}</h3>
                    <p>vs {match.opponent}</p>
                    <span>{match.venue}</span>
                  </div>
                  <StatusIcon status={match.status} />
                </div>
              ))}
            </div>

            <div className={styles.checkpoint}>
              <span className={styles.flagNode}>
                <UkFlag />
              </span>
              <div className={styles.checkpointCard}>
                <IoFlagOutline />
                <div>
                  <h3>Qualification Checkpoint</h3>
                  <p>Top 2 or Best 8 Third-Place Teams</p>
                  <p>Advance to Round of 32</p>
                </div>
                <StatusIcon status="advanced" />
              </div>
            </div>

            <div className={styles.lockedStack}>
              {knockoutStages.map((stage) => (
                <LockedStage key={stage} title={stage} />
              ))}
            </div>

            <div className={styles.finalSplit}>
              <LockedStage title="Final" />
              <LockedStage title="Bronze Final" />
            </div>
          </div>

          <div className={styles.legend}>
            <span><StatusIcon status="advanced" /> Advanced</span>
            <span><span className={`${styles.statusIcon} ${styles.eliminated}`}>x</span> Eliminated</span>
            <span><StatusIcon status="current" /> Current Stage</span>
          </div>
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.selectedPanel}>
          <h3>Selected Team</h3>
          <div className={styles.teamCard}>
            <UkFlag />
            <div>
              <strong>United Kingdom</strong>
              <span>United Kingdom</span>
            </div>
          </div>
        </div>

        <div className={styles.resultsPanel}>
          <h2>Match Results</h2>
          <div className={styles.resultCard}>
            <h3>Group Stage</h3>
            {groupMatches.map((match) => (
              <div key={match.id} className={styles.resultRow}>
                <div>
                  <span>Match {match.id}</span>
                  <strong>vs {match.opponent}</strong>
                </div>
                <b className={match.status === 'current' ? styles.drawScore : styles.winScore}>
                  {match.result}
                </b>
                <StatusIcon status={match.status} />
              </div>
            ))}
          </div>

          {resultSections.map((section) => (
            <div key={section.title} className={styles.resultCard}>
              <h3>{section.title}<span>-</span></h3>
              {section.rows.map(([label, value]) => (
                <div key={label} className={styles.detailRow}>
                  <span>{label}</span>
                  <strong>{section.qualified && label === 'Qualified' ? <><StatusIcon status="advanced" /> {value}</> : value}</strong>
                </div>
              ))}
            </div>
          ))}

          <div className={styles.smallFinals}>
            <div className={styles.resultCard}>
              <h3>Final <span>-</span></h3>
              <div className={styles.detailRow}><span>Opponent</span><strong>-</strong></div>
              <div className={styles.detailRow}><span>Date</span><strong>-</strong></div>
              <div className={styles.detailRow}><span>Result</span><strong>-</strong></div>
            </div>
            <div className={styles.resultCard}>
              <h3>Bronze Final <span>-</span></h3>
              <div className={styles.detailRow}><span>Opponent</span><strong>-</strong></div>
              <div className={styles.detailRow}><span>Date</span><strong>-</strong></div>
              <div className={styles.detailRow}><span>Result</span><strong>-</strong></div>
            </div>
          </div>

          <div className={styles.infoNote}>
            <IoInformationCircleOutline />
            <p>The road is tough.<br />But every step brings you closer to glory.<br /><strong>Go UK!</strong></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyTeamPage;
