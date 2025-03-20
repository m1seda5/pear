import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const getReviewerDecisions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const decisions = await Post.find({
      "reviewedBy.user": userId
    }).populate('user', 'username profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json(decisions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGroupReviewStats = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const group = await ReviewerGroup.findById(groupId)
      .populate({
        path: 'members',
        select: 'username profilePic'
      });

    const stats = await Promise.all(
      group.members.map(async (member) => {
        const decisions = await Post.find({
          "reviewedBy.user": member._id
        });
        
        return {
          _id: member._id,
          username: member.username,
          profilePic: member.profilePic,
          totalDecisions: decisions.length,
          approvals: decisions.filter(d => d.reviewStatus === 'approved').length,
          rejections: decisions.filter(d => d.reviewStatus === 'rejected').length,
          lastDecision: decisions[0]?.reviewedBy[0]?.decisionDate || null
        };
      })
    );

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getReviewerDecisions, getGroupReviewStats };