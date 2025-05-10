const HousePoints = require('../models/HousePoints');

class HousePointsController {
  async getAllPoints() {
    const points = await HousePoints.find();
    return points.reduce((acc, curr) => {
      acc[curr.house] = curr.points;
      return acc;
    }, {});
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

module.exports = new HousePointsController(); 