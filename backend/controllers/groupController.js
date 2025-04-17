import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "81d810001@smtp-brevo.com",
    pass: "6IBdE9hsKrHUxD4G",
  },
});

// Helper function to send group notification email
const sendNotificationEmail = async (recipientEmail, subject, message) => {
  const mailOptions = {
    from: "pearnet104@gmail.com",
    to: recipientEmail,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">Group Update on Pear! 🍐</h2>
        <p style="font-size: 16px;">${message}</p>
        <p style="font-size: 16px;">This allows you to target posts to that group of people and receive posts that are relevant to you.</p>
        <a href="https://pear-tsk2.onrender.com/groups" 
           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          View Groups
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          You received this email because you have notifications enabled. 
          You can disable these in your Pear account settings.
        </p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Group notification email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`Error sending group notification email to ${recipientEmail}:`, error);
  }
};

// Notification helper for group updates
const sendGroupNotification = async (userId, message) => {
  const user = await User.findById(userId);
  if (!user || !user.notificationPreferences) return;
  await sendNotificationEmail(
    user.email,
    "Group Update on Pear",
    message
  );
};

const createGroup = async (req, res) => {
  try {
    console.log("Received group creation request:", {
      body: req.body,
      user: req.user
    });

    const { name, description, color, members: rawMembers } = req.body;
    
    // Validate required fields
    if (!name?.trim()) {
      console.log("Validation failed: Group name is required");
      return res.status(400).json({ error: "Group name is required" });
    }

    if (!req.user?._id) {
      console.log("Validation failed: User not authenticated");
      return res.status(401).json({ error: "Unauthorized - User not authenticated" });
    }

    // Check for existing group
    const existingGroup = await Group.findOne({ name: name.trim() });
    if (existingGroup) {
      console.log("Validation failed: Group name already exists");
      return res.status(400).json({ error: "A group with this name already exists" });
    }

    // Deduplicate and validate members
    const members = rawMembers ? [...new Set(rawMembers)] : undefined;
    
    if (members) {
      const validMembers = await User.find({ _id: { $in: members } });
      if (validMembers.length !== members.length) {
        console.log("Validation failed: Invalid member IDs");
        return res.status(400).json({ error: "Invalid member IDs provided" });
      }
    }

    const newGroup = new Group({
      name: name.trim(),
      description: description?.trim(),
      color: color || "#4CAF50",
      creator: req.user._id,
      members: members ? [...new Set([req.user._id, ...members])] : [req.user._id],
    });

    console.log("Creating new group:", newGroup);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Save the group first
      const savedGroup = await newGroup.save({ session });
      console.log("Group saved successfully:", savedGroup);
      
      // Update creator's groups array
      const creatorUpdate = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { groups: savedGroup._id } },
        { session, new: true }
      );
      console.log("Creator updated successfully:", creatorUpdate);
      
      // Update members' groups arrays and send notifications
      if (members?.length > 0) {
        const membersToUpdate = members.filter(id => id.toString() !== req.user._id.toString());
        if (membersToUpdate.length > 0) {
          const membersUpdate = await User.updateMany(
            { _id: { $in: membersToUpdate } },
            { $addToSet: { groups: savedGroup._id } },
            { session }
          );
          console.log("Members updated successfully:", membersUpdate);
          
          // Send notifications to added members
          const creatorUser = await User.findById(req.user._id);
          for (const memberId of membersToUpdate) {
            await sendGroupNotification(
              memberId, 
              `You have been added to the group "${savedGroup.name}" by ${creatorUser.username || 'a user'}`
            );
          }
        }
      }
      
      await session.commitTransaction();
      console.log("Transaction committed successfully");
      
      // Populate the response with user details
      const populatedGroup = await Group.findById(savedGroup._id)
        .populate('creator', 'username profilePic')
        .populate('members', 'username profilePic');
      
      res.status(201).json(populatedGroup);
    } catch (error) {
      await session.abortTransaction();
      console.error("Transaction error:", error);
      // Return more detailed error information
      res.status(500).json({ 
        error: "Failed to create group", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error("Group creation error:", err);
    if (err.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ error: "A group with this name already exists" });
    }
    res.status(500).json({ 
      error: "Failed to create group", 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

const getGroups = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const groups = await Group.find({ members: req.user._id })
      .populate("creator", "username profilePic")
      .populate("members", "username profilePic")
      .lean();
    res.status(200).json(groups || []);
  } catch (err) {
    console.error("Groups fetch error:", err);
    res.status(500).json({ error: "Failed to load groups" });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('members', 'username profilePic')
      .populate('creator', 'username');
    
    if (!group) return res.status(404).json({ error: "Group not found" });
    
    res.status(200).json(group.members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeGroupMember = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const group = await Group.findById(req.params.groupId).session(session);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only group creator can remove members" });
    }

    // Get removed user details and group details before removal
    const removedUser = await User.findById(req.params.userId);
    const adminUser = await User.findById(req.user._id);

    // Remove member from group
    group.members = group.members.filter(m => m.toString() !== req.params.userId);
    await group.save({ session });

    // Remove group from user's groups
    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { groups: group._id }
    }, { session });

    await session.commitTransaction();
    
    // Send notification to removed user after successful transaction
    await sendGroupNotification(
      req.params.userId,
      `You have been removed from the group "${group.name}" by ${adminUser.username || 'the group admin'}`
    );
    
    res.status(200).json({ message: "Member removed successfully" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

const leaveGroup = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const group = await Group.findById(req.params.groupId).session(session);
    if (!group) return res.status(404).json({ error: "Group not found" });
    
    const leavingUser = await User.findById(req.user._id);

    // If user is creator, delete the group
    if (group.creator.toString() === req.user._id.toString()) {
      // Get all group members for notifications
      const groupMembers = [...group.members].filter(
        m => m.toString() !== req.user._id.toString()
      );
      
      await Group.deleteOne({ _id: group._id }).session(session);
      await User.updateMany(
        { groups: group._id },
        { $pull: { groups: group._id } },
        { session }
      );
      
      await session.commitTransaction();
      
      // Notify all members that group was deleted
      for (const memberId of groupMembers) {
        await sendGroupNotification(
          memberId,
          `The group "${group.name}" has been deleted by ${leavingUser.username || 'the group creator'}`
        );
      }
    } else {
      // Regular member leaving
      group.members = group.members.filter(m => m.toString() !== req.user._id.toString());
      await group.save({ session });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { groups: group._id }
      }, { session });
      
      await session.commitTransaction();
      
      // Notify group creator that a member left
      await sendGroupNotification(
        group.creator,
        `${leavingUser.username || 'A member'} has left your group "${group.name}"`
      );
    }

    res.status(200).json({ message: "Left group successfully" });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

export { createGroup, getGroups, getGroupMembers, removeGroupMember, leaveGroup };