import HousePoints from '../models/HousePoints.js';

const getAllPoints = async () => {
  const houses = ['samburu', 'mara', 'amboseli', 'tsavo'];
  const points = await HousePoints.find();
  return houses.reduce((acc, house) => {
    const found = points.find(p => p.house === house);
    acc[house] = found ? found.points : 0;
    return acc;
  }, {});
};

const updatePoints = async (updates) => {
  const results = {};
  for (const [house, points] of Object.entries(updates)) {
    const updated = await HousePoints.findOneAndUpdate(
      { house },
      { points: Math.min(100, Math.max(0, points)) }, // Clamp values 0-100
      { upsert: true, new: true }
    );
    results[house] = updated.points;
  }
  return await getAllPoints();
};

const resetPoints = async () => {
  await HousePoints.deleteMany({}); // More efficient than individual updates
  await Promise.all(['samburu', 'mara', 'amboseli', 'tsavo'].map(house => 
    HousePoints.create({ house, points: 0 })
  ));
  return getAllPoints();
};

export { getAllPoints, updatePoints, resetPoints }; 