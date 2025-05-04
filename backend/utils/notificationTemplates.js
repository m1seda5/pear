// utils/notificationTemplates.js
export const notificationCategories = {
    MORNING: [
      "Good morning! 🌅 Check out what's new on Pear today",
      "Start your day with Pear - see what your peers are up to!",
      "Morning update: New posts and activities waiting for you"
    ],
    AFTERNOON: [
      "Afternoon check-in: Don't miss out on the latest updates!",
      "Catch up on what's happening during your break",
      "Your afternoon Pear update is here! 🍐"
    ],
    WEEKLY: [
      "Your weekly Pear digest is here! See what you missed",
      "Weekly highlights: Top posts and activities on Pear",
      "Weekend special: Check out what's trending on Pear"
    ]
};

export const generateNotification = (currentHour, currentDay) => {
  let message = "";
  
  if (currentHour >= 7 && currentHour <= 9) {
    message = "Good morning! 🌅 Start your day with Pear Network. Check out what's new and share your thoughts!";
  } else if (currentHour >= 13 && currentHour <= 16) {
    message = "Afternoon boost! ☀️ Take a break and catch up with your Pear Network community.";
  } else if (currentDay === 6) { // Saturday
    message = "Weekend special! 🌟 Don't miss out on the latest updates and discussions in Pear Network.";
  }

  return {
    message,
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">Pear Network Update</h2>
        <p style="font-size: 16px;">${message}</p>
        <a href="{{quickLoginLink}}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Quick Login
        </a>
        <p style="font-size: 14px; color: #666;">
          This link will expire in 1 hour. If you didn't request this notification, you can safely ignore it.
        </p>
      </div>
    `
  };
};

export const generatePostNotification = (posterUsername, postId) => {
  return {
    message: `${posterUsername} just made a new post on Pear. Don't miss out on the conversation!`,
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">New Post on Pear! 🍐</h2>
        <p style="font-size: 16px;">Hello! ${posterUsername} just made a new post on Pear.</p>
        <p style="font-size: 16px;">Don't miss out on the conversation!</p>
        <a href="{{quickLoginLink}}" 
           style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          View Post
        </a>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          You received this email because you have notifications enabled. 
          You can disable these in your Pear account settings.
        </p>
      </div>
    `
  };
};