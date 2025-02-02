import mongoose from "mongoose";

const tempUserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  yearGroup: String,
  department: String,
  otp: {
    type: Number,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  lastOtpSent: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Auto-delete temporary records after 10 minutes
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

const TempUser = mongoose.model("TempUser", tempUserSchema);
export default TempUser;
