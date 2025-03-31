// utils/notificationTemplates.js
export const notificationCategories = {
    FEATURES: [
      "Did you know you can customize your feed on Pear?",
      "Check out what's happening in your Connection Hub!"
    ],
    ENGAGEMENT: [
      "You know that business you've been wanting to push? Post it and get feedback!",
      "Decide who sees your posts with Custom Posting Groups."
    ],
    UPDATES: [
      "Get notices, announcements for your year group, form room, and general announcements all in one place."
    ]
  };
  
  export const generateNotification = () => {
    const day = new Date().getDay();
    const isWeekday = day >= 1 && day <= 5; // Monday-Friday
    
    // Saturday special notification
    if (day === 6) {
      return {
        subject: "Weekly Pear Update 🍐",
        message: "Check out what's new on Pear this week!",
        type: "WEEKLY"
      };
    }
  
    // Randomly select category for weekdays
    const categories = isWeekday 
      ? ['FEATURES', 'ENGAGEMENT', 'UPDATES']
      : ['FEATURES', 'ENGAGEMENT'];
    
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const messages = notificationCategories[selectedCategory];
    
    return {
      subject: `Pear Update: ${selectedCategory}`,
      message: messages[Math.floor(Math.random() * messages.length)],
      type: selectedCategory
    };
  };