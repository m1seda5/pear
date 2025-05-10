import HousePoints from '../models/HousePoints.js';

class HousePointsController {
  async getAllPoints() {
    const houses = ['samburu', 'mara', 'amboseli', 'tsavo'];
    const points = await HousePoints.find();
    const result = houses.reduce((acc, house) => {
      const found = points.find(p => p.house === house);
      acc[house] = found ? found.points : 0;
      return acc;
    }, {});
    return result;
  }

  async updatePoints(updates) {
    const results = {};
    for (const [house, points] of Object.entries(updates)) {
      const updated = await HousePoints.findOneAndUpdate(
        { house },
        { points },
        { upsert: true, new: true }
      );
      results[house] = updated.points;
    }
    return results;
  }

  async resetPoints() {
    const houses = ['samburu', 'mara', 'amboseli', 'tsavo'];
    const results = {};
    for (const house of houses) {
      const updated = await HousePoints.findOneAndUpdate(
        { house },
        { points: 0 },
        { upsert: true, new: true }
      );
      results[house] = updated.points;
    }
    return results;
  }
}

export default new HousePointsController(); 