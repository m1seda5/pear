import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId: socketId
const userRooms = new Map(); // Keep track of rooms (conversations) each user is in

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId != "undefined") {
        userSocketMap[userId] = socket.id;
        
        // Clean up any existing rooms for this user
        if (userRooms.has(userId)) {
            userRooms.get(userId).forEach(room => {
                socket.leave(room);
            });
        }
        userRooms.set(userId, new Set());
    }
    
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Join direct message room
    socket.on("joinChat", (conversationId) => {
        // Leave previous rooms first
        if (userRooms.has(userId)) {
            userRooms.get(userId).forEach(room => {
                socket.leave(room);
            });
            userRooms.get(userId).clear();
        }
        
        const roomId = `chat_${conversationId}`;
        socket.join(roomId);
        userRooms.get(userId).add(roomId);
        console.log(`User ${userId} joined chat: ${roomId}`);
    });

    // Join group chat room
    socket.on("joinGroup", (groupId) => {
        const roomId = `group_${groupId}`;
        socket.join(roomId);
        if (userRooms.has(userId)) {
            userRooms.get(userId).add(roomId);
        }
        console.log(`User ${userId} joined group: ${roomId}`);
    });

    // Typing indicator with throttling
    let lastEmit = 0;
    socket.on("typing", ({ conversationId, isGroup }) => {
        const now = Date.now();
        if (now - lastEmit > 200) {
            const roomId = isGroup ? `group_${conversationId}` : `chat_${conversationId}`;
            socket.to(roomId).emit("typing", { conversationId });
            lastEmit = now;
        }
    });

    socket.on("stopTyping", ({ conversationId, isGroup }) => {
        const roomId = isGroup ? `group_${conversationId}` : `chat_${conversationId}`;
        socket.to(roomId).emit("stopTyping", { conversationId });
    });

    // Message seen functionality
    socket.on("markMessagesAsSeen", async ({ conversationId, userId, isGroup }) => {
        try {
            await Message.updateMany(
                { conversationId: conversationId, seen: false },
                { $set: { seen: true } }
            );
            
            await Conversation.updateOne(
                { _id: conversationId },
                { $set: { "lastMessage.seen": true } }
            );

            const roomId = isGroup ? `group_${conversationId}` : `chat_${conversationId}`;
            io.to(roomId).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.error("Error marking messages as seen:", error);
        }
    });

    // Group updates
    socket.on("groupUpdate", async (groupId) => {
        try {
            const updatedGroup = await Conversation.findById(groupId)
                .populate('participants', 'username profilePic');
            io.to(`group_${groupId}`).emit("groupUpdated", updatedGroup);
        } catch (error) {
            console.error("Error updating group:", error);
        }
    });

    // Disconnect handler
    socket.on("disconnect", () => {
        console.log("user disconnected");
        
        // Clean up rooms
        if (userRooms.has(userId)) {
            userRooms.get(userId).forEach(room => {
                socket.leave(room);
            });
            userRooms.delete(userId);
        }
        
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app };