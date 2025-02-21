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

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.handshake.query.userId;

    if (userId != "undefined") userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Existing message seen functionality
    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
        try {
            await Message.updateMany(
                { conversationId: conversationId, seen: false },
                { $set: { seen: true } }
            );
            await Conversation.updateOne(
                { _id: conversationId },
                { $set: { "lastMessage.seen": true } }
            );
            io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.log(error);
        }
    });

    // New group-related socket handlers
    socket.on("joinGroups", (groupIds) => {
        groupIds.forEach(groupId => {
            socket.join(`group_${groupId}`);
        });
    });

    // New single group join handler
    socket.on("joinGroup", (groupId) => {
        socket.join(`group_${groupId}`);
        console.log(`User joined group: group_${groupId}`);
    });

    socket.on("groupUpdate", async (groupId) => {
        try {
            const updatedGroup = await Conversation.findById(groupId)
                .populate('participants', 'username profilePic');
            io.to(`group_${groupId}`).emit("groupUpdated", updatedGroup);
        } catch (error) {
            console.log(error);
        }
    });

    // Disconnect handler
    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app };