import React, { useContext, useEffect, useState } from 'react';
import { CompetitionContext } from '../context/CompetitionContext';

const AdminToggles = () => {
  const { competitionActive, isAdmin } = useContext(CompetitionContext) || { competitionActive: true, isAdmin: false };
  const [competitionState, setCompetitionState] = useState(null);

  // Helper to refetch state
  const fetchState = () => {
    fetch("/api/competition/state", { credentials: "include" })
      .then(res => res.json())
      .then(data => setCompetitionState(data))
      .catch(() => setCompetitionState(null));
  };

  // Handlers for each admin action
  const handleToggleActive = async () => {
    await fetch("/api/competition/toggle-active", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive: !competitionState.active })
    });
    fetchState();
  };
  const handleToggleDevMode = async () => {
    await fetch("/api/competition/toggle-dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ devMode: !competitionState.devMode })
    });
    fetchState();
  };
  const handleToggleHalvePoints = async () => {
    await fetch("/api/competition/toggle-halved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ halvedPoints: !competitionState.halvedPoints })
    });
    fetchState();
  };
  const handleReset = async () => {
    await fetch("/api/competition/reset", {
      method: "POST",
      credentials: "include"
    });
    fetchState();
  };
  const handleEnd = async () => {
    await fetch("/api/competition/end", {
      method: "POST",
      credentials: "include"
    });
    fetchState();
  };

  useEffect(() => {
    if (!competitionActive) return;
    fetchState();
  }, [competitionActive]);

  return (
    <div>
      {isAdmin && competitionState && (
        <div>
          <h2>Admin Controls</h2>
          <button onClick={handleToggleActive}>
            {competitionState.active ? 'Pause Competition' : 'Resume Competition'}
          </button>
          <button onClick={handleToggleDevMode}>
            {competitionState.devMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
          </button>
          <button onClick={handleToggleHalvePoints}>
            {competitionState.halvedPoints ? 'Disable Halve Points' : 'Enable Halve Points'}
          </button>
          <button onClick={handleReset}>
            Reset Competition
          </button>
          <button onClick={handleEnd}>
            End Competition
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminToggles; 