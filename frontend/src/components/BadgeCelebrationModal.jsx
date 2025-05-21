import React, { useContext, useEffect, useState } from 'react';
import { CompetitionContext } from '../contexts/CompetitionContext';

const badgeMessages = {
  wood: "Welcome to the Wood League!",
  bronze: "Welcome to the Bronze League!",
  silver: "Welcome to the Silver League!",
  gold: "Welcome to the Gold League!",
};

const specialBadges = ["ruby", "emerald", "sapphire", "champion"];

const BadgeCelebrationModal = () => {
  const { competitionActive, badge } = useContext(CompetitionContext) || { competitionActive: true, badge: 'wood' };
  const [isFirst, setIsFirst] = useState(false);

  useEffect(() => {
    if (!specialBadges.includes(badge)) return;
    // Check if user is first to reach this badge
    fetch(`/api/badges/first/${badge}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setIsFirst(data.isFirst))
      .catch(() => setIsFirst(false));
  }, [badge]);

  if (!competitionActive) return null;

  const getMessage = () => {
    if (badge === "champion") {
      return "🏆 You are the first Champion! Competition closed. Badge: Champion.";
    }
    if (specialBadges.includes(badge)) {
      if (isFirst) {
        return `Welcome to Champions Arena! You are the first to reach ${badge.charAt(0).toUpperCase() + badge.slice(1)}. Go to your profile page, click your ${badge} badge, and redeem. Note: Redeeming ends your competition.`;
      } else {
        return `Welcome to Champions Arena ${badge.charAt(0).toUpperCase() + badge.slice(1)} League. Keep going!`;
      }
    }
    return badgeMessages[badge] || "Congratulations!";
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 32,
        padding: '2.5rem 2rem',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
        textAlign: 'center',
        maxWidth: 400,
        width: '90vw',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Congratulations!</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: 24 }}>{getMessage()}</p>
        <img
          src={`/assets/images/${badge}badge.png`}
          alt={`${badge} badge`}
          style={{ width: 'min(180px, 40vw)', height: 'auto', margin: '0 auto 24px', display: 'block' }}
        />
      </div>
    </div>
  );
};

export default BadgeCelebrationModal; 