import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SchedulePage.module.css';
import { IoArrowUpOutline, IoCalendarOutline, IoLocationOutline, IoSearchOutline, IoTimeOutline, IoTrophyOutline } from 'react-icons/io5';
import { scheduleMatches, scheduleSummary } from '../data/scheduleData';

const allValue = 'All';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SchedulePage() {
  const schedulePanelRef = useRef(null);
  const [stageFilter, setStageFilter] = useState(allValue);
  const [regionFilter, setRegionFilter] = useState(allValue);
  const [searchTerm, setSearchTerm] = useState('');
  const [manualResults, setManualResults] = useState({
    loading: true,
    lastUpdatedAt: null,
    resultsByMatchNo: {},
    message: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/schedule/manual-results`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load saved results');
        }

        if (isMounted) {
          setManualResults({
            loading: false,
            lastUpdatedAt: data.lastUpdatedAt || null,
            resultsByMatchNo: data.resultsByMatchNo || {},
            message: '',
          });
        }
      } catch (error) {
        if (isMounted) {
          setManualResults((current) => ({
            ...current,
            loading: false,
            message: error.message,
          }));
        }
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, []);

  const stages = useMemo(() => [allValue, ...new Set(scheduleMatches.map((match) => match.stage))], []);
  const regions = useMemo(() => [allValue, ...new Set(scheduleMatches.map((match) => match.region))], []);

  const matchesWithResults = useMemo(() => {
    return scheduleMatches.map((match) => {
      const manualResult = manualResults.resultsByMatchNo[String(match.matchNo)];

      if (!manualResult?.result) {
        return match;
      }

      return {
        ...match,
        result: manualResult.result,
        resultStatus: manualResult.updatedAt
          ? `Updated ${new Date(manualResult.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
          : 'Backend file',
      };
    });
  }, [manualResults.resultsByMatchNo]);

  const filteredMatches = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return matchesWithResults.filter((match) => {
      const stageMatches = stageFilter === allValue || match.stage === stageFilter;
      const regionMatches = regionFilter === allValue || match.region === regionFilter;
      const searchable = [
        match.matchNo,
        match.date,
        match.day,
        match.stage,
        match.group,
        match.teamA,
        match.teamB,
        match.city,
        match.country,
        match.stadium,
        match.region,
        match.result,
      ].filter(Boolean).join(' ').toLowerCase();

      return stageMatches && regionMatches && (!search || searchable.includes(search));
    });
  }, [matchesWithResults, regionFilter, searchTerm, stageFilter]);

  const resultStatusLabel = manualResults.loading
    ? 'Loading saved results...'
    : manualResults.message
      ? manualResults.message
      : manualResults.lastUpdatedAt
      ? `Manual results updated ${new Date(manualResults.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : 'Results read from backend/data/matchResults.js';

  const firstMatch = scheduleMatches[0];
  const finalMatch = scheduleMatches[scheduleMatches.length - 1];
  const topCities = scheduleSummary.cityCounts.slice(0, 5);
  const scrollToTop = () => {
    schedulePanelRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  return (
    <section className={styles.schedulePage}>
      <div className={styles.hero}>
        <div>
          <p>Complete Match Schedule</p>
          <h2>FIFA World Cup 2026</h2>
          <span>All kickoff times are Eastern Time (ET)</span>
        </div>
        <IoTrophyOutline />
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <IoCalendarOutline />
          <span>Total Matches</span>
          <strong>{scheduleSummary.totalMatches}</strong>
        </div>
        <div className={styles.summaryCard}>
          <IoTimeOutline />
          <span>Opening Match</span>
          <strong>{formatDate(firstMatch.date)}, {firstMatch.kickoffET}</strong>
          <small>{firstMatch.city}</small>
        </div>
        <div className={styles.summaryCard}>
          <IoTrophyOutline />
          <span>Final</span>
          <strong>{formatDate(finalMatch.date)}, {finalMatch.kickoffET}</strong>
          <small>{finalMatch.stadium}</small>
        </div>
        <div className={styles.summaryCard}>
          <IoLocationOutline />
          <span>Host Cities</span>
          <strong>{scheduleSummary.cityCounts.length}</strong>
        </div>
      </div>

      <div className={styles.distributionPanel}>
        <div>
          <h3>By Stage</h3>
          <div className={styles.stageChips}>
            {scheduleSummary.stageCounts.map((stage) => (
              <span key={stage.stage}>
                {stage.stage}
                <strong>{stage.matches}</strong>
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3>Top Host Cities</h3>
          <div className={styles.cityList}>
            {topCities.map((city) => (
              <span key={city.city}>
                <b>{city.city}</b>
                <small>{city.stadium}</small>
                <strong>{city.matches}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.schedulePanel} ref={schedulePanelRef}>
        <div className={styles.toolbar}>
          <label className={styles.searchBox}>
            <IoSearchOutline />
            <input
              type="search"
              value={searchTerm}
              placeholder="Search team, city, stadium..."
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} aria-label="Stage">
            {stages.map((stage) => <option key={stage} value={stage}>{stage === allValue ? 'Select Stage' : stage}</option>)}
          </select>
          <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)} aria-label="Region">
            {regions.map((region) => <option key={region} value={region}>{region === allValue ? 'Select Region' : region}</option>)}
          </select>
          <span>{filteredMatches.length} matches</span>
          <small className={!manualResults.message ? styles.syncReady : styles.syncMuted}>{resultStatusLabel}</small>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Date</th>
                <th>Time</th>
                <th>Stage</th>
                <th>Group</th>
                <th>Match</th>
                <th>Venue</th>
                <th>Region</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match) => (
                <tr key={match.matchNo}>
                  <td><b>{match.matchNo}</b></td>
                  <td><strong>{formatDate(match.date)}</strong><span>{match.day}</span></td>
                  <td>{match.kickoffET}</td>
                  <td><em>{match.stage}</em></td>
                  <td>{match.group || '-'}</td>
                  <td>
                    <strong>{match.teamA}</strong>
                    <span>vs</span>
                    <strong>{match.teamB}</strong>
                  </td>
                  <td><strong>{match.stadium}</strong><span>{match.city}, {match.country}</span></td>
                  <td>{match.region}</td>
                  <td>
                    <strong className={match.result ? styles.resultValue : styles.emptyResult}>
                      {match.result || '-'}
                    </strong>
                    {match.resultStatus && <small>{match.resultStatus}</small>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button type="button" className={styles.backToTop} onClick={scrollToTop}>
        <IoArrowUpOutline />
        Back to top
      </button>
    </section>
  );
}

export default SchedulePage;
