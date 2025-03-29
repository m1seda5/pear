const adminOrTeacherMiddleware = async (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "teacher")) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Requires admin or teacher role." });
  }
};

export default adminOrTeacherMiddleware;