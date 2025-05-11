import { Server } from "socket.io";
import { updatePoints, resetPoints } from '../controllers/housePointsController.js';

let ioInstance = null;

export const initializeSocket = (server) => {
    ioInstance = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });

    ioInstance.on("connection", (socket) => {
        console.log("user connected", socket.id);

        // In initializeHousePointsHandler.js
        socket.on('updateHousePoints', async (data) => {
            try {
                const updates = await updatePoints(data);
                ioInstance.emit('housePointsUpdated', updates); // Emits full state
            } catch (error) {
                console.error('Error updating house points:', error);
                socket.emit('error', 'Failed to update house points');
            }
        });

        socket.on('resetHousePoints', async () => {
            try {
                const updates = await resetPoints();
                ioInstance.emit('housePointsUpdated', updates); // Emits full state
            } catch (error) {
                console.error('Error resetting house points:', error);
                socket.emit('error', 'Failed to reset house points');
            }
        });

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
        });
    });

    return ioInstance;
};

export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.IO instance not initialized");
    }
    return ioInstance;
};