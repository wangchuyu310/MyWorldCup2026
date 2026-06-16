import React from 'react';
import styles from './StatusIcon.module.css';
import { IoCheckmark, IoClose, IoRemove } from 'react-icons/io5';

const StatusIcon = ({ status }) => {
  const getIcon = () => {
    switch (status) {
      case 'advanced':
        return <IoCheckmark />;
      case 'eliminated':
        return <IoClose />;
      case 'current':
        return <IoRemove />;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.statusIcon} ${styles[status]}`}>
      {getIcon()}
    </div>
  );
};

export default StatusIcon;
