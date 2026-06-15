const VISITOR_TIMEOUT_MS = 45 * 1000;

const visitors = new Map();

function cleanupVisitors(now = Date.now()) {
  for (const [visitorId, lastSeenAt] of visitors.entries()) {
    if (now - lastSeenAt > VISITOR_TIMEOUT_MS) {
      visitors.delete(visitorId);
    }
  }
}

function touchVisitor(visitorId) {
  cleanupVisitors();
  visitors.set(visitorId, Date.now());

  return getOnlineCount();
}

function removeVisitor(visitorId) {
  visitors.delete(visitorId);

  return getOnlineCount();
}

function getOnlineCount() {
  cleanupVisitors();

  return visitors.size;
}

module.exports = {
  getOnlineCount,
  removeVisitor,
  touchVisitor,
};
