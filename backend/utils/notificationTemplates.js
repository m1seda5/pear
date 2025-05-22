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
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://pear-tsk2.onrender.com/auth/login" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">Visit Pear</a>
      </div>
      <p style="font-size: 14px; color: #666;">
        Check out what's going on on Pear
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
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://pear-tsk2.onrender.com/auth/login" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">View Post</a>
      </div>
      <p style="font-size: 14px; color: #666;">
        Visit Pear Network to view the post.
      </p>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        You received this email because you have notifications enabled. 
        You can disable these in your Pear account settings.
      </p>
    </div>
  `
};
};

export const smartNotificationMessages = [
"👀 Psst… Brookhouse News is rolling in. Don't miss the buzz!",
"Your Pear feed is feeling a little lonely 🍐. Time to reconnect!",
"📣 Something's happening at Brookhouse… and you're missing it!",
"Hey, Brookhouse News is trending 🔥. Come see why!",
"🧠 Think. Share. Connect. You've done enough thinking – now come share 😉."
];

export const generateSmartNotification = () => {
const idx = Math.floor(Math.random() * smartNotificationMessages.length);
const message = smartNotificationMessages[idx];
return {
  message,
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <img src="https://pear-tsk2.onrender.com/logo.png" alt="Pear Network Logo" style="width: 80px; margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;" />
      <h2 style="color: #4CAF50; text-align: center;">Pear Network</h2>
      <p style="font-size: 16px; text-align: center;">${message}</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://pear-tsk2.onrender.com/auth/login" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">Visit Pear</a>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">
        Visit Pear Network to see what's new!
      </p>
    </div>
  `
};
};

export const generateNoPostNotification = () => {
const message = "Hey! At Pear, you have a platform to create and express yourself in a school environment. Why not make a post and share your thoughts with the community?";
return {
  message,
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <img src="https://pear-tsk2.onrender.com/logo.png" alt="Pear Network Logo" style="width: 80px; margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;" />
      <h2 style="color: #4CAF50; text-align: center;">Pear Network</h2>
      <p style="font-size: 16px; text-align: center;">${message}</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="https://pear-tsk2.onrender.com/auth/login" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">Visit Pear</a>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">
        Pear is your space to share, connect, and express yourself!
      </p>
    </div>
  `
};
};