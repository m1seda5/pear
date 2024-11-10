
// // this is the  checkchatacces debugging adding requser
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

//     if (dayOfWeek >= 1 && dayOfWeek <= 5) {
//       if (user.email.includes("students")) {
//         if (
//           currentTime < schoolStart ||
//           (currentTime >= lunchStart && currentTime <= lunchEnd) ||
//           currentTime > schoolEnd
//         ) {
//           return next();
//         } else {
//           return res.status(403).json({});
//         }
//       } else {
//         return res.status(403).json({});
//       }
//     } else {
//       return next();
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export default checkChatAccess;


// debuggin adding req user
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

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (user.email.includes("students")) {
        if (
          currentTime < schoolStart ||
          (currentTime >= lunchStart && currentTime <= lunchEnd) ||
          currentTime > schoolEnd
        ) {
          return next();
        } else {
          return res.status(403).json({});
        }
      } else {
        return res.status(403).json({});
      }
    } else {
      return next();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default checkChatAccess;
