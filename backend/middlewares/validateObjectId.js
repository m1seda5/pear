// File: src/middlewares/validateObjectId.js

import mongoose from "mongoose";

const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        error: `Invalid ${paramName.replace('Id', ' ID')} format` 
      });
    }
    
    next();
  };
};

export default validateObjectId;