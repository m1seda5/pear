import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import { generateNotification } from "../utils/notificationTemplates.js";
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

export const sendIdleNotifications = async () => {
  try {
    const isLowActivity = await checkActivityLevel();
    if (!isLowActivity) return;

    const { subject, message } = generateNotification();
    const users = await User.find({ 
      notificationPreferences: true,
      isBanned: false
    }).select("email");

    const notificationPromises = users.map(user => {
      const mailOptions = {
        from: "pearnet104@gmail.com",
        to: user.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4CAF50;">${subject}</h2>
            <p style="font-size: 16px;">${message}</p>
            <a href="https://pear-tsk2.onrender.com" 
               style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
              View What's Going On
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              You received this email because you have notifications enabled. 
              <a href="https://pear-tsk2.onrender.com/settings">Adjust preferences</a>
            </p>
          </div>
        `
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.allSettled(notificationPromises);
    console.log(`Sent idle notifications to ${users.length} users`);
  } catch (error) {
    console.error("Error sending idle notifications:", error);
  }
};