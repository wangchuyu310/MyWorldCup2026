import React, { useLayoutEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { IoCheckmark, IoClose, IoFlag, IoLockClosed, IoRemove, IoTrophy } from 'react-icons/io5';
import Flag, { getFlagUrl } from './Flag';
import styles from './ShareCard.module.css';

const knockoutNodes = [
  { id: 'round32', label: 'Round of 32' },
  { id: 'round16', label: 'Round of 16' },
  { id: 'quarter', label: 'Quarter-final' },
  { id: 'semi', label: 'Semi-final' },
  { id: 'bronze', label: 'Bronze Final' },
  { id: 'final', label: 'Final' },
];

function normalizeNodeStatus(status) {
  return status === 'scheduled' ? 'locked' : status;
}

function StatusNodeIcon({ status }) {
  if (status === 'advanced') return <IoCheckmark />;
  if (status === 'eliminated') return <IoClose />;
  if (status === 'current') return <IoRemove />;
  return <IoLockClosed />;
}

function JourneyNode({ label, status = 'locked', className = '', children }) {
  const normalizedStatus = normalizeNodeStatus(status);

  return (
    <div className={`${styles.journeyNode} ${styles[`node${capitalize(normalizedStatus)}`]} ${className}`}>
      <div className={styles.nodeCircle}>
        {children || <StatusNodeIcon status={normalizedStatus} />}
      </div>
      <span>{label}</span>
    </div>
  );
}

function isMobileBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || '';
  const touchDevice = navigator.maxTouchPoints > 1;

  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) || touchDevice;
}

function ShareCard({ selectedTeam, groupMatches, checkpointStatus, onClose }) {
  const cardRef = useRef(null);
  const headlineRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  useLayoutEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;

    const fitHeadline = () => {
      const maxSize = 42;
      const minSize = 16;
      let size = maxSize;

      headline.style.fontSize = `${maxSize}px`;
      while (headline.scrollWidth > headline.clientWidth && size > minSize) {
        size -= 1;
        headline.style.fontSize = `${size}px`;
      }
    };

    fitHeadline();
    window.addEventListener('resize', fitHeadline);
    return () => window.removeEventListener('resize', fitHeadline);
  }, [selectedTeam]);

  const handleGenerate = async () => {
    if (!cardRef.current) return;
    setGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      });

      const fileName = `WorldCup2026_${selectedTeam.replace(/\s+/g, '_')}.png`;

      if (!isMobileBrowser()) {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
        return;
      }

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (!blob) {
        throw new Error('Unable to create poster image');
      }

      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({
          files: [file],
          title: `Go ${selectedTeam}!`,
          text: `My World Cup 2026 journey for ${selectedTeam}`,
        });
        return;
      }

      const link = document.createElement('a');
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setGenerating(false);
    }
  };

  const roundOf32Status = checkpointStatus === 'advanced' ? 'current' : 'locked';
  const selectedFlagUrl = getFlagUrl(selectedTeam);
  const flagTileStyle = selectedFlagUrl
    ? { '--team-flag-url': `url("${selectedFlagUrl}")` }
    : undefined;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Share Your Team Journey</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.cardWrapper}>
          <div ref={cardRef} className={styles.shareCard}>
            <div className={styles.cardBg} style={flagTileStyle} />
            <div className={styles.cardBgAccent} />
            <div className={styles.confetti} />

            <div className={styles.posterHeader}>
              <div className={styles.posterBrand}>
                <IoTrophy />
                <span>FIFA World Cup 2026™</span>
              </div>

              <div className={styles.posterTeamRow}>
                <div className={styles.crest}>
                  <Flag country={selectedTeam} compact className={styles.crestFlag} />
                </div>
                <div className={styles.posterTitle}>
                  <strong ref={headlineRef}>Go {selectedTeam}!</strong>
                </div>
              </div>
            </div>

            <div className={styles.posterJourney}>
              <svg className={styles.journeyPath} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <marker id="shareArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" />
                  </marker>
                </defs>
                <path
                  className={styles.pathGlow}
                  d="M 8 12 L 31 12 L 58 12 L 86 12 C 96 12 97 25 84 34 C 74 37 63 39 51 43 C 35 47 20 51 15 58 C 9 67 20 75 30 77 C 40 79 48 82 55 82"
                />
                <path
                  className={styles.pathDash}
                  d="M 8 12 L 31 12 L 58 12 L 86 12 C 96 12 97 25 84 34 C 74 37 63 39 51 43 C 35 47 20 51 15 58 C 9 67 20 75 30 77 C 40 79 48 82 55 82"
                  markerEnd="url(#shareArrow)"
                />
                <path
                  className={styles.pathGlow}
                  d="M 55 82 C 65 74 75 70 86 72"
                />
                <path
                  className={styles.pathDash}
                  d="M 55 82 C 65 74 75 70 86 72"
                  markerEnd="url(#shareArrow)"
                />
                <path
                  className={styles.pathGlow}
                  d="M 55 82 C 66 86 77 91 88 92"
                />
                <path
                  className={styles.pathDash}
                  d="M 55 82 C 66 86 77 91 88 92"
                  markerEnd="url(#shareArrow)"
                />
              </svg>

              <JourneyNode label="Start" status="current" className={styles.startNode}>
                <Flag country={selectedTeam} compact className={styles.startFlag} />
              </JourneyNode>

              <div className={styles.groupNodeRow}>
                {groupMatches.map((match) => (
                  <JourneyNode
                    key={match.id}
                    label={`Group Match ${match.id}`}
                    status={match.status}
                  />
                ))}
              </div>

              <div className={styles.checkpointNode}>
                <JourneyNode label="Qualification Checkpoint" status={checkpointStatus}>
                  <IoFlag />
                </JourneyNode>
              </div>

              <div className={styles.roundNode}>
                <JourneyNode label="Round of 32" status={roundOf32Status}>
                  {roundOf32Status === 'current' ? (
                    <Flag country={selectedTeam} compact className={styles.roundFlag} />
                  ) : null}
                </JourneyNode>
              </div>

              <div className={styles.knockoutGrid}>
                {knockoutNodes.slice(1).map((node) => (
                  <JourneyNode key={node.id} label={node.label} status="locked" />
                ))}
              </div>

              <div className={styles.trophyColumn} aria-hidden="true">
                <IoTrophy className={styles.bronzeTrophy} />
                <IoTrophy className={styles.silverTrophy} />
                <IoTrophy className={styles.goldTrophy} />
              </div>
            </div>

            <div className={styles.posterFooter}>
              <span>© 2026 JustForFunLab. All rights reserved.</span>
            </div>
          </div>
        </div>

        <div className={styles.controls}>
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

function capitalize(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default ShareCard;
