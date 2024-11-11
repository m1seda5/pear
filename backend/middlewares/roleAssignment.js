// roleAssignment.js

const roleAssignment = (req, res, next) => {
    const { yearGroup, isTeacher, isAdmin } = req.body;
  
    // Assign the role based on the provided information
    if (yearGroup) {
      // If the user has selected a year group, they are a student
      req.user.role = "student";
      req.user.yearGroup = yearGroup;
    } else if (isTeacher) {
      // If isTeacher is true, the user is a teacher
      req.user.role = "teacher";
    } else if (isAdmin) {
      // If isAdmin is true, the user is an admin
      req.user.role = "admin";
    } else {
      // If no valid role information is provided, return an error
      return res.status(400).json({ error: "Invalid role information" });
    }
  
    // Proceed to the next middleware or request handler
    next();
  };
  
  module.exports = roleAssignment;
  