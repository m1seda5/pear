import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  teamA: {
    name: String,
    logo: String,
    players: [String]
  },
  teamB: {
    name: String,
    logo: String,
    players: [String]
  },
  scoreA: Number,
  scoreB: Number,
  status: {
    type: String,
    enum: ["live", "upcoming", "past"],
    default: "upcoming"
  },
  category: String,
  startTime: Date,
  endTime: Date,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '2d' } // Auto-delete after 2 days
  },
  type: {
    type: String,
    enum: ["match", "tournament"],
    default: "match"
  },
  tournamentDetails: {
    location: String,
    participants: [{
      team: { type: mongoose.Schema.Types.ObjectId, ref: 'PresetTeam' },
      position: Number,
      wins: Number,
      losses: Number
    }],
    currentRound: Number,
    totalRounds: Number
  }
}, { timestamps: true });

// Add the pre-save middleware
gameSchema.pre('save', function(next) {
  const now = new Date();
  if (this.status === 'live' && !this.endTime) {
    this.endTime = new Date(now.getTime() + 2*60*60*1000); // Auto-end after 2hrs
  }
  if (this.status === 'past' && !this.endTime) {
    this.endTime = now;
  }
  next();
});

const Game = mongoose.model("Game", gameSchema);
export default Game;