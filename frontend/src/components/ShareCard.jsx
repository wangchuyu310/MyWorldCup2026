import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import Flag from './Flag';
import StatusIcon from './StatusIcon';
import styles from './ShareCard.module.css';

const defaultCheers = [
  'Go {team}! Bring the trophy home!',
  'Believe in {team}! To the finals!',
  '{team} all the way! No stopping us!',
  'One team, one dream — {team}!',
  'Heart of a champion — {team}!',
];

function ShareCard({ selectedTeam, groupMatches, checkpointStatus, teamPosition, qualified, onClose }) {
  const cardRef = useRef(null);
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [cheerText, setCheerText] = useState(
    defaultCheers[Math.floor(Math.random() * defaultCheers.length)].replace('{team}', selectedTeam)
  );
  const [generating, setGenerating] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarUrl(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    setGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#040e22',
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `WorldCup2026_${selectedTeam.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setGenerating(false);
    }
  };

  const positionText = teamPosition && teamPosition !== '-'
    ? `${teamPosition}${getOrdinalSuffix(teamPosition)} in Group`
    : 'Group Stage';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Share Your Team Journey</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.cardWrapper}>
          <div ref={cardRef} className={styles.shareCard}>
            <div className={styles.cardBg} />
            <div className={styles.cardBgAccent} />

            <div className={styles.cardHeader}>
              <div className={styles.avatarArea}>
                <div className={styles.avatarCircle}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className={styles.avatarImg} />
                  ) : (
                    <Flag country={selectedTeam} compact className={styles.avatarFlag} />
                  )}
                </div>
                <span className={styles.avatarLabel}>ME</span>
              </div>
              <div className={styles.cardTitle}>
                <span className={styles.cardSubtitle}>FIFA World Cup 2026™</span>
                <h1>{selectedTeam}</h1>
                <span className={styles.cardPositionText}>{positionText}</span>
              </div>
              <div className={styles.cardFlagLarge}>
                <Flag country={selectedTeam} compact className={styles.cardFlagImg} />
              </div>
            </div>

            <div className={styles.cardDivider} />

            <div className={styles.cardBody}>
              <div className={styles.cardStageLabel}>
                <span className={styles.stageIcon}>⚽</span>
                <span>GROUP STAGE</span>
                {checkpointStatus === 'advanced' && (
                  <span className={styles.qualifiedBadge}>✓ QUALIFIED</span>
                )}
                {checkpointStatus === 'eliminated' && (
                  <span className={styles.eliminatedBadge}>✗ OUT</span>
                )}
                {checkpointStatus === 'locked' && (
                  <span className={styles.pendingBadge}>⏳ IN PROGRESS</span>
                )}
              </div>

              <div className={styles.cardMatches}>
                {groupMatches.map((match) => (
                  <div key={match.id} className={styles.cardMatch}>
                    <div className={styles.cardMatchLeft}>
                      <span className={styles.cardMatchNum}>{match.id}</span>
                      <span className={styles.cardVs}>vs</span>
                      <span className={styles.cardMatchOpp}>{match.opponent}</span>
                    </div>
                    <div className={styles.cardMatchRight}>
                      <span className={`${styles.cardMatchScore} ${
                        match.status === 'advanced' ? styles.scoreWin :
                        match.status === 'eliminated' ? styles.scoreLose :
                        match.status === 'current' ? styles.scoreDraw :
                        styles.scorePending
                      }`}>
                        {match.result}
                      </span>
                      <StatusIcon status={match.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.cheerSection}>
              <span className={styles.megaphone}>📢</span>
              <span className={styles.cheerText}>{cheerText || `Go ${selectedTeam}!`}</span>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.footerLogo}>🏆</span>
              <span>MyWorldCup2026</span>
              <span className={styles.footerDot}>·</span>
              <span>Road to Glory</span>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlRow}>
            <label className={styles.uploadBtn}>
              📷 Change Avatar
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className={styles.hiddenInput} />
            </label>
            {avatarUrl && (
              <button type="button" className={styles.removeBtn} onClick={() => { setAvatarUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                Reset
              </button>
            )}
          </div>

          <div className={styles.controlRow}>
            <span className={styles.megaphoneLabel}>📢</span>
            <input
              type="text"
              placeholder="Type your cheer..."
              value={cheerText}
              onChange={(e) => setCheerText(e.target.value)}
              className={styles.cheerInput}
              maxLength={50}
            />
          </div>

          <button
            type="button"
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '⏳ Generating...' : '💾 Save Image'}
          </button>
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(n) {
  if (n === '-' || n === null || n === undefined) return '';
  const num = Number(n);
  if (Number.isNaN(num)) return '';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default ShareCard;
