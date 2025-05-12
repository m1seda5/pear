import mongoose from 'mongoose';

const housePointsSchema = new mongoose.Schema({
 house: {
   type: String,
   required: true,
   enum: ['samburu', 'mara', 'amboseli', 'tsavo']
 },
 points: {
   type: Number,
   required: true,
   default: 0,
   min: 0,
   max: 100 // Added max constraint
 }
}, { timestamps: true });

// Ensure only one document per house
housePointsSchema.index({ house: 1 }, { unique: true });

export default mongoose.model('HousePoints', housePointsSchema); 