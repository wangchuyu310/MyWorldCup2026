import React, { useEffect, useMemo, useState } from 'react';
import styles from './MyTeamPage.module.css';
import Flag from './Flag';
import { scheduleMatches } from '../data/scheduleData';
import {
  fetchMatchResults,
  getTeamGroupResults,
  getGroupStandings,
  isTeamQualified,
} from '../services/matchApi';
import {
  IoChevronDown,
  IoFlagOutline,
  IoInformationCircleOutline,
  IoLockClosed,
  IoPeople,
  IoShareSocial,
  IoTrophyOutline,
} from 'react-icons/io5';
import ShareCard from './ShareCard';

function isNationalTeam(value) {
  return value && !/^(?:[123][A-Z]+|W\d+|Winner Match \d+|Loser Match \d+)$/i.test(value);
}

import StatusIcon from './StatusIcon';

function StadiumMark() {
  return (
    <span className={styles.stadiumMark}>
      <span />
    </span>
  );
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
  const [selectedTeam, setSelectedTeam] = useState('England');
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [matchResults, setMatchResults] = useState({ resultsByMatchNo: {} });
  const [loading, setLoading] = useState(true);
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadResults = async () => {
      try {
        const results = await fetchMatchResults();
        if (mounted) {
          setMatchResults(results);
        }
      } catch (err) {
        console.error('Failed to load match results:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadResults();

    // 每30秒刷新一次数据
    const interval = setInterval(loadResults, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const nationalTeams = useMemo(() => {
    const teams = scheduleMatches.flatMap((match) => [match.teamA, match.teamB]).filter(isNationalTeam);
    return [...Array.from(new Set(teams)).sort((a, b) => a.localeCompare(b))];
  }, []);

  const teamStats = useMemo(() => {
    return getTeamGroupResults(selectedTeam, scheduleMatches, matchResults);
  }, [selectedTeam, matchResults]);

  const groupStandings = useMemo(() => {
    const groupMatch = scheduleMatches.find(
      (match) =>
        match.stage === 'Group Stage' &&
        (match.teamA === selectedTeam || match.teamB === selectedTeam)
    );
    if (!groupMatch) return [];
    return getGroupStandings(groupMatch.group, scheduleMatches, matchResults);
  }, [selectedTeam, matchResults]);

  const teamPosition = useMemo(() => {
    const standing = groupStandings.find((s) => s.team === selectedTeam);
    return standing ? standing.position : '-';
  }, [groupStandings, selectedTeam]);

  const qualified = useMemo(() => {
    return isTeamQualified(selectedTeam, scheduleMatches, matchResults);
  }, [selectedTeam, matchResults]);

  const teamMatches = useMemo(() => {
    return scheduleMatches.filter(
      (match) => match.teamA === selectedTeam || match.teamB === selectedTeam
    );
  }, [selectedTeam]);

  const groupMatches = useMemo(() => {
    const resultsByMatchNo = matchResults?.resultsByMatchNo || {};

    return teamMatches
      .filter((match) => match.stage === 'Group Stage')
      .map((match, index) => {
        const isHome = match.teamA === selectedTeam;
        const opponent = isHome ? match.teamB : match.teamA;
        const venue = `${match.stadium}, ${match.city}`;
        let result = '-';
        let status = 'scheduled';

        const savedResult = resultsByMatchNo[String(match.matchNo)];
        if (savedResult && savedResult.result) {
          const homeScore = savedResult.homeScore;
          const awayScore = savedResult.awayScore;

          if (homeScore !== null && awayScore !== null) {
            const myScore = isHome ? homeScore : awayScore;
            const oppScore = isHome ? awayScore : homeScore;
            result = `${myScore} - ${oppScore}`;

            if (myScore > oppScore) status = 'advanced';
            else if (myScore < oppScore) status = 'eliminated';
            else status = 'current';
          }
        } else if (match.result) {
          const scoreMatch = match.result.match(/(\d+)-(\d+)/);
          if (scoreMatch) {
            const homeScore = parseInt(scoreMatch[1], 10);
            const awayScore = parseInt(scoreMatch[2], 10);
            const myScore = isHome ? homeScore : awayScore;
            const oppScore = isHome ? awayScore : homeScore;
            result = `${myScore} - ${oppScore}`;

            if (myScore > oppScore) status = 'advanced';
            else if (myScore < oppScore) status = 'eliminated';
            else status = 'current';
          }
        }

        return {
          id: index + 1,
          title: `Group Match ${index + 1}`,
          opponent,
          venue,
          result,
          status,
          date: match.date,
          kickoff: match.kickoffET,
        };
      });
  }, [teamMatches, selectedTeam, matchResults]);

  const knockoutStages = [
    'Round of 32',
    'Round of 16',
    'Quarter-final',
    'Semi-final',
  ];

  const resultSections = useMemo(() => {
    const hasPlayed = groupMatches.some((m) => m.status !== 'scheduled');
    const allCompleted = groupMatches.every((m) => m.status !== 'scheduled');

    return [
      {
        title: 'Qualification Checkpoint',
        rows: [
          ['Position in Group', hasPlayed ? `${teamPosition}${getOrdinalSuffix(teamPosition)}` : '-'],
          ['Qualified', allCompleted ? (qualified ? 'Yes' : 'No') : '-'],
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
  }, [groupMatches, teamPosition, qualified]);

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setIsTeamMenuOpen(false);
  };

  const checkpointStatus = useMemo(() => {
    if (loading) return 'current';
    const allCompleted = groupMatches.every((m) => m.status !== 'scheduled');
    if (!allCompleted) return 'current';
    return qualified ? 'advanced' : 'eliminated';
  }, [groupMatches, qualified, loading]);

  return (
    <>
    <section className={styles.myTeamPage}>
      <div className={styles.leftColumn}>
        <div className={styles.heroPanel}>
          <div>
            <p>Team Journey</p>
            <h2>Road to the Trophy</h2>
            <span>Follow your team&apos;s path in the World Cup</span>
          </div>
          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.shareBtn}
              onClick={() => setShowShareCard(true)}
              aria-label="Share"
            >
              <IoShareSocial />
              <span>Share</span>
            </button>
            <IoTrophyOutline className={styles.heroTrophy} />
          </div>
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
                    <span className={styles.matchDate}>{match.date} {match.kickoff} ET</span>
                  </div>
                  <StatusIcon status={match.status} />
                </div>
              ))}
            </div>

            <div className={styles.checkpoint}>
              <span className={styles.flagNode}>
                <Flag country={selectedTeam} compact className={styles.checkpointFlag} />
              </span>
              <div className={styles.checkpointCard}>
                <IoFlagOutline />
                <div>
                  <h3>Qualification Checkpoint</h3>
                  <p>Top 2 or Best 8 Third-Place Teams</p>
                  <p>Advance to Round of 32</p>
                </div>
                <StatusIcon status={checkpointStatus} />
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
            <span><StatusIcon status="advanced" /> Won</span>
            <span><StatusIcon status="eliminated" /> Lost</span>
            <span><StatusIcon status="current" /> Drawn</span>
          </div>
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.selectedPanel}>
          <h3>Selected Team</h3>
          <div className={styles.teamPicker}>
            <div className={styles.teamCard}>
              <button
                type="button"
                className={styles.flagButton}
                onClick={() => setIsTeamMenuOpen((isOpen) => !isOpen)}
                aria-expanded={isTeamMenuOpen}
                aria-haspopup="listbox"
                aria-label="Choose national team"
              >
                <Flag country={selectedTeam} compact className={styles.teamFlag} />
                <IoChevronDown />
              </button>
              <div className={styles.teamDetails}>
                <strong>{selectedTeam}</strong>
                <span>{selectedTeam}</span>
              </div>
            </div>
            {isTeamMenuOpen && (
              <div className={styles.teamMenu} role="listbox" aria-label="National teams">
                {nationalTeams.map((team) => (
                  <button
                    type="button"
                    key={team}
                    className={team === selectedTeam ? styles.selectedTeamOption : ''}
                    onClick={() => handleSelectTeam(team)}
                    role="option"
                    aria-selected={team === selectedTeam}
                    aria-label={team}
                  >
                    <Flag country={team} compact className={styles.optionFlag} />
                    <span>{team}</span>
                  </button>
                ))}
              </div>
            )}
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
                  <span className={styles.matchDateSmall}>{match.date}</span>
                </div>
                <b className={match.status === 'current' ? styles.drawScore : match.status === 'eliminated' ? styles.loseScore : styles.winScore}>
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
                  <strong>{section.qualified && label === 'Qualified' ? <><StatusIcon status={qualified ? 'advanced' : 'eliminated'} /> {value}</> : value}</strong>
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
            <p>The road is tough.<br />But every step brings you closer to glory.<br /><strong>Go {selectedTeam}!</strong></p>
          </div>
        </div>
      </div>
    </section>

    {showShareCard && (
      <ShareCard
        selectedTeam={selectedTeam}
        groupMatches={groupMatches}
        checkpointStatus={checkpointStatus}
        teamPosition={teamPosition}
        qualified={qualified}
        onClose={() => setShowShareCard(false)}
      />
    )}
    </>
  );
}

function getOrdinalSuffix(n) {
  if (n === '-' || n === null || n === undefined) return '';
  const num = Number(n);
  if (Number.isNaN(num)) return '';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default MyTeamPage;
