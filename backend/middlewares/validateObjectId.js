// File: src/middlewares/validateObjectId.js

import mongoose from "mongoose";

const validateObjectId = (req, res, next) => {
    const { commentId } = req.params;

    // Check if the commentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).json({ error: "Invalid comment ID format." });
    }

    next();
};

export default validateObjectId;
