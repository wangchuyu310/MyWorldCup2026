const { runCrawler } = require('./crawler');

// 定时运行爬虫（每5分钟）
const INTERVAL = 5 * 60 * 1000; // 5分钟

console.log('=== World Cup 2026 Data Scheduler ===');
console.log(`Update interval: ${INTERVAL / 1000} seconds`);

// 立即运行一次
runCrawler();

// 定时运行
setInterval(() => {
  console.log('\n--- Scheduled update ---');
  runCrawler();
}, INTERVAL);

console.log('Scheduler is running... Press Ctrl+C to stop.');
