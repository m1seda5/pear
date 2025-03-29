// groupController.js
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const createGroup = async (req, res) => {
  try {
    const { name, description, color, members } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const existingGroup = await Group.findOne({ name: name.trim() });
    if (existingGroup) {
      return res.status(400).json({ error: "A group with this name already exists" });
    }

    if (members) {
      const validMembers = await User.find({ _id: { $in: members } });
      if (validMembers.length !== members.length) {
        return res.status(400).json({ error: "Invalid member IDs provided" });
      }
    }

    const newGroup = new Group({
      name,
      description,
      color: color || "#4CAF50",
      creator: req.user._id,
      members: members ? [...new Set([req.user._id, ...members])] : [req.user._id],
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await newGroup.save({ session });
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { groups: newGroup._id } }, { session });
      if (members?.length > 0) {
        await User.updateMany({ _id: { $in: members } }, { $addToSet: { groups: newGroup._id } }, { session });
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    res.status(201).json(newGroup);
  } catch (err) {
    console.error("Group creation error:", err);
    res.status(500).json({ error: "Failed to create group" });
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