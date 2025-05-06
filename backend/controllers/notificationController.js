import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import { generateNotification, generatePostNotification } from "../utils/notificationTemplates.js";
import Post from "../models/postModel.js";
import { generateQuickLoginLink } from "./quickLoginController.js";

// Create Brevo SMTP transporter directly in this file
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "81d810001@smtp-brevo.com",
    pass: "6IBdE9hsKrHUxD4G",
  },
});

// Check for low activity (last hour)
const checkActivityLevel = async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentPosts = await Post.countDocuments({ createdAt: { $gte: oneHourAgo } });
  return recentPosts < 5; // Consider low activity if less than 5 posts in last hour
};

// Check if user has been active recently
const checkUserActivity = async (userId) => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentActivity = await Post.findOne({
    postedBy: userId,
    createdAt: { $gte: oneDayAgo }
  });
  return !recentActivity;
};

// Check if user has already received a notification today
const checkRecentNotification = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const recentNotification = await User.findOne({
    _id: userId,
    lastNotificationDate: { $gte: today }
  });
  
  return !recentNotification;
};

// Helper function to send email notification with quick login
const sendEmailNotification = async (userId, message, quickLoginLink, template) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) {
      console.error(`No email found for user ${userId}`);
      return;
    }

    const mailOptions = {
      from: "pearnet104@gmail.com",
      to: user.email,
      subject: "Pear Network Update",
      html: template.replace("{{quickLoginLink}}", quickLoginLink)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending notification email to user ${userId}:`, error);
  }
};

export const sendIdleNotifications = async () => {
  try {
    // Get all users with email notifications enabled
    const users = await User.find({
      "notificationPreferences.email": true,
      isBanned: false
    });

    if (users.length === 0) {
      console.log("No users with email notifications enabled");
      return;
    }

    // Generate notifications for each user
    const notifications = await Promise.all(
      users.map(async (user) => {
        const quickLoginLink = await generateQuickLoginLink(user._id);
        const notification = generateNotification(new Date().getHours(), new Date().getDay());
        return {
          userId: user._id,
          message: notification.message,
          quickLoginLink,
          template: notification.template
        };
      })
    );

    // Send notifications
    for (const notification of notifications) {
      await sendEmailNotification(
        notification.userId,
        notification.message,
        notification.quickLoginLink,
        notification.template
      );
    }

    console.log(`Sent notifications to ${notifications.length} users`);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

// New function to send post notifications with quick login
export const sendPostNotification = async (postId, posterId) => {
  try {
    const post = await Post.findById(postId).populate("postedBy", "username");
    if (!post) {
      console.error(`Post ${postId} not found`);
      return;
    }

    // Get users who have notifications enabled
    const users = await User.find({
      notificationsEnabled: true,
      isBanned: false,
      _id: { $ne: posterId } // Don't notify the poster
    });

    if (users.length === 0) {
      return;
    }

    // Generate notifications for each user
    const notifications = await Promise.all(
      users.map(async (user) => {
        // Generate quick login link with post path
        const quickLoginLink = await generateQuickLoginLink(
          user._id,
          `/posts/${postId}` // Direct path to the post
        );
        const notification = generatePostNotification(post.postedBy.username, postId);
        return {
          userId: user._id,
          message: notification.message,
          quickLoginLink,
          template: notification.template
        };
      })
    );

    // Send notifications
    for (const notification of notifications) {
      await sendEmailNotification(
        notification.userId,
        notification.message,
        notification.quickLoginLink,
        notification.template
      );
    }

    console.log(`Sent post notifications to ${notifications.length} users`);
  } catch (error) {
    console.error("Error sending post notifications:", error);
  }
};