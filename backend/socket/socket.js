import { Server } from "socket.io";
import http from "http";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId: socketId
const userRooms = new Map(); // Keep track of rooms (conversations) each user is in

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
    
        ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Join direct message room
    socket.on("joinChat", (conversationId) => {
        if (userRooms.has(userId)) {
            userRooms.get(userId).forEach(room => {
                if (room.startsWith('chat_')) {
                    socket.leave(room);
                }
            });
        }
        
        const roomId = `chat_${conversationId}`;
        socket.join(roomId);
        
        if (!userRooms.has(userId)) {
            userRooms.set(userId, new Set());
        }
        userRooms.get(userId).add(roomId);
        
        console.log(`User ${userId} joined direct chat: ${roomId}`);
    });

    // Join group chat room
    socket.on("joinGroup", (groupId) => {
        const roomId = `group_${groupId}`;
        socket.join(roomId);
        
        if (!userRooms.has(userId)) {
            userRooms.set(userId, new Set());
        }
        userRooms.get(userId).add(roomId);
        
        console.log(`User ${userId} joined group: ${roomId}`);
    });

    // Handle new direct message
    socket.on("newMessage", (socketPayload) => {
        const { conversationId, receiverId, conversation, senderId } = socketPayload;
        const roomId = `chat_${conversationId}`;
        
        socket.to(roomId).emit("messageReceived", socketPayload);
        
        const recipientSocketId = getRecipientSocketId(receiverId);
        if (recipientSocketId) {
                ioInstance.to(recipientSocketId).emit("newMessageNotification", socketPayload);
        }
        
        if (conversation && !conversation.isGroup) {
            const recipient = conversation.participants.find(
                p => p.toString() !== senderId.toString()
            );
            
            if (recipient) {
                const recipientId = recipient.toString();
                const recipientSocket = getRecipientSocketId(recipientId);
                if (recipientSocket) {
                        ioInstance.to(recipientSocket).emit("newUnreadMessage");
                }
            }
        }
    });

    // Handle new group message
    socket.on("newGroupMessage", (socketPayload) => {
        const { conversationId } = socketPayload;
        const roomId = `group_${conversationId}`;
        socket.to(roomId).emit("messageReceived", socketPayload);
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

    // Message seen
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
                ioInstance.to(roomId).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.error("Error marking messages as seen:", error);
        }
    });

    // Group updates
    socket.on("groupUpdate", async (groupId) => {
        try {
            const updatedGroup = await Conversation.findById(groupId)
                .populate('participants', 'username profilePic');
                ioInstance.to(`group_${groupId}`).emit("groupUpdated", updatedGroup);
        } catch (error) {
            console.error("Error updating group:", error);
        }
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("user disconnected");
        
        if (userRooms.has(userId)) {
            userRooms.get(userId).forEach(room => {
                socket.leave(room);
            });
            userRooms.delete(userId);
        }
        
        delete userSocketMap[userId];
            ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));
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
