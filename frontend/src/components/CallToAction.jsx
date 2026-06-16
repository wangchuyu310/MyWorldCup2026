import React from 'react';
import styles from './CallToAction.module.css';
import { IoTrophyOutline } from 'react-icons/io5';

const CallToAction = ({ onExplore }) => {
  return (
    <div className={styles.callToAction}>
      <div className={styles.icon}>
        <IoTrophyOutline />
      </div>
      <div className={styles.text}>
        <h3>The Road to Glory Begins!</h3>
        <p>Follow your team, track your star players, and never miss a moment.</p>
      </div>
      <button type="button" className={styles.button} onClick={onExplore}>Explore Now</button>
    </div>
  );
};

export default CallToAction;
