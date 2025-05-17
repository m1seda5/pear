// Backend: housePointsController.js
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

const updatePoints = async ({ house, delta }) => {
  try {
    const updated = await HousePoints.findOneAndUpdate(
      { house },
      { $inc: { points: delta } },
      { new: true, upsert: true }
    );
    return await getAllPoints();
  } catch (error) {
    throw new Error('Failed to update points');
  }
};

const resetPoints = async () => {
  await HousePoints.deleteMany({});
  await Promise.all(
    ['samburu', 'mara', 'amboseli', 'tsavo'].map(house =>
      HousePoints.create({ house, points: 0 })
    )
  );
  return getAllPoints();
};

export { getAllPoints, updatePoints, resetPoints };