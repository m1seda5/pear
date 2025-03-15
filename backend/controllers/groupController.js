// controllers/groupController.js
import { Group } from "../models/groupModel.js";
import { User } from "../models/userModel.js";

const createGroup = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const newGroup = new Group({
      name,
      description,
      color,
      creator: req.user._id,
      members: [req.user._id],
    });

    await newGroup.save();

    // Add group to user's groups
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: newGroup._id },
    });

    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    }).populate("creator", "username profilePic");

    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createGroup, getGroups };
