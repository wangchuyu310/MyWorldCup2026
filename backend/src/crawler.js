require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');
const footballDataApi = require('./footballDataApi');

// 数据存储路径
const DATA_DIR = path.join(__dirname, '..', '..', 'frontend', 'src', 'data');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 从 football-data.org 获取实时数据
async function fetchFromFootballData() {
  console.log('Fetching data from football-data.org...');
  try {
    // 获取最近3天和接下来7天的比赛（总共10天，API限制）
    const today = new Date();
    const dateFrom = new Date(today);
    dateFrom.setDate(today.getDate() - 3);
    const dateTo = new Date(today);
    dateTo.setDate(today.getDate() + 6);

    const dateFromStr = dateFrom.toISOString().split('T')[0];
    const dateToStr = dateTo.toISOString().split('T')[0];

    console.log(`Fetching matches from ${dateFromStr} to ${dateToStr}`);

    const matchesData = await footballDataApi.getMatchesByDate(dateFromStr, dateToStr);
    
    if (matchesData && matchesData.matches) {
      console.log(`Found ${matchesData.matches.length} matches`);
      return matchesData.matches;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching from football-data.org:', error.message);
    return [];
  }
}

// 转换 API 数据为项目格式
function convertMatchFormat(apiMatch) {
  const statusMap = {
    'SCHEDULED': 'scheduled',
    'LIVE': 'live',
    'IN_PLAY': 'live',
    'PAUSED': 'live',
    'FINISHED': 'completed',
    'POSTPONED': 'postponed',
    'SUSPENDED': 'suspended',
    'CANCELLED': 'cancelled'
  };

  return {
    matchNo: apiMatch.id,
    date: apiMatch.utcDate ? apiMatch.utcDate.split('T')[0] : 'TBD',
    day: new Date(apiMatch.utcDate).toLocaleDateString('en-US', { weekday: 'long' }),
    kickoffET: apiMatch.utcDate ? apiMatch.utcDate.split('T')[1].substring(0, 5) : 'TBD',
    stage: apiMatch.stage || 'Group Stage',
    group: apiMatch.group || null,
    teamA: apiMatch.homeTeam?.name || 'TBD',
    teamB: apiMatch.awayTeam?.name || 'TBD',
    city: apiMatch.venue || 'TBD',
    country: 'TBD',
    stadium: apiMatch.venue || 'TBD',
    region: 'TBD',
    status: statusMap[apiMatch.status] || 'scheduled',
    homeScore: apiMatch.score?.fullTime?.home ?? apiMatch.score?.halfTime?.home ?? null,
    awayScore: apiMatch.score?.fullTime?.away ?? apiMatch.score?.halfTime?.away ?? null,
    lastUpdated: new Date().toISOString()
  };
}

// 生成实时赛程数据
async function generateLiveSchedule() {
  console.log('Generating live schedule data...');
  
  try {
    // 尝试从 API 获取数据
    const apiMatches = await fetchFromFootballData();
    
    let matches;
    if (apiMatches && apiMatches.length > 0) {
      matches = apiMatches.map(convertMatchFormat);
      console.log(`Converted ${matches.length} matches from API`);
    } else {
      // 使用基础数据作为后备
      console.log('Using fallback match data');
      matches = getFallbackMatches();
    }
    
    const scheduleData = {
      lastUpdated: new Date().toISOString(),
      source: apiMatches.length > 0 ? 'football-data.org' : 'Fallback',
      totalMatches: matches.length,
      matches: matches
    };
    
    // 保存到文件
    const outputPath = path.join(DATA_DIR, 'liveSchedule.js');
    const fileContent = `// Auto-generated live schedule data
// Last updated: ${new Date().toISOString()}
// Source: ${scheduleData.source}

export const liveSchedule = ${JSON.stringify(scheduleData, null, 2)};

export const scheduleMatches = ${JSON.stringify(matches, null, 2)};
`;
    
    fs.writeFileSync(outputPath, fileContent);
    console.log(`Live schedule saved to: ${outputPath}`);
    
    return scheduleData;
  } catch (error) {
    console.error('Error generating schedule:', error);
    throw error;
  }
}

// 后备数据
function getFallbackMatches() {
  return [
    { matchNo: 1, date: "2026-06-11", day: "Thursday", kickoffET: "15:00", stage: "Group Stage", group: "A", teamA: "Mexico", teamB: "South Africa", city: "Mexico City", country: "Mexico", stadium: "Estadio Azteca", region: "Central Region", status: "completed", homeScore: 2, awayScore: 0 },
    { matchNo: 2, date: "2026-06-11", day: "Thursday", kickoffET: "22:00", stage: "Group Stage", group: "A", teamA: "Korea Republic", teamB: "Czechia", city: "Guadalajara", country: "Mexico", stadium: "Estadio Akron", region: "Central Region", status: "completed", homeScore: 2, awayScore: 1 },
    { matchNo: 3, date: "2026-06-12", day: "Friday", kickoffET: "15:00", stage: "Group Stage", group: "B", teamA: "Canada", teamB: "Bosnia and Herzegovina", city: "Toronto", country: "Canada", stadium: "BMO Field", region: "Eastern Region", status: "completed", homeScore: 1, awayScore: 1 },
    { matchNo: 4, date: "2026-06-12", day: "Friday", kickoffET: "22:00", stage: "Group Stage", group: "B", teamA: "Netherlands", teamB: "Chile", city: "Atlanta", country: "USA", stadium: "Mercedes-Benz Stadium", region: "Eastern Region", status: "completed", homeScore: 3, awayScore: 0 },
  ];
}

// 获取球队实时数据
async function fetchTeamStats() {
  console.log('Fetching team statistics...');
  
  try {
    const teamsData = await footballDataApi.getTeams();
    
    if (teamsData && teamsData.teams) {
      const teams = teamsData.teams.map((team, index) => ({
        id: team.id || index + 1,
        name: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      }));
      
      const statsData = {
        lastUpdated: new Date().toISOString(),
        source: 'football-data.org',
        teams: teams
      };
      
      // 保存到文件
      const outputPath = path.join(DATA_DIR, 'teamStats.js');
      const fileContent = `// Auto-generated team statistics
// Last updated: ${new Date().toISOString()}
// Source: football-data.org

export const teamStats = ${JSON.stringify(statsData, null, 2)};
`;
      
      fs.writeFileSync(outputPath, fileContent);
      console.log(`Team stats saved to: ${outputPath}`);
      
      return statsData;
    }
  } catch (error) {
    console.error('Error fetching team stats:', error.message);
  }
  
  // 后备数据
  const fallbackStats = {
    lastUpdated: new Date().toISOString(),
    source: 'Fallback',
    teams: [
      { id: 1, name: 'Mexico', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 0, points: 3 },
      { id: 2, name: 'Korea Republic', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 2, goalsAgainst: 1, points: 3 },
      { id: 3, name: 'Netherlands', played: 1, won: 1, drawn: 0, lost: 0, goalsFor: 3, goalsAgainst: 0, points: 3 },
      { id: 4, name: 'Canada', played: 1, won: 0, drawn: 1, lost: 0, goalsFor: 1, goalsAgainst: 1, points: 1 },
    ]
  };
  
  const outputPath = path.join(DATA_DIR, 'teamStats.js');
  const fileContent = `// Auto-generated team statistics
// Last updated: ${new Date().toISOString()}
// Source: Fallback

export const teamStats = ${JSON.stringify(fallbackStats, null, 2)};
`;
  
  fs.writeFileSync(outputPath, fileContent);
  console.log(`Fallback team stats saved to: ${outputPath}`);
  
  return fallbackStats;
}

// 主函数：运行爬虫
async function runCrawler() {
  console.log('=== World Cup 2026 Live Data Crawler ===');
  console.log(`Start time: ${new Date().toISOString()}`);
  console.log(`API: football-data.org`);
  
  try {
    // 生成实时赛程
    await generateLiveSchedule();
    
    // 获取球队统计
    await fetchTeamStats();
    
    console.log('\n=== Crawler completed successfully ===');
    console.log(`End time: ${new Date().toISOString()}`);
    
    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Crawler failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runCrawler();
}

module.exports = {
  runCrawler,
  generateLiveSchedule,
  fetchTeamStats
};
