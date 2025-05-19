import DailyQuestion from "../models/dailyQuestionModel.js";
import User from "../models/userModel.js";
import GameAuditLog from "../models/gameAuditLogModel.js";

// Admin: Add a new daily question
const addDailyQuestion = async (req, res) => {
  try {
    const { question, options, answer } = req.body;
    if (!question || !options || !answer) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (options.length < 2) {
      return res.status(400).json({ error: "At least 2 options are required" });
    }
    if (!options.includes(answer)) {
      return res.status(400).json({ error: "Answer must be one of the options" });
    }

    const dq = new DailyQuestion({
      question,
      options,
      answer,
      createdBy: req.user._id,
      date: new Date().toISOString().split('T')[0]
    });
    await dq.save();
    res.json({ message: "Daily question added", dq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Edit an existing daily question
const editDailyQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, answer } = req.body;
    if (!question || !options || !answer) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (options.length < 2) {
      return res.status(400).json({ error: "At least 2 options are required" });
    }
    if (!options.includes(answer)) {
      return res.status(400).json({ error: "Answer must be one of the options" });
    }

    const dq = await DailyQuestion.findById(id);
    if (!dq) return res.status(404).json({ error: "Question not found" });
    if (dq.used) return res.status(400).json({ error: "Cannot edit a used question" });

    dq.question = question;
    dq.options = options;
    dq.answer = answer;
    await dq.save();
    res.json({ message: "Daily question updated", dq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete a daily question
const deleteDailyQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const dq = await DailyQuestion.findById(id);
    if (!dq) return res.status(404).json({ error: "Question not found" });
    if (dq.used) return res.status(400).json({ error: "Cannot delete a used question" });
    await dq.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get today's question for user
const getTodayQuestion = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const userAgent = req.headers['user-agent'] || '';
    const sessionKey = `dq_ua_${req.user._id}`;
    // Store UA in memory (or use Redis/DB for production)
    global[sessionKey] = userAgent;
    
    // First try to get an active question for today
    let dq = await DailyQuestion.findOne({ date: today, isActive: true });
    
    // If no active question exists, get a random unused question
    if (!dq) {
      const unusedQuestions = await DailyQuestion.find({ used: false, isActive: true });
      if (unusedQuestions.length === 0) {
        return res.status(404).json({ error: "No questions available" });
      }
      
      // Select a random question
      const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
      dq = unusedQuestions[randomIndex];
      
      // Mark it as used and set today's date
      dq.used = true;
      dq.date = today;
      await dq.save();
    }

    // Don't send the answer to the client
    const questionForClient = {
      _id: dq._id,
      question: dq.question,
      options: dq.options,
      date: dq.date
    };

    res.json(questionForClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User: Answer daily question
const answerDailyQuestion = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const userId = req.user._id;
    const userAgent = req.headers['user-agent'] || '';
    const sessionKey = `dq_ua_${userId}`;
    // Check if UA matches
    if (global[sessionKey] && global[sessionKey] !== userAgent) {
      // Serve backup question batch (simulate with error for now)
      return res.status(400).json({ error: "Browser or device changed. Please answer a backup question batch." });
    }

    const dq = await DailyQuestion.findById(questionId);
    if (!dq) return res.status(404).json({ error: "Question not found" });
    
    // Check if user has already answered correctly
    if (dq.correctUsers.includes(userId)) {
      return res.status(400).json({ error: "Already answered correctly" });
    }
    
    // Check if max correct answers reached
    if (dq.correctUsers.length >= 25) {
      return res.status(400).json({ error: "Max correct answers reached" });
    }

    const isCorrect = dq.answer.trim().toLowerCase() === answer.trim().toLowerCase();
    
    if (isCorrect) {
      // Add user to correct users
      dq.correctUsers.push(userId);
      await dq.save();

      // Award points to user
      const user = await User.findById(userId);
      user.points += 25;
      await user.save();

      // Log the points
      await GameAuditLog.create({
        user: userId,
        action: "daily-question-correct",
        points: 25,
        details: { questionId }
      });

      return res.json({ 
        correct: true, 
        message: "+25 points!",
        correctCount: dq.correctUsers.length
      });
    }

    return res.json({ 
      correct: false, 
      message: "Incorrect answer.",
      correctCount: dq.correctUsers.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get all daily questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await DailyQuestion.find()
      .sort({ date: -1, createdAt: -1 })
      .populate('createdBy', 'name username');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  addDailyQuestion,
  editDailyQuestion,
  deleteDailyQuestion,
  getTodayQuestion,
  answerDailyQuestion,
  getAllQuestions
}; 