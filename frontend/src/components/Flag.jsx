import styles from './Flag.module.css';

const countryClassMap = {
  // 已有国家
  'United States': styles.usa,
  'USA': styles.usa,
  'Mexico': styles.mexico,
  'Argentina': styles.argentina,
  'Canada': styles.canada,
  'Brazil': styles.brazil,
  'France': styles.france,
  'England': styles.england,
  'Germany': styles.germany,
  
  // 新增国家 - A组
  'South Africa': styles.southAfrica,
  'Korea Republic': styles.koreaRepublic,
  'South Korea': styles.koreaRepublic,
  'Czechia': styles.czechia,
  'Czech Republic': styles.czechia,
  
  // B组
  'Bosnia and Herzegovina': styles.bosnia,
  'Bosnia-Herzegovina': styles.bosnia,
  'Netherlands': styles.netherlands,
  'Chile': styles.chile,
  'Qatar': styles.qatar,
  'Switzerland': styles.switzerland,
  
  // C组
  'Spain': styles.spain,
  'New Zealand': styles.newZealand,
  'Colombia': styles.colombia,
  'Scotland': styles.scotland,
  'Haiti': styles.haiti,
  'Morocco': styles.morocco,
  
  // D组
  'Paraguay': styles.paraguay,
  'Australia': styles.australia,
  'Türkiye': styles.turkiye,
  'Turkey': styles.turkiye,
  
  // E组
  "Côte d'Ivoire": styles.coteDIvoire,
  'Ivory Coast': styles.coteDIvoire,
  'Ecuador': styles.ecuador,
  'Curaçao': styles.curacao,
  'Curacao': styles.curacao,
  
  // F组
  'Sweden': styles.sweden,
  'Tunisia': styles.tunisia,
  'Japan': styles.japan,
  
  // G组
  'IR Iran': styles.iran,
  'Iran': styles.iran,
  'Belgium': styles.belgium,
  'Egypt': styles.egypt,
  
  // H组
  'Saudi Arabia': styles.saudiArabia,
  'Uruguay': styles.uruguay,
  'Cabo Verde': styles.caboVerde,
  'Cape Verde': styles.caboVerde,
  
  // I组
  'Senegal': styles.senegal,
  'Iraq': styles.iraq,
  'Norway': styles.norway,
  
  // J组
  'Algeria': styles.algeria,
  'Austria': styles.austria,
  'Jordan': styles.jordan,
  
  // K组
  'Portugal': styles.portugal,
  'Congo DR': styles.congoDR,
  'DR Congo': styles.congoDR,
  'Uzbekistan': styles.uzbekistan,
  
  // L组
  'Ghana': styles.ghana,
  'Panama': styles.panama,
  'Croatia': styles.croatia,
  
  // 其他可能名称
  'Korea DPR': styles.koreaRepublic,
  'North Korea': styles.koreaRepublic,
  'Russia': styles.russia,
  'Italy': styles.italy,
  'Wales': styles.wales,
  'Ukraine': styles.ukraine,
  'Poland': styles.poland,
  'Denmark': styles.denmark,
  'Serbia': styles.serbia,
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
