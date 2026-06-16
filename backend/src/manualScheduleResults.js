const path = require('path');

const MATCH_RESULTS_PATH = path.join(__dirname, '..', 'data', 'matchResults.js');

function readManualResults() {
  try {
    delete require.cache[require.resolve(MATCH_RESULTS_PATH)];
    const data = require(MATCH_RESULTS_PATH);
    return normalizeManualResults(data);
  } catch (error) {
    return {
      lastUpdatedAt: null,
      resultsByMatchNo: {},
    };
  }
}

function getManualResults() {
  return readManualResults();
}

function normalizeManualResults(data) {
  const rawResults = data?.resultsByMatchNo || {};
  const resultsByMatchNo = Object.fromEntries(
    Object.entries(rawResults)
      .filter(([, value]) => value)
      .map(([matchNo, value]) => {
        if (typeof value === 'string') {
          return [String(matchNo), { result: value, source: 'Backend file' }];
        }

        return [
          String(matchNo),
          {
            result: String(value.result || '').trim(),
            homeScore: numberOrNull(value.homeScore),
            awayScore: numberOrNull(value.awayScore),
            status: value.status || 'completed',
            updatedAt: Object.prototype.hasOwnProperty.call(value, 'updatedAt')
              ? value.updatedAt
              : data.lastUpdatedAt || null,
            source: value.source || 'Backend file',
          },
        ];
      })
  );

  return {
    lastUpdatedAt: data?.lastUpdatedAt || null,
    resultsByMatchNo,
  };
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

module.exports = {
  getManualResults,
};
