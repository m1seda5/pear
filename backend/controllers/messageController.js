import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, getIO } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const MAX_GROUP_MEMBERS = parseInt(process.env.MAX_GROUP_MEMBERS) || 50;

async function sendMessage(req, res) {
  try {
    const { conversationId, recipientId, message, img } = req.body;
    const senderId = req.user._id;
    let conversation;

    // Input validation
    if (!message && !img) {
      return res.status(400).json({ error: "Message or image is required" });
    }

    // Handle group chat message
    if (conversationId) {
      // First fetch without populating to check membership
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Check if user is a participant using string comparison of IDs
      const isParticipant = conversation.participants.some(
        participantId => participantId.toString() === senderId.toString()
      );

      if (!isParticipant) {
        return res.status(403).json({ error: "Not authorized to send messages in this conversation" });
      }
      
      // Now populate if needed for later operations
      if (conversation.isGroup) {
        await conversation.populate('participants');
      }
    } 
    // Handle direct message
    else if (recipientId) {
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
        isGroup: { $ne: true }  // Ensure it's not a group conversation
      });
      
      // Create new conversation for direct messages if it doesn't exist
      if (!conversation) {
        conversation = new Conversation({
          participants: [senderId, recipientId],
          lastMessage: {
            text: message,
            sender: senderId,
          },
        });
        await conversation.save();
      }
    } 
    else {
      return res.status(400).json({ error: "Invalid request - either conversationId or recipientId is required" });
    }

    // Process image if provided
    let imageUrl = "";
    if (img) {
      try {
        const uploadedResponse = await cloudinary.uploader.upload(img);
        imageUrl = uploadedResponse.secure_url;
      } catch (error) {
        console.error("Image upload error:", error);
        return res.status(400).json({ error: "Failed to upload image" });
      }
    }

    // Create and save the new message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: imageUrl,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    // Populate sender details for the response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username profilePic');

    // Emit socket event for real-time updates
    const io = getIO();
    const socketPayload = {
      conversationId: conversation._id,
      receiverId: recipientId,
      conversation,
      senderId,
      message: populatedMessage,
    };

    if (conversation.isGroup) {
      io.to(`group_${conversation._id}`).emit("newGroupMessage", socketPayload);
    } else {
      io.to(`chat_${conversation._id}`).emit("newMessage", socketPayload);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
// messageController.js - Update getMessages function
// In messageController.js - Updated getMessages function
async function getMessages(req, res) {
  const { otherUserId } = req.params;
  const userId = req.user._id;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
      isGroup: false, // Exclude group chats
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    })
      .populate('sender', 'username profilePic') // Populate sender details
      .sort({ createdAt: 1 }); // Sort messages by creation date (ascending)

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function getConversations(req, res) {
  const userId = req.user._id;
  try {
      const conversations = await Conversation.find({ participants: userId })
          .populate({
              path: "participants",
              select: "username profilePic"
          })
          .populate("lastMessage.sender", "username")
          .sort({ updatedAt: -1 });

      conversations.forEach((conversation) => {
          if (!conversation.isGroup) {
              conversation.participants = conversation.participants.filter(
                  (participant) => participant._id.toString() !== userId.toString()
              );
          }
      });

      const uniqueConversations = Array.from(new Map(
          conversations.map(conv => [conv._id.toString(), conv])
      ).values());

      res.status(200).json(uniqueConversations);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

async function deleteMessage(req, res) {
   try {
       const { messageId } = req.params;
       const userId = req.user._id;

       const message = await Message.findById(messageId);

       if (!message || message.sender.toString() !== userId.toString()) {
           return res.status(403).json({ error: "You can only delete your own messages" });
       }

       await message.deleteOne();

       const conversation = await Conversation.findById(message.conversationId);
       if (conversation && conversation.lastMessage && conversation.lastMessage.text === message.text) {
           const lastMessage = await Message.findOne({ conversationId: message.conversationId }).sort({ createdAt: -1 });
           if (lastMessage) {
               conversation.lastMessage = {
                   text: lastMessage.text,
                   sender: lastMessage.sender,
               };
           } else {
               conversation.lastMessage = { text: "", sender: "" };
           }
           await conversation.save();
       }

       res.status(200).json({ message: "Message deleted successfully" });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
}

async function getAllConversations(req, res) {
    try {
      const conversations = await Conversation.find()
        .populate({
          path: "participants",
          select: "username profilePic role",
        })
        .where('participants.role').in(['student', 'teacher'])
        .where('participants.1').exists(true);
  
      const studentTeacherConvos = conversations.filter(conv => {
        const roles = conv.participants.map(p => p.role);
        return roles.includes('student') && roles.includes('teacher');
      });
  
      res.status(200).json(studentTeacherConvos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

async function sendMonitoringNotification(req, res) {
    const { conversationId } = req.params;
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Only admins can send monitoring notifications" });
      }
  
      const conversation = await Conversation.findById(conversationId)
        .populate('participants', 'email username');
  
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
  
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: "81d810001@smtp-brevo.com",
          pass: "6IBdE9hsKrHUxD4G"
        }
      });
  
      const emailPromises = conversation.participants.map(async (participant) => {
        const mailOptions = {
          from: "pearnet104@gmail.com",
          to: participant.email,
          subject: "Conversation Monitoring Notice",
          text: `Dear ${participant.username},\n\nThis is to inform you that your conversation is now being monitored by an administrator.\n\nRegards,\nSupport Team`
        };
  
        return transporter.sendMail(mailOptions);
      });
  
      conversation.participants.forEach(participant => {
        const recipientSocketId = getRecipientSocketId(participant._id.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("monitoringNotification", {
            message: "Your conversation is being monitored by an administrator",
            conversationId
          });
        }
      });
  
      await Promise.all(emailPromises);
  
      res.status(200).json({ message: "Monitoring notifications sent successfully" });
    } catch (error) {
      console.error("Error sending monitoring notification:", error);
      res.status(500).json({ error: error.message });
    }
}

async function createGroupChat(req, res) {
  try {
    const { participants, groupName } = req.body;
    const adminId = req.user._id;

    // Validate participants array
    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: "Invalid participants" });
    }

    if (participants.length + 1 > MAX_GROUP_MEMBERS) {
      return res.status(400).json({ error: `Maximum ${MAX_GROUP_MEMBERS} members allowed` });
    }

    const groupChat = new Conversation({
      participants: [adminId, ...participants],
      isGroup: true,
      groupName,
      groupAdmin: adminId,
      lastMessage: {
        text: `${req.user.username} created the group`,
        sender: adminId,
        seen: false
      }
    });

    await groupChat.save();
    
    await groupChat.populate({
      path: 'participants',
      select: 'username profilePic email',
      transform: (doc) => doc || null
    });
    
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "81d810001@smtp-brevo.com",
        pass: "6IBdE9hsKrHUxD4G"
      }
    });

    const emailPromises = groupChat.participants.map(async (participant) => {
      if (participant._id.toString() !== adminId.toString()) {
        const mailOptions = {
          from: "pearnet104@gmail.com",
          to: participant.email,
          subject: "New Group Chat Invitation",
          text: `You have been added to the group "${groupName}" by ${req.user.username}.`
        };
        
        return transporter.sendMail(mailOptions);
      }
    });

    groupChat.participants.forEach(participant => {
      if (participant._id.toString() !== adminId.toString()) {
        const recipientSocketId = getRecipientSocketId(participant._id.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newGroup", {
            message: `You have been added to ${groupName}`,
            groupChat
          });
        }
      }
    });

    await Promise.all(emailPromises.filter(Boolean));
    
    res.status(201).json({
      ...groupChat.toJSON(),
      participants: groupChat.participants.map(p => ({
        _id: p._id,
        username: p.username,
        profilePic: p.profilePic,
        email: p.email
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addToGroup(req, res) {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;
    
    const conversation = await Conversation.findById(conversationId);
    
    if (conversation.participants.length >= conversation.groupMembersLimit) {
      return res.status(400).json({ error: "Group member limit reached" });
    }
    
    if (!conversation.participants.includes(userId)) {
      conversation.participants.push(userId);
      await conversation.save();
    }
    
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function removeFromGroup(req, res) {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;
    const adminId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (conversation.groupAdmin.toString() !== adminId.toString()) {
      return res.status(403).json({ error: "Only admin can remove members" });
    }

    if (userId === conversation.groupAdmin.toString()) {
      return res.status(403).json({ error: "Admin cannot be removed" });
    }

    conversation.participants = conversation.participants.filter(
      p => p.toString() !== userId.toString()
    );

    // Check minimum participants after removal
    if (conversation.participants.length < 2) {
      return res.status(400).json({ error: "Group must have at least 2 members" });
    }

    await conversation.save();
    
    const recipientSocketId = getRecipientSocketId(userId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("removedFromGroup", {
        conversationId,
        message: "You have been removed from the group"
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateGroup(req, res) {
  try {
    const { conversationId } = req.params;
    const { groupName } = req.body;
    const adminId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (conversation.groupAdmin.toString() !== adminId.toString()) {
      return res.status(403).json({ error: "Only admin can update group" });
    }

    conversation.groupName = groupName;
    await conversation.save();

    conversation.participants.forEach(participantId => {
      const recipientSocketId = getRecipientSocketId(participantId.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("groupUpdated", {
          conversationId,
          groupName
        });
      }
    });

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getGroupMessages(req, res) {
  try {
    // Update to use conversationId from params to match the route
    const conversationId = req.params.conversationId;
    
    // Verify the conversation exists and is a group
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    
    if (!conversation.isGroup) {
      return res.status(400).json({ error: "This is not a group conversation" });
    }

    // Fetch messages with proper population and sorting
    const messages = await Message.find({ 
      conversationId: conversationId 
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'username profilePic')
    .lean(); // Use lean() for better performance
    
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getGroupMessages:", error);
    res.status(500).json({ 
      error: "Failed to fetch group messages",
      details: error.message 
    });
  }
}



async function checkExistingGroup(req, res) {
  try {
    const group = await Conversation.findOne({
      groupName: req.query.name,
      isGroup: true
    });
    res.status(200).json(!!group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Add to existing exports
async function getUnreadCount(req, res) {
  try {
    const userId = req.user._id;
    
    const conversations = await Conversation.find({
      participants: userId,
    });

    const conversationIds = conversations.map(c => c._id);

    const unreadCount = await Message.countDocuments({
      conversationId: { $in: conversationIds },
      sender: { $ne: userId },
      seen: false
    });

    res.status(200).json({ count: unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



export {
  sendMessage,
  getMessages,
  getConversations,
  deleteMessage,
  getAllConversations,
  sendMonitoringNotification,
  createGroupChat,
  addToGroup,
  updateGroup,
  removeFromGroup,
  getGroupMessages,
  checkExistingGroup,
  getUnreadCount
};