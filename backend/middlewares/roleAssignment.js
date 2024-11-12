// roleAssignment.js

// roleAssignment.js

// const roleAssignment = (req, res, next) => {
//   const { yearGroup, isTeacher, isAdmin } = req.body;

//   // Determine role based on the provided information
//   if (yearGroup) {
//     req.user.role = "student";
//     req.user.yearGroup = yearGroup;
//   } else if (isTeacher) {
//     req.user.role = "teacher";
//   } else if (isAdmin) {
//     req.user.role = "admin";
//   } else {
//     return res.status(400).json({ error: "Invalid role information" });
//   }

//   next();
// };

// // Use default export
// export default roleAssignment;

// gthis is adding the tv role 
const roleAssignment = (req, res, next) => {
  const { email, yearGroup, isTeacher, isAdmin } = req.body;

  // Check if email contains 'tv' and assign role as TV
  if (email && email.includes("tv")) {
    req.body.role = "TV";  // Modify req.body directly instead of req.user
  } else if (yearGroup) {
    req.body.role = "student";
    req.body.yearGroup = yearGroup; // Ensure yearGroup is set in req.body
  } else if (isTeacher) {
    req.body.role = "teacher";
  } else if (isAdmin) {
    req.body.role = "admin";
  } else {
    return res.status(400).json({ error: "Invalid role information" });
  }

  next();
};

export default roleAssignment;