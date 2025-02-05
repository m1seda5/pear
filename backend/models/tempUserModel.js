import mongoose from "mongoose";

const tempUserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: {
      values: ['student', 'teacher', 'admin'],
      message: '{VALUE} is not a valid role'
    }
  },
  yearGroup: {
    type: String,
    validate: {
      validator: function(v) {
        // Only required if role is student
        if (this.role === 'student') {
          return !!v;
        }
        return true;
      },
      message: 'Year group is required for students'
    }
  },
  department: {
    type: String,
    validate: {
      validator: function(v) {
        // Only required if role is teacher
        if (this.role === 'teacher') {
          return !!v;
        }
        return true;
      },
      message: 'Department is required for teachers'
    }
  },
  campus: {
    type: String,
    enum: {
      values: ['karen', 'runda', 'admin'],
      message: '{VALUE} is not a valid campus'
    }
  },
  otp: {
    type: Number,
    required: [true, "OTP is required"],
    validate: {
      validator: function(v) {
        // OTP should be a 4-digit number
        return /^\d{4}$/.test(v.toString());
      },
      message: 'OTP must be a 4-digit number'
    }
  },
  otpExpiry: {
    type: Date,
    required: [true, "OTP expiry is required"],
    validate: {
      validator: function(v) {
        // OTP expiry should be in the future
        return v > new Date();
      },
      message: 'OTP expiry must be in the future'
    }
  },
  otpAttempts: {
    type: Number,
    default: 0,
    min: [0, 'OTP attempts cannot be negative'],
    max: [3, 'Maximum OTP attempts exceeded']
  },
  lastOtpSent: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add index for auto-deletion after 10 minutes
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

// Add index for email and username uniqueness
tempUserSchema.index({ email: 1 }, { unique: true });
tempUserSchema.index({ username: 1 }, { unique: true });

// Add virtual for checking if OTP is expired
tempUserSchema.virtual('isOtpExpired').get(function() {
  return Date.now() > this.otpExpiry;
});

// Add methods for OTP validation
tempUserSchema.methods.isValidOtp = function(inputOtp) {
  return !this.isOtpExpired && this.otp === parseInt(inputOtp, 10);
};

tempUserSchema.methods.incrementAttempts = async function() {
  this.otpAttempts += 1;
  await this.save();
  return this.otpAttempts;
};

// Add pre-save middleware for data validation
tempUserSchema.pre('save', function(next) {
  // Convert email to lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  
  // Validate role-specific fields
  if (this.role === 'student' && !this.yearGroup) {
    next(new Error('Year group is required for students'));
  }
  
  if (this.role === 'teacher' && !this.department) {
    next(new Error('Department is required for teachers'));
  }
  
  next();
});

const TempUser = mongoose.model("TempUser", tempUserSchema);
export default TempUser;