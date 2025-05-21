import React, { useContext, useEffect, useState } from 'react';
import { CompetitionContext } from '../context/CompetitionContext';

const AdminToggles = () => {
  const { competitionActive, isAdmin } = useContext(CompetitionContext) || { competitionActive: true, isAdmin: false };
  const [competitionState, setCompetitionState] = useState(null);

  useEffect(() => {
    if (!competitionActive) return;
    fetch("/api/competition/state", { credentials: "include" })
      .then(res => res.json())
      .then(data => setCompetitionState(data))
      .catch(() => setCompetitionState(null));
  }, [competitionActive]);

  return (
    <div>
      {isAdmin && competitionState && (
        <div>
          <h2>Admin Controls</h2>
          <button onClick={() => setCompetitionState({ ...competitionState, active: !competitionState.active })}>
            {competitionState.active ? 'Pause Competition' : 'Resume Competition'}
          </button>
          <button onClick={() => setCompetitionState({ ...competitionState, devMode: !competitionState.devMode })}>
            {competitionState.devMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
          </button>
          <button onClick={() => setCompetitionState({ ...competitionState, halvePoints: !competitionState.halvePoints })}>
            {competitionState.halvePoints ? 'Disable Halve Points' : 'Enable Halve Points'}
          </button>
          <button onClick={() => setCompetitionState({ ...competitionState, reset: true })}>
            Reset Competition
          </button>
          <button onClick={() => setCompetitionState({ ...competitionState, end: true })}>
            End Competition
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminToggles; 