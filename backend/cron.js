import cron from "cron";
import https from "https";
import { sendIdleNotifications } from "../controllers/notificationController.js";

const URL = "https://pear-tsk2.onrender.com";

// Keep-alive job
const keepAliveJob = new cron.CronJob("*/14 * * * *", function() {
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

// Morning notifications (7:30 - 8:45)
const morningJob = new cron.CronJob(
  '30 7 * * 1-5', // At 7:30 AM on weekdays
  sendIdleNotifications,
  null,
  true,
  'Africa/Nairobi'
);

// Afternoon notifications (1:40 - 3:35)
const afternoonJob = new cron.CronJob(
  '40 13 * * 1-5', // At 1:40 PM on weekdays
  sendIdleNotifications,
  null,
  true,
  'Africa/Nairobi'
);

// Saturday special notification
const saturdayJob = new cron.CronJob(
  '30 12 * * 6', // Saturday at 12:30 PM
  () => sendIdleNotifications(),
  null,
  true,
  'Africa/Nairobi'
);

export default {
  start: () => {
    keepAliveJob.start();
    morningJob.start();
    afternoonJob.start();
    saturdayJob.start();
    console.log("All cron jobs started");
  }
}; 