import cron from "cron";
import https from "https";
import { sendIdleNotifications } from "../controllers/notificationController.js";

const URL = "https://pear-tsk2.onrender.com";

// Existing keep-alive job
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



// twe are back babyy


// Idle notification schedule
// const notificationJob = new cron.CronJob(
//   '0 8,12,15 * * 1-5', // At 8am, 12pm, 3pm on weekdays
//   sendIdleNotifications,
//   null,
//   true,
//   'Africa/Nairobi'
// );

// // Saturday special notification
// const saturdayJob = new cron.CronJob(
//   '30 12 * * 6', // Saturday at 12:30 PM
//   () => sendIdleNotifications(),
//   null,
//   true,
//   'Africa/Nairobi'
// );

export default {
  start: () => {
    keepAliveJob.start();
    // notificationJob.start();
    // saturdayJob.start();
    console.log("All cron jobs started");
  }
};

// CRON JOB EXPLANATION:
// Cron jobs are scheduled tasks that run periodically at fixed intervals or specific times
// send 1 GET request for every 14 minutes

// Schedule:
// You define a schedule using a cron expression, which consists of five fields representing:

//! MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

//? EXAMPLES && EXPLANATION:
//* 14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every Sunday
//* 30 3 15 * * - At 3:30 AM, on the 15th of every month
//* 0 0 1 1 * - At midnight, on January 1st
//* 0 * * * * - Every hour
