import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// this is is just a comment to see if anything is actually being affected and if im pushing changes as a head master thats all 
// Start of sendMessage function
// Add at the top of messageController.js
const MAX_GROUP_MEMBERS = parseInt(process.env.MAX_GROUP_MEMBERS) || 50;
 // Adjust number as needed

async function sendMessage(req, res) {
   try {
       const { recipientId, message } = req.body;
       let { img } = req.body;
       const senderId = req.user._id;


       let conversation = await Conversation.findOne({
           participants: { $all: [senderId, recipientId] },
       });


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


       if (img) {
           const uploadedResponse = await cloudinary.uploader.upload(img);
           img = uploadedResponse.secure_url;
       }


       const newMessage = new Message({
           conversationId: conversation._id,
           sender: senderId,
           text: message,
           img: img || "",
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


       const recipientSocketId = getRecipientSocketId(recipientId);
       if (recipientSocketId) {
           io.to(recipientSocketId).emit("newMessage", newMessage);
       }


       res.status(201).json(newMessage);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
}
// End of sendMessage function


// Start of getMessages function
async function getMessages(req, res) {
   const { otherUserId } = req.params;
   const userId = req.user._id;
   try {
       const conversation = await Conversation.findOne({
           participants: { $all: [userId, otherUserId] },
       });


       if (!conversation) {
           return res.status(404).json({ error: "Conversation not found" });
       }


       const messages = await Message.find({
           conversationId: conversation._id,
       }).sort({ createdAt: 1 });


       res.status(200).json(messages);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
}
// End of getMessages function


// Start of getConversations function
async function getConversations(req, res) {
   const userId = req.user._id;
   try {
       const conversations = await Conversation.find({ participants: userId }).populate({
           path: "participants",
           select: "username profilePic",
       });


       // remove the current user from the participants array
       conversations.forEach((conversation) => {
           conversation.participants = conversation.participants.filter(
               (participant) => participant._id.toString() !== userId.toString()
           );
       });
       res.status(200).json(conversations);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
}
// End of getConversations function


// Start of deleteMessage function
async function deleteMessage(req, res) {
   try {
       const { messageId } = req.params;
       const userId = req.user._id;


       const message = await Message.findById(messageId);


       // Check if the message exists and if the user is the sender
       if (!message || message.sender.toString() !== userId.toString()) {
           return res.status(403).json({ error: "You can only delete your own messages" });
       }


       // Delete the message
       await message.deleteOne();


       // Optionally, you can update the conversation's last message if the deleted message was the last one
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
// End of deleteMessage function
// Add new controller functions
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
      // Verify admin role
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
  
      // Send email to all participants
      const emailPromises = conversation.participants.map(async (participant) => {
        const mailOptions = {
          from: "pearnet104@gmail.com",
          to: participant.email,
          subject: "Conversation Monitoring Notice",
          text: `Dear ${participant.username},\n\nThis is to inform you that your conversation is now being monitored by an administrator.\n\nRegards,\nSupport Team`
        };
  
        return transporter.sendMail(mailOptions);
      });
  
      // Send socket notifications to online participants
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
  // Configurable constant at top of file



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

    // Remove the user from participants
    conversation.participants = conversation.participants.filter(
      p => p.toString() !== userId.toString()
    );

    await conversation.save();
    
    // Optionally notify the removed user
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

    // Notify all participants about the group update
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

async function createGroupChat(req, res) {
  try {
    const { participants, groupName } = req.body;
    const adminId = req.user._id;

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
        sender: adminId
      }
    });

    await groupChat.save();
    await groupChat.populate('participants', 'username profilePic email');
    
    // Direct email notification implementation
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "81d810001@smtp-brevo.com",
        pass: "6IBdE9hsKrHUxD4G"
      }
    });

    // Send email notifications to all participants
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

    // Send socket notifications to online participants
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

    // Wait for all email notifications to be sent
    await Promise.all(emailPromises.filter(Boolean));
    
    res.status(201).json(groupChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getGroupMessages(req, res) {
  const { groupId } = req.params;
  try {
    const messages = await Message.find({
      conversationId: groupId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}




export { sendMessage, getMessages, getConversations, deleteMessage, getAllConversations, sendMonitoringNotification, createGroupChat, addToGroup, updateGroup, removeFromGroup, getGroupMessages,  };
