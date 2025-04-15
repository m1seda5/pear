// groupController.js
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

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
      
      // Update members' groups arrays
      if (members?.length > 0) {
        const membersToUpdate = members.filter(id => id.toString() !== req.user._id.toString());
        if (membersToUpdate.length > 0) {
          const membersUpdate = await User.updateMany(
            { _id: { $in: membersToUpdate } },
            { $addToSet: { groups: savedGroup._id } },
            { session }
          );
          console.log("Members updated successfully:", membersUpdate);
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

export { createGroup, getGroups };