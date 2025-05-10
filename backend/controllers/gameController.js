const Game = require('../models/Game');

class GameController {
  async getAllGames() {
    return await Game.find()
      .sort({ startTime: 1 })
      .limit(10);
  }

  async createGame(gameData) {
    return await Game.create(gameData);
  }

  async updateGame(gameId, gameData) {
    return await Game.findByIdAndUpdate(
      gameId,
      gameData,
      { new: true }
    );
  }

  async updateScore(gameId, teamIndex, score) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');
    
    game.teams[teamIndex].score = score;
    await game.save();
    
    return game;
  }

  async deleteGame(gameId) {
    return await Game.findByIdAndDelete(gameId);
  }

  async getGameState(game) {
    const now = new Date();
    if (now < new Date(game.startTime)) return 'upcoming';
    if (now > new Date(game.endTime)) {
      if (now - new Date(game.endTime) < 24 * 60 * 60 * 1000) return 'final';
      return 'expired';
    }
    return 'live';
  }
}

module.exports = new GameController(); 