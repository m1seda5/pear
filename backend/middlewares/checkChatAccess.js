
// // original 
// import User from "../models/userModel.js";

// const checkChatAccess = async (req, res, next) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const userId = req.user._id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const currentDate = new Date();
//     const dayOfWeek = currentDate.getDay();
//     const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();

//     const schoolStart = 810;
//     const lunchStart = 1250;
//     const lunchEnd = 1340;
//     const schoolEnd = 1535;

//     // Check if the day is a school day (Monday to Friday)
//     if (dayOfWeek >= 1 && dayOfWeek <= 5) {
//       if (user.role === "student") {
//         // Student access based on time
//         if (
//           currentTime < schoolStart ||
//           (currentTime >= lunchStart && currentTime <= lunchEnd) ||
//           currentTime > schoolEnd
//         ) {
//           return next();
//         } else {
//           return res.status(403).json({ error: "Access denied during school hours" });
//         }
//       } else {
//         // Teachers and admins have full access during school days
//         return next();
//       }
//     } else {
//       // Weekend access (no restrictions)
//       return next();
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export default checkChatAccess;


// admin role update 
import User from "../models/userModel.js";

const checkChatAccess = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes();

    const schoolStart = 810;
    const lunchStart = 1250;
    const lunchEnd = 1340;
    const schoolEnd = 1535;

    // Check if the day is a school day (Monday to Friday)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (user.role === "student") {
        // Student access based on time (during school hours or lunch break)
        if (
          currentTime < schoolStart ||
          (currentTime >= lunchStart && currentTime <= lunchEnd) ||
          currentTime > schoolEnd
        ) {
          return next();
        } else {
          return res.status(403).json({ error: "Access denied during school hours" });
        }
      } else {
        // Teachers and admins have full access during school days
        return next();
      }
    } else {
      // Weekend access (no restrictions)
      return next();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default checkChatAccess;

