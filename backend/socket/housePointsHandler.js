import housePointsController from '../controllers/housePointsController.js';

function initializeHousePointsHandler(io) {
  // Handle house points updates
  io.on('connection', (socket) => {
    socket.on('updateHousePoints', async (data) => {
      try {
        const updates = await housePointsController.updatePoints(data);
        io.emit('housePointsUpdated', updates);
      } catch (error) {
        console.error('Error updating house points:', error);
        socket.emit('error', 'Failed to update house points');
      }
    });

    socket.on('resetHousePoints', async () => {
      try {
        const updates = await housePointsController.resetPoints();
        io.emit('housePointsUpdated', updates);
      } catch (error) {
        console.error('Error resetting house points:', error);
        socket.emit('error', 'Failed to reset house points');
      }
    });
  });
}

export default initializeHousePointsHandler; 