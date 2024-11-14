// adminMiddleware.js

const adminMiddleware = (req, res, next) => {
    // Assuming user is already authenticated and user details are in req.user (from previous auth middleware)
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next(); // If the user is an admin, proceed to the next middleware/handler
  };
  
  export default adminMiddleware;
  