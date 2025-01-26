const checkFrozen = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (user.isFrozen) {
        return res.status(403).json({ 
          error: "Account frozen. Contact support for assistance." 
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export default checkFrozen;