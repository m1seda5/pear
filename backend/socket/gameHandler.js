const gameController = require('../controllers/gameController');

function initializeGameHandler(io) {
  io.on('connection', (socket) => {
    // Handle game updates
    socket.on('updateGame', async (gameData) => {
      try {
        const updatedGame = await gameController.updateGame(gameData._id, gameData);
        io.emit('gameUpdated', updatedGame);
      } catch (error) {
        console.error('Error updating game:', error);
        socket.emit('error', 'Failed to update game');
      }
    });

    // Handle score updates
    socket.on('updateScore', async ({ gameId, teamIndex, score }) => {
      try {
        const game = await gameController.updateScore(gameId, teamIndex, score);
        io.emit('scoreUpdated', { gameId, teamIndex, score });
      } catch (error) {
        console.error('Error updating score:', error);
        socket.emit('error', 'Failed to update score');
      }
    });

    // Handle new game creation
    socket.on('createGame', async (gameData) => {
      try {
        const newGame = await gameController.createGame(gameData);
        io.emit('gameCreated', newGame);
      } catch (error) {
        console.error('Error creating game:', error);
        socket.emit('error', 'Failed to create game');
      }
    });

    // Handle game deletion
    socket.on('deleteGame', async (gameId) => {
      try {
        await gameController.deleteGame(gameId);
        io.emit('gameDeleted', gameId);
      } catch (error) {
        console.error('Error deleting game:', error);
        socket.emit('error', 'Failed to delete game');
      }
    });
  });
}

module.exports = initializeGameHandler; 