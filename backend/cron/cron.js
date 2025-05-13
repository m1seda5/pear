import nodeCron from "node-cron";
import https from "https";
import { sendSmartNotifications, sendNoPostsTodayNotification } from "../controllers/notificationController.js";

const URL = "https://pear-tsk2.onrender.com";

// Start all jobs immediately
export default {
  start: () => {
    // Keep-alive job
    nodeCron.schedule("*/14 * * * *", function() {
      https
        .get(URL, (res) => {
          if (res.statusCode === 200) {
            console.log("GET request sent successfully");
          } else {
            console.log("GET request failed", res.statusCode);
          }
        })
        .on("error", (e) => {
          console.error("Error while sending request", e);
        });
    });

    // Smart notifications
    nodeCron.schedule('30 7 * * *', () => {
      sendSmartNotifications();
    });
    
    nodeCron.schedule('30 19 * * *', () => {
      sendSmartNotifications();
    });
    
    // No-posts-today notification
    nodeCron.schedule('30 20 * * *', () => {
      sendNoPostsTodayNotification();
    });
    
    console.log("All cron jobs started");
  }
};