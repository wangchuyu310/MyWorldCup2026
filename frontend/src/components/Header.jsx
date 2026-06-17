import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Header.module.css';
import { IoTimeOutline, IoTrophyOutline } from 'react-icons/io5';

const timeZoneOptions = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
];

function getDefaultTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

function formatDateTime(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone,
  }).formatToParts(date);
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${partMap.month} ${partMap.day}, ${partMap.hour}:${partMap.minute}`;
}

const Header = ({ onlineCount, onTimeZoneChange }) => {
  const [localTimeZone] = useState(getDefaultTimeZone);
  const timeZones = useMemo(() => {
    return timeZoneOptions.includes(localTimeZone)
      ? timeZoneOptions
      : [localTimeZone, ...timeZoneOptions];
  }, [localTimeZone]);
  const [selectedTimeZone, setSelectedTimeZone] = useState(localTimeZone);
  const [now, setNow] = useState(() => new Date());
  const measureRef = useRef(null);
  const [selectWidth, setSelectWidth] = useState(128);
  const displayTime = formatDateTime(now, selectedTimeZone);

  const handleTimeZoneChange = (newTimeZone) => {
    setSelectedTimeZone(newTimeZone);
    if (onTimeZoneChange) {
      onTimeZoneChange(newTimeZone);
    }
  };

  useEffect(() => {
    if (onTimeZoneChange) {
      onTimeZoneChange(localTimeZone);
    }
  }, [localTimeZone, onTimeZoneChange]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!measureRef.current) {
      return;
    }

    const measuredWidth = Math.ceil(measureRef.current.getBoundingClientRect().width);
    setSelectWidth(measuredWidth + 34);
  }, [selectedTimeZone]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <IoTrophyOutline className={styles.trophyIcon} />
        <h1>My World Cup <span>2026</span></h1>
      </div>
      <div className={styles.timeInfo}>
        <span>{displayTime}</span>
        <label className={styles.timeZoneControl}>
          <IoTimeOutline />
          <select
            value={selectedTimeZone}
            aria-label="Time Zone"
            style={{ width: `${selectWidth}px` }}
            onChange={(event) => handleTimeZoneChange(event.target.value)}
          >
            {timeZones.map((timeZone) => (
              <option key={timeZone} value={timeZone}>
                {timeZone}
              </option>
            ))}
          </select>
          <span ref={measureRef} className={styles.timeZoneMeasure}>
            {selectedTimeZone}
          </span>
        </label>
      </div>
      <div className={styles.userInfo}>
        <span className={styles.onlineStatus}>online {new Intl.NumberFormat('en-US').format(onlineCount)}</span>
      </div>
    </header>
  );
};

export default Header;
