import styles from './Flag.module.css';

const countryClassMap = {
  'United States': styles.usa,
  Mexico: styles.mexico,
  Argentina: styles.argentina,
  Canada: styles.canada,
  Brazil: styles.brazil,
  France: styles.france,
  England: styles.england,
  Germany: styles.germany,
};

function Flag({ country, compact = false }) {
  const countryClass = countryClassMap[country] || styles.generic;

  return (
    <div className={`${styles.flag} ${compact ? styles.compact : ''} ${countryClass}`} aria-label={`${country} flag`}>
      <span className={styles.symbol} />
    </div>
  );
}

export default Flag;
