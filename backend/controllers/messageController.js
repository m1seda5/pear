import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

// this is is just a comment to see if anything is actually being affected and if im pushing changes as a head master thats all 
// Start of sendMessage function
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
      const conversation = await Conversation.findById(conversationId)
        .populate('participants', 'email');
  
      const participants = conversation.participants;
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
          user: "81d810001@smtp-brevo.com",
          pass: "6IBdE9hsKrHUxD4G"
        }
      });
  
      await Promise.all(participants.map(async (user) => {
        const mailOptions = {
          from: "pearnet104@gmail.com",
          to: user.email,
          subject: "Conversation Monitoring Notification",
          text: `Your conversation is being monitored by an admin.`
        };
        await transporter.sendMail(mailOptions);
      }));
  
      res.status(200).json({ message: "Notifications sent" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  


export { sendMessage, getMessages, getConversations, deleteMessage, getAllConversations, sendMonitoringNotification };
