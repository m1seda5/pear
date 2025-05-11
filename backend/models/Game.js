import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  teams: [{
    name: { type: String, required: true },
    logo: String,
    score: { type: Number, default: 0 }
  }],
  sport: { type: String, required: true },
  category: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  background: String,
  confettiTeam: String,
  state: {
    type: String,
    enum: ['upcoming', 'live', 'final'],
    default: 'upcoming'
  }
}, { timestamps: true });

gameSchema.index({ startTime: 1, state: 1 });

export default mongoose.model('Game', gameSchema); 