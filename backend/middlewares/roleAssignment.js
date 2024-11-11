// roleAssignment.js

// roleAssignment.js

const roleAssignment = (req, res, next) => {
  const { yearGroup, isTeacher, isAdmin } = req.body;

  // Determine role based on the provided information
  if (yearGroup) {
    req.user.role = "student";
    req.user.yearGroup = yearGroup;
  } else if (isTeacher) {
    req.user.role = "teacher";
  } else if (isAdmin) {
    req.user.role = "admin";
  } else {
    return res.status(400).json({ error: "Invalid role information" });
  }

  next();
};

// Use default export
export default roleAssignment;
