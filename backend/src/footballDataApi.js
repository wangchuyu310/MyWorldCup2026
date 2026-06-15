const https = require('https');

const API_BASE = 'api.football-data.org';
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const API_VERSION = 'v4';

// 世界杯 2026 比赛ID
const WORLD_CUP_ID = 2000; // 这是示例ID，实际需要查询

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_BASE,
      path: `/${API_VERSION}${path}`,
      method: 'GET',
      headers: {
        'X-Auth-Token': API_KEY,
        'Accept': 'application/json'
      }
    };

    console.log(`Fetching: ${API_BASE}/${API_VERSION}${path}`);

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`Response status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            console.error(`API Error ${res.statusCode}:`, parsed.message || data.substring(0, 200));
            reject(new Error(`API Error ${res.statusCode}: ${parsed.message || data.substring(0, 200)}`));
          }
        } catch (e) {
          console.error(`Parse error:`, e.message, 'Data:', data.substring(0, 200));
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error.message);
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// 获取所有比赛
async function getMatches() {
  return makeRequest('/matches');
}

// 获取特定比赛
async function getMatch(id) {
  return makeRequest(`/matches/${id}`);
}

// 获取比赛列表（按比赛日）
async function getMatchesByMatchday(matchday) {
  return makeRequest(`/matches?matchday=${matchday}`);
}

// 获取球队信息
async function getTeams() {
  return makeRequest('/teams');
}

// 获取特定球队
async function getTeam(id) {
  return makeRequest(`/teams/${id}`);
}

// 获取比赛列表（按日期范围）
async function getMatchesByDate(dateFrom, dateTo) {
  return makeRequest(`/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`);
}

module.exports = {
  getMatches,
  getMatch,
  getMatchesByMatchday,
  getTeams,
  getTeam,
  getMatchesByDate
};
