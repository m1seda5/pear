import HousePoints from '../models/HousePoints.js';

const getAllPoints = async () => {
  const houses = ['samburu', 'mara', 'amboseli', 'tsavo'];
  const points = await HousePoints.find();
  const result = houses.reduce((acc, house) => {
    const found = points.find(p => p.house === house);
    acc[house] = found ? found.points : 0;
    return acc;
  }, {});
  return result;
};

const updatePoints = async (updates) => {
  const results = {};
  for (const [house, points] of Object.entries(updates)) {
    const updated = await HousePoints.findOneAndUpdate(
      { house },
      { points },
      { upsert: true, new: true }
    );
    results[house] = updated.points;
  }
  // Return all points after updates
  const allPoints = await getAllPoints();
  return allPoints;
};

const resetPoints = async () => {
  const houses = ['samburu', 'mara', 'amboseli', 'tsavo'];
  for (const house of houses) {
    await HousePoints.findOneAndUpdate(
      { house },
      { points: 0 },
      { upsert: true, new: true }
    );
  }
  // Return all points after reset
  const allPoints = await getAllPoints();
  return allPoints;
};

export default {
  getAllPoints,
  updatePoints,
  resetPoints
};