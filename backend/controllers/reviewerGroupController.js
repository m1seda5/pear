import ReviewerGroup from "../models/reviewerGroupModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "81d810001@smtp-brevo.com",
    pass: "6IBdE9hsKrHUxD4G",
  },
});

// controllers/reviewerGroupController.js
const createReviewerGroup = async (req, res) => {
  try {
    const { name, permissions, members } = req.body;
    const newGroup = new ReviewerGroup({
      name,
      permissions,
      members: members ? [...members, req.user._id] : [req.user._id], // Add admin as initial member
      createdBy: req.user._id
    });
    
    await newGroup.save();
    
    // Add group reference to users
    if (members && members.length > 0) {
      await User.updateMany(
        { _id: { $in: members } },
        { $addToSet: { reviewerGroups: newGroup._id } }
      );
    }

    res.status(201).json(await newGroup.populate('members'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewerGroups = async (req, res) => {
  try {
    const groups = await ReviewerGroup.find()
      .populate("members", "username email profilePic role lastActive")
      .populate("createdBy", "username email");
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReviewerGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    
    const updatedGroup = await ReviewerGroup.findByIdAndUpdate(
      id,
      { name, permissions },
      { new: true }
    ).populate("members", "username email profilePic role lastActive");
    
    if (!updatedGroup) {
      return res.status(404).json({ error: "Reviewer group not found" });
    }
    
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReviewerGroup = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedGroup = await ReviewerGroup.findByIdAndDelete(id);
    
    if (!deletedGroup) {
      return res.status(404).json({ error: "Reviewer group not found" });
    }
    
    res.status(200).json({ message: "Reviewer group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (user.role === "student") {
      return res
        .status(400)
        .json({ error: "Cannot add students to reviewer groups" });
    }
    
    const group = await ReviewerGroup.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate("members", "username email profilePic role lastActive");
    
    // Send email notification
    const mailOptions = {
      from: "pearnet104@gmail.com",
      to: user.email,
      subject: "You've been added to a Reviewer Group",
      html: `<p>You've been added to the reviewer group "${group.name}". You can now review posts in the system.</p>`,
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    
    const group = await ReviewerGroup.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    ).populate("members", "username email profilePic role lastActive");
    
    if (!group) {
      return res.status(404).json({ error: "Reviewer group not found" });
    }
    
    const user = await User.findById(userId);
    
    // Send email notification
    if (user && user.email) {
      const mailOptions = {
        from: "pearnet104@gmail.com",
        to: user.email,
        subject: "Removed from Reviewer Group",
        html: `<p>You have been removed from the reviewer group "${group.name}".</p>`,
      };
      
      await transporter.sendMail(mailOptions);
    }
    
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { 
  createReviewerGroup, 
  getReviewerGroups, 
  updateReviewerGroup, 
  deleteReviewerGroup, 
  addMemberToGroup, 
  removeMemberFromGroup 
};
