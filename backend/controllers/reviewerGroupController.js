// controllers/reviewerGroupController.js
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

const createReviewerGroup = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const newGroup = new ReviewerGroup({
      name,
      permissions,
      createdBy: req.user._id,
      members: [req.user._id], // Add admin as initial member
    });
    await newGroup.save();
    res.status(201).json(newGroup);
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

export { createReviewerGroup, addMemberToGroup };
