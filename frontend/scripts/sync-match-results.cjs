const fs = require('node:fs');
const path = require('node:path');

const sourcePath = path.resolve(__dirname, '../../backend/data/matchResults.js');
const outputPath = path.resolve(__dirname, '../src/data/matchResultsData.js');

delete require.cache[require.resolve(sourcePath)];
const matchResultsData = require(sourcePath);

const output = `// Generated from backend/data/matchResults.js by frontend/scripts/sync-match-results.cjs.
// Edit the backend file, then run the frontend dev server or build.

export const matchResultsData = ${JSON.stringify(matchResultsData, null, 2)};

export function getFullResults() {
  return structuredClone(matchResultsData);
}
`;

fs.writeFileSync(outputPath, output, 'utf8');
console.log(`Synced ${Object.keys(matchResultsData.resultsByMatchNo).length} match results.`);
