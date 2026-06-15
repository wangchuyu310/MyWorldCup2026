import React, { useMemo, useState } from 'react';
import styles from './SchedulePage.module.css';
import { IoCalendarOutline, IoLocationOutline, IoSearchOutline, IoTimeOutline, IoTrophyOutline } from 'react-icons/io5';
import { scheduleMatches, scheduleSummary } from '../data/scheduleData';

const allValue = 'All';

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SchedulePage() {
  const [stageFilter, setStageFilter] = useState(allValue);
  const [regionFilter, setRegionFilter] = useState(allValue);
  const [searchTerm, setSearchTerm] = useState('');

  const stages = useMemo(() => [allValue, ...new Set(scheduleMatches.map((match) => match.stage))], []);
  const regions = useMemo(() => [allValue, ...new Set(scheduleMatches.map((match) => match.region))], []);

  const filteredMatches = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return scheduleMatches.filter((match) => {
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
  }, [regionFilter, searchTerm, stageFilter]);

  const firstMatch = scheduleMatches[0];
  const finalMatch = scheduleMatches[scheduleMatches.length - 1];
  const topCities = scheduleSummary.cityCounts.slice(0, 5);

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

      <div className={styles.schedulePanel}>
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
            {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
          </select>
          <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)} aria-label="Region">
            {regions.map((region) => <option key={region} value={region}>{region}</option>)}
          </select>
          <span>{filteredMatches.length} matches</span>
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
                  <td>{match.result || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default SchedulePage;
