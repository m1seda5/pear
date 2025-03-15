// controllers/groupController.js
import  Group  from "../models/groupModel.js";
import  User  from "../models/userModel.js";

const createGroup = async (req, res) => {
  try {
    const { name, description, color, members } = req.body;
    
    // Validate input
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }
    
    // Check if a group with the same name already exists
    const existingGroup = await Group.findOne({ name: name.trim() });
    if (existingGroup) {
      return res.status(400).json({ error: "A group with this name already exists" });
    }
    
    // Create new group
    const newGroup = new Group({
      name,
      description,
      color,
      creator: req.user._id,
      members: members ? [...new Set([req.user._id, ...members])] : [req.user._id],
    });
    
    await newGroup.save();
    
    // Add group to user's groups
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: newGroup._id },
    });
    
    // Add group to all members' groups
    if (members && members.length > 0) {
      await User.updateMany(
        { _id: { $in: members } },
        { $push: { groups: newGroup._id } }
      );
    }
    
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// groupController.js
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    }).populate("creator", "username profilePic");

    if (!groups || groups.length === 0) {
      return res.status(404).json({ error: "No groups found" });
    }

    res.status(200).json(groups);
  } catch (err) {
    console.error("Groups fetch error:", err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

export { createGroup, getGroups };
