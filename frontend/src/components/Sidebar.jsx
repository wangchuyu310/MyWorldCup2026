import React from 'react';
import styles from './Sidebar.module.css';
import { IoCalendarOutline, IoShieldOutline, IoStarOutline, IoListOutline } from 'react-icons/io5';

const navItems = [
  { id: 'today', label: 'Today', Icon: IoCalendarOutline },
  { id: 'my-team', label: 'My Team', Icon: IoShieldOutline },
  { id: 'my-star', label: 'My Star', Icon: IoStarOutline },
  { id: 'schedule', label: 'Schedule', Icon: IoListOutline },
];

const Sidebar = ({ activePage, onPageChange }) => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          {navItems.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                type="button"
                className={`${styles.navItem} ${activePage === id ? styles.active : ''}`}
                onClick={() => onPageChange(id)}
              >
                <Icon size={24} />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.footer}>
        <div className={styles.logoContainer}>
            <div className={styles.pitchGlow}>
              <div className={styles.ballImage} />
            </div>
        </div>
        <div className={styles.worldCupInfo}>
            <h3>FIFA WORLD CUP 2026</h3>
            <p>UNITED STATES | CANADA | MEXICO</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
