import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import { generateNotification, generatePostNotification, generateSmartNotification, generateNoPostNotification } from "../utils/notificationTemplates.js";
import Post from "../models/postModel.js";

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

// Helper function to send email notification
const sendEmailNotification = async (userId, message, template) => {
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
      html: template.replace("{{quickLoginLink}}", "")
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending notification email to user ${userId}:`, error);
  }
};

// Comment out or remove the sendIdleNotifications function and any code related to idle notifications
// export const sendIdleNotifications = async () => {
//   try {
//     // Get all users with email notifications enabled
//     const users = await User.find({
//       "notificationPreferences.email": true,
//       isBanned: false
//     });

//     if (users.length === 0) {
//       console.log("No users with email notifications enabled");
//       return;
//     }

//     // Generate notifications for each user
//     const notifications = await Promise.all(
//       users.map(async (user) => {
//         const notification = generateNotification(new Date().getHours(), new Date().getDay());
//         return {
//           userId: user._id,
//           message: notification.message,
//           template: notification.template
//         };
//       })
//     );

//     // Send notifications
//     for (const notification of notifications) {
//       await sendEmailNotification(
//         notification.userId,
//         notification.message,
//         notification.template
//       );
//     }

//     console.log(`Sent notifications to ${notifications.length} users`);
//   } catch (error) {
//     console.error("Error sending notifications:", error);
//   }
// };

// New function to send post notifications
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
        const notification = generatePostNotification(post.postedBy.username, postId);
        return {
          userId: user._id,
          message: notification.message,
          template: notification.template
        };
      })
    );

    // Send notifications
    for (const notification of notifications) {
      await sendEmailNotification(
        notification.userId,
        notification.message,
        notification.template
      );
    }

    console.log(`Sent post notifications to ${notifications.length} users`);
  } catch (error) {
    console.error("Error sending post notifications:", error);
  }
};

export const sendSmartNotifications = async () => {
  try {
    // Find users who have not logged in for 2-3 days
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const users = await User.find({
      "notificationPreferences.email": true,
      isBanned: false,
      $or: [
        { lastActive: { $lte: twoDaysAgo } },
        { lastActive: { $exists: false } }
      ]
    });

    if (users.length === 0) {
      console.log("No inactive users to notify");
      return;
    }

    // Generate and send smart notifications
    for (const user of users) {
      const notification = generateSmartNotification();
      await sendEmailNotification(user._id, notification.message, notification.template);
    }

    console.log(`Sent smart notifications to ${users.length} inactive users`);
  } catch (error) {
    console.error("Error sending smart notifications:", error);
  }
};

export const sendNoPostsTodayNotification = async () => {
  try {
    // Check for posts between 7:00 and 15:35 today
    const start = new Date();
    start.setHours(7, 0, 0, 0);
    const end = new Date();
    end.setHours(15, 35, 0, 0);
    const postCount = await Post.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });
    if (postCount > 0) {
      console.log("There were posts during school hours, not sending no-post notification.");
      return;
    }
    // Get all users with email notifications enabled and not banned
    const users = await User.find({
      "notificationPreferences.email": true,
      isBanned: false
    });
    if (users.length === 0) {
      console.log("No users to notify for no-posts-today.");
      return;
    }
    const notification = generateNoPostNotification();
    for (const user of users) {
      await sendEmailNotification(user._id, notification.message, notification.template);
    }
    console.log(`Sent no-posts-today notification to ${users.length} users`);
  } catch (error) {
    console.error("Error sending no-posts-today notification:", error);
  }
};