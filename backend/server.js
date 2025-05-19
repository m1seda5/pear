import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reviewerGroupRoutes from "./routes/reviewerGroupRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { initializeSocket } from "./socket/socket.js";
import cronJobs from "./cron/cron.js";
import noteRoutes from "./routes/noteRoutes.js";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import housePointsRoutes from "./routes/housePointsRoutes.js";
import competitionRoutes from './routes/competitionRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import dailyQuestionRoutes from './routes/dailyQuestionRoutes.js';
import pointsRoutes from './routes/pointsRoutes.js';

dotenv.config();
connectDB();

// Start all cron jobs after DB connection
cronJobs.start();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log Cloudinary configuration status
console.log('Cloudinary configuration:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set',
  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set'
});

// Test Cloudinary connection
cloudinary.api.ping()
  .then(() => console.log('Cloudinary connection successful'))
  .catch(err => console.error('Cloudinary connection error:', err));

const app = express();
const server = http.createServer(app);

// Increase payload size limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    process.env.NODE_ENV === "production" 
      ? "https://pear-tsk2.onrender.com" 
      : "http://localhost:3000",
    "https://res.cloudinary.com"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviewer-groups", reviewerGroupRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/house-points", housePointsRoutes);
app.use('/api/competition', competitionRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/daily-question', dailyQuestionRoutes);
app.use('/api/points', pointsRoutes);

// Initialize socket.io
initializeSocket(server);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error',
      details: err.message 
    });
  }
  
  if (err.name === 'CloudinaryError') {
    return res.status(500).json({ 
      error: 'Cloudinary Error',
      details: err.message 
    });
  }

  // Default error response
  res.status(500).json({ 
    error: err.message || 'Something went wrong',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
