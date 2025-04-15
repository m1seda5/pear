// groupController.js
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const createGroup = async (req, res) => {
  try {
    const { name, description, color, members: rawMembers } = req.body;
    
    // Validate required fields
    if (!name?.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ error: "Unauthorized - User not authenticated" });
    }

    // Check for existing group
    const existingGroup = await Group.findOne({ name: name.trim() });
    if (existingGroup) {
      return res.status(400).json({ error: "A group with this name already exists" });
    }

    // Deduplicate and validate members
    const members = rawMembers ? [...new Set(rawMembers)] : undefined;
    
    if (members) {
      const validMembers = await User.find({ _id: { $in: members } });
      if (validMembers.length !== members.length) {
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

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await newGroup.save({ session });
      
      // Add group to creator
      await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { groups: newGroup._id } },
        { session }
      );
      
      // Add group to members (excluding creator if present)
      if (members?.length > 0) {
        const membersToUpdate = members.filter(id => id.toString() !== req.user._id.toString());
        if (membersToUpdate.length > 0) {
          await User.updateMany(
            { _id: { $in: membersToUpdate } },
            { $addToSet: { groups: newGroup._id } },
            { session }
          );
        }
      }
      
      await session.commitTransaction();
      res.status(201).json(newGroup);
    } catch (error) {
      await session.abortTransaction();
      console.error("Transaction error:", error);
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error("Group creation error:", err);
    if (err.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({ error: "A group with this name already exists" });
    }
    res.status(500).json({ error: "Failed to create group. Please try again." });
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