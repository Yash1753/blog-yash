import { Comment } from "../models/Comment.model.js";

// 📖 Get comments for a blog
export const getCommentsByBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 💬 Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      blogId: req.params.blogId,
      userId: req.user._id,
      text,
      parentCommentId: null,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 💬 Reply to comment
export const replyToComment = async (req, res) => {
  try {
    const { text } = req.body;

    const parent = await Comment.findById(req.params.commentId);

    if (!parent) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const reply = await Comment.create({
      blogId: parent.blogId,
      userId: req.user._id,
      text,
      parentCommentId: parent._id,
    });

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete comment (Owner + Admin + Moderator)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Allow the comment owner, admins, and moderators to delete
    const isOwner = comment.userId.toString() === req.user._id.toString();
    const isPrivileged = ["admin", "moderator"].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Cascade delete all replies to this comment
    await Comment.deleteMany({ parentCommentId: comment._id });
    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❤️ Like / Unlike comment (atomic)
export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userId = req.user._id;
    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === userId.toString()
    );

    const updated = await Comment.findByIdAndUpdate(
      req.params.commentId,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true }
    );

    res.json({ likes: updated.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};