import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FeaturedMatches from './components/FeaturedMatches';
import UpcomingMatches from './components/UpcomingMatches';
import CallToAction from './components/CallToAction';
import MyTeamPage from './components/MyTeamPage';
import MyStarPage from './components/MyStarPage';
import SchedulePage from './components/SchedulePage';

const fallbackMatches = [
  {
    id: 'fallback-1',
    home_team: 'United States',
    away_team: 'Mexico',
    kickoff_at: '2026-06-14T13:00:00',
    venue: 'AT&T Stadium',
    location: 'Arlington, USA',
  },
  {
    id: 'fallback-2',
    home_team: 'Argentina',
    away_team: 'Canada',
    kickoff_at: '2026-06-14T16:00:00',
    venue: 'Mercedes-Benz Stadium',
    location: 'Atlanta, USA',
  },
  {
    id: 'fallback-3',
    home_team: 'Brazil',
    away_team: 'France',
    kickoff_at: '2026-06-14T19:00:00',
    venue: 'MetLife Stadium',
    location: 'East Rutherford, USA',
  },
  {
    id: 'fallback-4',
    home_team: 'England',
    away_team: 'Germany',
    kickoff_at: '2026-06-14T22:00:00',
    venue: 'SoFi Stadium',
    location: 'Inglewood, USA',
  },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const HEARTBEAT_INTERVAL_MS = 15000;

function getVisitorId() {
  const existingVisitorId = window.localStorage.getItem('worldcupVisitorId');

  if (existingVisitorId) {
    return existingVisitorId;
  }

  const visitorId = window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem('worldcupVisitorId', visitorId);
  return visitorId;
}

function App() {
  const [matches, setMatches] = useState(fallbackMatches);
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);
  const [activePage, setActivePage] = useState('today');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/matches`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setMatches(normalizeMatches(response.data));
        }
      } catch (err) {
        setMatches(fallbackMatches);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const visitorId = getVisitorId();

    const sendHeartbeat = async () => {
      try {
        const response = await axios.post(`${API_BASE_URL}/visitors/heartbeat`, { visitorId });
        setOnlineCount(response.data.onlineCount);
      } catch (err) {
        setOnlineCount(0);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };

    const handleBeforeUnload = () => {
      const payload = JSON.stringify({ visitorId });
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon?.(`${API_BASE_URL}/visitors/leave`, blob);
    };

    sendHeartbeat();
    const heartbeatTimerId = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.clearInterval(heartbeatTimerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const normalizeMatches = (apiMatches) => {
    return apiMatches.map((match, index) => ({
      ...fallbackMatches[index % fallbackMatches.length],
      ...match,
      location: match.location || fallbackMatches[index % fallbackMatches.length].location,
    }));
  }

  return (
    <div className="app-container">
      <Header onlineCount={onlineCount} />
      <div className="content-shell">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <main className="main-content">
          {activePage === 'my-team' ? (
            <MyTeamPage />
          ) : activePage === 'my-star' ? (
            <MyStarPage />
          ) : activePage === 'schedule' ? (
            <SchedulePage />
          ) : (
            <>
              <FeaturedMatches matches={matches} loading={loading} />
              <UpcomingMatches matches={matches} />
              <CallToAction />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
