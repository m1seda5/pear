import React, { useContext, useEffect } from 'react';
import { CompetitionContext } from '../context/CompetitionContext';

const PointPopUpContext = () => {
  const { competitionActive, points, updatePoints } = useContext(CompetitionContext) || { competitionActive: true, points: 0, updatePoints: () => {} };

  useEffect(() => {
    if (!competitionActive) return;
    fetch("/api/users/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => updatePoints(data.points || 0))
      .catch(() => updatePoints(0));
  }, [competitionActive, updatePoints]);

  return (
    <div>
      {competitionActive && (
        <div>
          <h2>Points: {points}</h2>
          <button onClick={() => updatePoints(points + 10)}>Add 10 Points</button>
          <button onClick={() => updatePoints(points + 20)}>Add 20 Points</button>
          <button onClick={() => updatePoints(points + 25)}>Add 25 Points</button>
          <button onClick={() => updatePoints(points + 50)}>Add 50 Points</button>
          <button onClick={() => updatePoints(points + 75)}>Add 75 Points</button>
          <button onClick={() => updatePoints(points + 100)}>Add 100 Points</button>
          <button onClick={() => updatePoints(points + 250)}>Add 250 Points</button>
        </div>
      )}
    </div>
  );
};

export default PointPopUpContext; 