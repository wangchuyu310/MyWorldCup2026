import styles from './Flag.module.css';

const flagCodeMap = {
  'Algeria': 'dz',
  'Argentina': 'ar',
  'Australia': 'au',
  'Austria': 'at',
  'Belgium': 'be',
  'Bosnia and Herzegovina': 'ba',
  'Bosnia-Herzegovina': 'ba',
  'Brazil': 'br',
  'Cabo Verde': 'cv',
  'Cape Verde': 'cv',
  'Canada': 'ca',
  'Chile': 'cl',
  'Colombia': 'co',
  'Congo DR': 'cd',
  'Côte d’Ivoire': 'ci',
  "Côte d'Ivoire": 'ci',
  'Curacao': 'cw',
  'Curaçao': 'cw',
  'Czech Republic': 'cz',
  'Czechia': 'cz',
  'Denmark': 'dk',
  'DR Congo': 'cd',
  'Ecuador': 'ec',
  'Egypt': 'eg',
  'England': 'gb-eng',
  'France': 'fr',
  'Germany': 'de',
  'Ghana': 'gh',
  'Haiti': 'ht',
  'IR Iran': 'ir',
  'Iran': 'ir',
  'Iraq': 'iq',
  'Italy': 'it',
  'Ivory Coast': 'ci',
  'Japan': 'jp',
  'Jordan': 'jo',
  'Korea DPR': 'kp',
  'Korea Republic': 'kr',
  'Mexico': 'mx',
  'Morocco': 'ma',
  'Netherlands': 'nl',
  'New Zealand': 'nz',
  'North Korea': 'kp',
  'Norway': 'no',
  'Panama': 'pa',
  'Paraguay': 'py',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Qatar': 'qa',
  'Russia': 'ru',
  'Saudi Arabia': 'sa',
  'Scotland': 'gb-sct',
  'Senegal': 'sn',
  'Serbia': 'rs',
  'South Africa': 'za',
  'South Korea': 'kr',
  'Spain': 'es',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Tunisia': 'tn',
  'Turkey': 'tr',
  'Türkiye': 'tr',
  'Ukraine': 'ua',
  'United Kingdom': 'gb',
  'United States': 'us',
  'Uruguay': 'uy',
  'USA': 'us',
  'Uzbekistan': 'uz',
  'Wales': 'gb-wls',
};

function getFallbackLabel(country) {
  if (!country) return '?';
  return country
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

function Flag({ country, compact = false, className = '', style }) {
  const flagCode = flagCodeMap[country];

  return (
    <span
      className={`${styles.flag} ${compact ? styles.compact : ''} ${flagCode ? '' : styles.placeholder} ${className}`}
      aria-label={`${country} flag`}
      style={style}
      title={country}
    >
      {flagCode ? (
        <img
          src={`https://flagcdn.com/${flagCode}.svg`}
          alt=""
          className={styles.image}
          loading="lazy"
        />
      ) : (
        getFallbackLabel(country)
      )}
    </span>
  );
}

export default Flag;
